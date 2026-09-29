---
title: Reading lymphoma subtypes from slides
tagline: Can routine H&E pathology slides predict follicular lymphoma subtypes that normally need RNA sequencing?
kind: Research · NYU Langone
year: 2025
order: 9
draft: true
result:
  value: "ρ = 0.42"
  caption: Correlation between self-supervised patch clusters and transcriptional subtype (p < 0.001). The encoder learned real morphology, with no labels.
facts:
  - { k: Where, v: "NYU Langone Health" }
  - { k: Data, v: "Gigapixel whole-slide images, 850K+ tiles" }
  - { k: Methods, v: "Barlow Twins SSL, gated attention MIL" }
  - { k: Compute, v: "NYU HPC, SLURM" }
links:
  - { label: Code, url: "https://github.com/AravindKurapati/Follicular-Lymphoma-Subtypes" }
  - { label: Blog post, url: "https://medium.com/@aravind.kurapati/when-100-cold-emails-and-850k-histopathology-tiles-changed-everything-bd8a4e9bbfbc" }
---

## Why it matters

Follicular lymphoma is clinically uneven. About one in five patients progresses quickly, while others stay stable for years. RNA sequencing reveals subtypes that predict which is which, but it is expensive, slow and missing from most labs. H&E slides are cheap and everywhere. The question was whether morphology alone carries the signal.

## The pipeline

Each gigapixel slide is cut into 224×224 patches, with glass, blur and artifacts filtered out, leaving roughly 800 to 1,000 tissue patches per slide. A ResNet-50 learns from those patches with Barlow Twins, a self-supervised method, because labelling 800K+ patches by hand is not an option. A gated attention model then pools each slide's patches into one prediction, and its attention weights show which regions of tissue drove the call.

## Checking the encoder learned biology

Before trusting any classifier, I clustered the patch embeddings (k-NN graph, Leiden communities, UMAP) and checked them against subtype labels. Cluster membership correlated with transcriptional subtype (Spearman ρ = 0.42, p < 0.001), and the clusters mapped to recognisable tissue: immune-dense regions, follicular structures, sparse fibrotic stroma.

## The decision that mattered

The in-domain self-supervised ResNet beat an ImageNet ViT. That is not ResNet beating ViT as an architecture; it is domain-adapted beating generic. The natural next step is a ViT pretrained on pathology itself. I also narrowed the task to FL1 vs not-FL1: two subtypes had only three or four samples each, and a seven-way classifier on that data would have memorised them.


## What's next

Fusing slide embeddings with RNA-seq features. RNA-seq alone reaches 85% accuracy and H&E alone 71%; the combined model is in progress.
