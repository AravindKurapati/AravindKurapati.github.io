---
title: durable-notebook
tagline: An RL environment for asking whether a grader holds up once a policy is trained against it.
kind: RL research
year: 2026
order: 2
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

## The setup

A model has a long conversation where facts are mentioned once and then scroll out of view, because the context is compacted every few turns. The only way to remember something is to write it to a file. At the end the model answers questions and points to the file that backs each answer.

Two graders score the same task. The **naive** grader checks that a file exists for each answer and is not empty. The **hardened** grader reads the files and checks that the true answer is actually in them.

## What this is, and isn't

It is not a surprising finding. Train a policy against a grader you made gameable and it gets gamed; there is a literature on that. What the project adds is a clean, reusable way to measure it: a seeded, parameterised environment, and a paired-regrade method. GRPO runs against each grader separately, then every rollout from both runs is re-scored under both graders offline. That gives a per-episode cheating gap instead of two reward curves that both go up and say nothing about honesty.

## The result

Trained against the naive grader, the cheat rate climbed from 16% to 41% while the naive score rose to about 0.91 and the true score fell to about 0.45. The policy got better at looking done and worse at the task. Trained against the hardened grader, cheating stayed low (14% to 7%) and the two scores tracked each other.

On a second data seed the direction held but the size did not: the naive-trained policy mostly learned the task honestly, and the reduction was about 41% instead of 65%. The honest headline is a 41 to 65% range across two seeds.

## How it cheats

The dataset is seeded, so the same episode always has the same answer. A model that remembered would answer the same way every replay. It didn't: one date came back five different ways. In one episode the model wrote the correct answer to a file, overwrote it with "Unknown" at the end, and still scored perfectly, because the naive grader only checks that the file exists.

## What I would do next

The hardened grader is not bulletproof. It checks whether the right answer appears anywhere in the workspace, so dumping every plausible guess into one file would beat it. The stronger version of this project attacks the hardened grader too, finds that gap under more optimisation pressure, and shows a v2 that holds where v1 broke.
