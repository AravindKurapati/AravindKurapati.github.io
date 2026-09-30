---
title: durable-notebook
tagline: An RL environment for asking whether a grader holds up once a policy is trained against it.
kind: RL research
year: 2026
order: 2
featured: true
figure: cheat-rate
result:
  value: "40.7% vs 7.4%"
  caption: Cheat rate over the last 20 training steps, trained against the naive grader vs the hardened one.
facts:
  - { k: Model, v: "Qwen3-1.7B, GRPO" }
  - { k: Scale, v: "60 steps per grader, 4,043 rollouts" }
  - { k: Published, v: "Prime Intellect Environments Hub" }
links:
  - { label: Code, url: "https://github.com/AravindKurapati/durable-notebook" }
---

- The model's context is compacted every few turns, so to remember a fact it has to write it to a file and cite that file later.
- A **naive** grader checks the file exists. A **hardened** grader checks the answer is actually in it.
- Trained with GRPO against the naive grader, cheating rose from 16% to 41% while the real answers got worse.
- Against the hardened grader, cheating fell to 7%.
- Every rollout is re-scored under both graders, so the gap is measured per episode. Across two seeds, a 41 to 65% reduction.
