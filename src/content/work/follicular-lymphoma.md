---
title: Reading lymphoma subtypes from slides
tagline: Can routine H&E pathology slides predict follicular lymphoma subtypes that normally need RNA sequencing?
kind: Research · NYU Langone
year: 2025
order: 5
result:
  value: "ρ = 0.42"
  caption: Correlation between self-supervised patch clusters and transcriptional subtype (p < 0.001), learned with no labels.
facts:
  - { k: Where, v: "NYU Langone Health" }
  - { k: Role, v: "ML Research Intern, 2025" }
  - { k: Methods, v: "ViT-B/16, gated attention MIL" }
  - { k: Data, v: "Gigapixel whole-slide images" }
links:
  - { label: Code, url: "https://github.com/AravindKurapati/Follicular-Lymphoma-Subtypes" }
---

Follicular lymphoma subtypes that predict how fast the disease moves are defined by RNA sequencing, which most labs do not have. H&E slides are everywhere, so the question was whether morphology alone carries the signal.

Each gigapixel slide becomes 800 to 1,000 filtered tissue patches. A ViT encodes them, and a gated attention MIL model pools each slide into one prediction, with the attention weights showing which regions drove it. Two subtypes had only three or four slides each, so I narrowed the task to FL1 vs the rest rather than train a seven-way classifier that would memorise them.
