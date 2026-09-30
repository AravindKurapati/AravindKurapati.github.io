---
title: agent-flight-recorder
tagline: Every Claude Code and Codex session I run, recorded into one searchable SQLite file.
kind: AI tooling
year: 2026
order: 1
featured: true
figure: afr-session
result:
  value: "387 sessions"
  caption: Recorded on my laptop so far, with every tool call, shell command and exit code.
facts:
  - { k: Stack, v: "Python, Typer, SQLite FTS5" }
  - { k: Install, v: "pip install agent-recorder" }
  - { k: Agents, v: "Claude Code, Codex" }
links:
  - { label: Code, url: "https://github.com/AravindKurapati/agent-flight-recorder" }
  - { label: PyPI, url: "https://pypi.org/project/agent-recorder/" }
  - { label: Blog post, url: "/writing/i-built-a-cli-to-read-my-own-claude/" }
---

`afr` reads the session logs Claude Code and Codex already write and puts them into one local SQLite file: the goal, every tool call, every shell command with its exit code, files touched and tokens. A hook ingests each session the moment it closes, so it stays current on its own.

I use it to find the session where I already solved something, to see which commands keep failing, and to jump back into a session in the folder it ran in. Secrets are redacted and nothing leaves the laptop. It just makes my life easier.
