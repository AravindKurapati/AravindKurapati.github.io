"""Import my Medium posts from the official RSS feed into src/content/writing/.

Usage: python scripts/import_medium.py [--feed feed.xml]

Each post becomes <slug>.md: frontmatter plus the post's original HTML, unedited apart from
(1) images downloaded into public/writing/<slug>/ and re-pointed there, and (2) Medium's
1px tracking pixel removed. Re-running overwrites the posts it imports and leaves others alone.
"""
import argparse
import hashlib
import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FEED = "https://medium.com/feed/@aravind.kurapati"
NS = {"content": "http://purl.org/rss/1.0/modules/content/", "dc": "http://purl.org/dc/elements/1.1/"}
UA = {"User-Agent": "Mozilla/5.0 (site import)"}


def fetch(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read()


def slugify(title: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", title.lower().replace("’", "").replace("'", "")).strip("-")
    return "-".join(s.split("-")[:9])


def first_paragraph(body: str) -> str:
    for p in re.findall(r"<p>(.*?)</p>", body, flags=re.S):
        text = html.unescape(re.sub(r"<[^>]+>", "", p)).strip()
        if len(text) > 40:
            return text[:220] + ("..." if len(text) > 220 else "")
    return ""


def localise_images(body: str, slug: str) -> str:
    out_dir = ROOT / "public" / "writing" / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    def swap(m: re.Match) -> str:
        src = html.unescape(m.group(2))
        if "/_/stat" in src:
            return ""  # Medium's tracking pixel
        ext = ".png" if ".png" in src.lower() else ".gif" if ".gif" in src.lower() else ".jpg"
        name = hashlib.sha1(src.encode()).hexdigest()[:12] + ext
        target = out_dir / name
        if not target.exists():
            target.write_bytes(fetch(src))
        return f'{m.group(1)}/writing/{slug}/{name}"{m.group(3)}'

    body = re.sub(r'(<img[^>]*?src=")([^"]+)"([^>]*>)', swap, body)
    body = re.sub(r'<img[^>]*?/_/stat[^>]*>', "", body)
    return re.sub(r"<img(?![^>]*loading=)", '<img loading="lazy"', body)


def _strip(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", s))


def _inline(seg: str) -> str:
    seg = re.sub(r"`([^`<]+)`", r"<code>\1</code>", seg)
    seg = re.sub(r"\*\*([^*<]+?)\*\*", r"<strong>\1</strong>", seg)
    return re.sub(r"\[([^\]<]+)\]\((https?://[^)\s]+)\)", r'<a href="\2">\1</a>', seg)


def fix_pasted_markdown(body: str) -> str:
    """Some posts were pasted into Medium as Markdown, so the feed carries it as literal text.
    Turn it into the HTML it was meant to be; the words are untouched."""
    # "## Heading" paragraphs (sometimes wrapped in <strong>)
    body = re.sub(r"<p>(?:<strong>)?#{2,4}\s*(.*?)(?:</strong>)?</p>", lambda m: f"<h3>{m.group(1).strip()}</h3>", body)
    # ``` fenced blocks spread over paragraphs
    def fence(m: re.Match) -> str:
        lines = [_strip(x) for x in re.findall(r"<p>(.*?)</p>", m.group(2), flags=re.S)]
        return "<pre><code>" + html.escape("\n".join(lines)) + "</code></pre>"
    body = re.sub(r"<p>```(\w*)</p>(.*?)<p>```</p>", fence, body, flags=re.S)
    # "> quote" paragraphs
    body = re.sub(r"<p>&gt;\s*(.*?)</p>", r"<blockquote><p>\1</p></blockquote>", body, flags=re.S)
    # runs of "- item" paragraphs
    body = re.sub(r"(?:<p>- .*?</p>\s*)+",
                  lambda m: "<ul>" + "".join(f"<li>{i}</li>" for i in re.findall(r"<p>- (.*?)</p>", m.group(0), flags=re.S)) + "</ul>",
                  body, flags=re.S)
    # inline marks, but never inside code blocks
    parts = re.split(r"(<pre>.*?</pre>|<code>.*?</code>)", body, flags=re.S)
    return "".join(p if p.startswith(("<pre>", "<code>")) else _inline(p) for p in parts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--feed", type=Path)
    a = ap.parse_args()
    xml = a.feed.read_bytes() if a.feed else fetch(FEED)
    items = ET.fromstring(xml).iter("item")
    out = ROOT / "src" / "content" / "writing"
    out.mkdir(parents=True, exist_ok=True)
    for it in items:
        title = it.findtext("title").strip()
        link = it.findtext("link").split("?")[0]
        date = parsedate_to_datetime(it.findtext("pubDate")).date().isoformat()
        body = it.find("content:encoded", NS).text or ""
        slug = slugify(title)
        body = fix_pasted_markdown(localise_images(body, slug))
        # Medium repeats the title as the first heading; the page already shows it.
        body = re.sub(r"^\s*<h3>.*?</h3>", "", body, count=1, flags=re.S)
        front = {"title": title, "date": date, "medium": link, "description": first_paragraph(body)}
        text = "---\n" + "".join(f"{k}: {json.dumps(v, ensure_ascii=False)}\n" for k, v in front.items()) + "---\n\n" + body.strip() + "\n"
        (out / f"{slug}.md").write_text(text, encoding="utf-8")
        print(f"{date}  {slug}")


if __name__ == "__main__":
    main()
