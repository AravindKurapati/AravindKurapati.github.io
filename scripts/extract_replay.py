"""Extract one durable-notebook rollout into src/data/replay.json for the write-up's replay.

Usage:
  python scripts/extract_replay.py <traces.jsonl> <rollout_id> <regrade.csv> [--out src/data/replay.json]

Everything comes from the recorded trace: the facts as the user stated them, every file the
model wrote, what was still inside its context window at each turn, and the manifest it
submitted. Other rollouts of the same episode (same idx) are included for the variance table.
Model text is copied verbatim; nothing is edited except trimming whitespace.
"""
import argparse
import csv
import json
import re
from pathlib import Path

FACT = re.compile(r"\(key: (\w+)\)")


def load(traces: Path, ids: set[str]) -> dict:
    out = {}
    with traces.open(encoding="utf-8") as fh:
        for line in fh:
            if any(i in line[:80] for i in ids):
                rec = json.loads(line)
                if rec["id"] in ids:
                    out[rec["id"]] = rec
    return out


def manifest(rec: dict) -> dict:
    for n in rec["nodes"]:
        for tc in n["message"].get("tool_calls") or []:
            if tc["name"] == "submit_manifest":
                return {e["slot"]: e["answer"] for e in json.loads(tc["arguments"]).get("entries", [])}
    return {}


def path_to_root(nodes: list, k: int) -> list[int]:
    out = []
    while k is not None:
        out.append(k)
        k = nodes[k]["parent"]
    return out[::-1]


def timeline(rec: dict) -> tuple[list, dict]:
    nodes = rec["nodes"]
    # A user turn is new (not a replay after compaction) when the model sampled a reply to it.
    answered = {n["parent"] for n in nodes if n["message"]["role"] == "assistant" and n.get("sampled")}
    step_of: dict[int, int] = {}      # node index -> step index, for new user turns
    first_seen: dict[str, int] = {}   # user text -> latest step where it was said so far
    steps, truth = [], {}
    for k, n in enumerate(nodes):
        m = n["message"]
        text = m.get("content") if isinstance(m.get("content"), str) else ""
        if m["role"] == "user" and k in answered:
            step_of[k] = len(steps)
            first_seen[text] = len(steps)  # most recent time this text was said
            keys = FACT.findall(text)
            question = text.startswith("That's everything I have")
            if keys and not question:
                # The last statement of a key is its true value (updates overwrite).
                truth[keys[0]] = text
            steps.append({"who": "user", "text": text.strip(), "question": question})
        elif m["role"] == "assistant" and n.get("sampled"):
            # Earliest step still inside the context window: map each user message on this
            # node's path back to the step where it was said (replays share the text).
            visible = set()
            for i in path_to_root(nodes, k):
                mi = nodes[i]["message"]
                if mi["role"] == "user" and isinstance(mi.get("content"), str):
                    visible.add(step_of.get(i, first_seen.get(mi["content"], len(steps))))
            calls = [{"tool": tc["name"], "args": json.loads(tc["arguments"])} for tc in m.get("tool_calls") or []]
            steps.append({"who": "model", "text": (text or "").strip(), "calls": calls,
                          "visible_from": min(visible) if visible else len(steps)})
    return steps, truth


TRUE_VALUE = re.compile(r" is (.+?)\. \(key:| changed to (.+?)\. \(key:")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("traces", type=Path)
    ap.add_argument("rollout")
    ap.add_argument("regrade", type=Path)
    ap.add_argument("--out", type=Path, default=Path("src/data/replay.json"))
    a = ap.parse_args()

    rows = list(csv.DictReader(a.regrade.open(encoding="utf-8")))
    me = next(r for r in rows if r["id"] == a.rollout)
    same = [r for r in rows if r["idx"] == me["idx"]]
    recs = load(a.traces, {r["id"] for r in same})

    steps, truth_lines = timeline(recs[a.rollout])
    truth = {}
    for key, line in truth_lines.items():
        m = TRUE_VALUE.search(line)
        truth[key] = (m.group(1) or m.group(2)).strip()

    step = int(re.search(r"step(\d+)", a.traces.name).group(1))
    data = {
        "source": {"run": "Stage 1 (trained against the naive grader), data seed 1000", "step": step,
                   "episode_idx": int(me["idx"]), "rollout": a.rollout},
        "truth": truth,
        "scores": {"naive": float(me["naive_overall"]), "hardened": float(me["hardened_overall"])},
        "steps": steps,
        "submitted": manifest(recs[a.rollout]),
        "replays": [{"naive": float(r["naive_overall"]), "hardened": float(r["hardened_overall"]),
                     "answers": manifest(recs[r["id"]])} for r in same],
    }
    a.out.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {a.out}: {len(steps)} steps, truth={truth}, {len(same)} rollouts of idx {me['idx']}")


if __name__ == "__main__":
    main()
