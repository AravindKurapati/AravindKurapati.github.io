---
title: Lung cancer subtypes, without labels
tagline: Barlow Twins self-supervised learning on 841K lung pathology tiles, then an InceptionV3 on top.
kind: Research · NYU Langone
year: 2024
order: 4
figure: hpc-tiles
result:
  value: "841K tiles"
  caption: TCGA lung adenocarcinoma and squamous cell carcinoma, 1,022 slides, stored as HDF5 and trained on NYU HPC.
facts:
  - { k: Where, v: "NYU Langone Health" }
  - { k: Role, v: "Research Assistant, 2024" }
  - { k: Methods, v: "Barlow Twins, Leiden, InceptionV3" }
  - { k: Compute, v: "NYU HPC, multi-GPU SLURM" }
links:
  - { label: Code, url: "https://github.com/AravindKurapati/TCGA-Lung-Inception-NYU-HPC" }
  - { label: Paper I built on, url: "https://www.nature.com/articles/s41467-024-48666-7" }
  - { label: Blog post, url: "/writing/when-100-cold-emails-and-850k-histopathology-tiles-changed/" }
---

- Reproduced the lab's Histomorphological Phenotype Learning pipeline on NYU's HPC cluster.
- Barlow Twins learns an embedding for every H&E tile with no labels; Leiden clustering groups tiles into tissue phenotypes like the ones above.
- Tested whether an InceptionV3 on each slide's grid of tile embeddings could beat the paper's logistic regression on cluster proportions. It did not.
- Most of the work was plumbing: HDF5 tile stores, multi-GPU SLURM jobs, and a patient-level train/test split.
