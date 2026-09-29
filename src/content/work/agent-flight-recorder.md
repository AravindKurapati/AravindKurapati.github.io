---
title: agent-flight-recorder
tagline: Every Claude Code and Codex session I run, recorded into one searchable SQLite file.
kind: AI tooling
year: 2026
order: 1
figure: afr-commands
result:
  value: "7 sessions, 1 shipped"
  caption: The first month of data showed seven attempts at the same Modal deployment fix. Four blocked, two abandoned.
facts:
  - { k: Stack, v: "Python, Typer, SQLite FTS5" }
  - { k: Install, v: "pip install agent-recorder" }
  - { k: Agents, v: "Claude Code, Codex" }
links:
  - { label: Code, url: "https://github.com/AravindKurapati/agent-flight-recorder" }
  - { label: PyPI, url: "https://pypi.org/project/agent-recorder/" }
  - { label: Blog post, url: "/writing/i-built-a-cli-to-read-my-own-claude/" }
---

## The problem

One Friday night in March I tried to work out what I had done that week. I had opened Claude Code in about five project folders and remembered fixing something in a Modal endpoint. Nothing past that.

All of it was already on my laptop. `~/.claude/projects/` held about 230 session files, one JSONL per session, with every prompt, tool call, shell command, error and token count. The agent had been keeping a detailed log of my work the whole time, and nothing read it.

## What it does

`afr` parses the session logs Claude Code and Codex already write and puts them into one SQLite database. For each session it keeps the goal (the first message), every tool call with success or failure, every shell command with its exit code, every file touched, and token counts. I add an outcome tag later: shipped, blocked, abandoned or exploratory.

A `Stop` hook ingests each session the moment it closes, so the database stays current without me thinking about it. `afr search` answers "have I done this before?" before I spend a new session re-explaining a project. `afr errors` groups failed commands by exact command and exit code, so a failure I keep hitting shows up as a count instead of a surprise.

## The decision that mattered

Keep it local and boring. Session logs contain unreleased code and prompts I would rather not put on someone else's server, even behind a redactor. SQLite is a single file that backs up by copying and stays readable with `sqlite3` if I stop maintaining the CLI. Keys, tokens and `.env` contents are redacted before anything is written.

## What I learned from it

The first time I ran `afr list` across a month, I found seven sessions with some version of "fix the Modal deployment." Four blocked, two abandoned, one shipped. Seeing that table in week two instead of week five would have sent me to the docs much sooner. The tool mostly makes it harder to lie to myself about my own work.

## Limits

Two agents only. Outcome tags are manual. Skill extraction (`afr extract-skills`) clusters sessions by keyword similarity, which is a heuristic, and it always asks before writing anything.
