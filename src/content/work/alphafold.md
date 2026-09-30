---
title: AlphaFold on a $300 budget
tagline: DeepMind's full AlphaFold2 pipeline, running on one rented GPU with 2.5 TB of reference databases.
kind: Infrastructure · Open source
year: 2025
order: 3
featured: true
figure: msa-sources
result:
  value: "981 sequences"
  caption: The final multiple sequence alignment for insulin, built from UniRef90, BFD and MGnify, with 20 structural templates found.
facts:
  - { k: GPU, v: "NVIDIA T4, 16 GB" }
  - { k: Data, v: "2.5 TB of databases on a 3 TB disk" }
  - { k: Stack, v: "GCP, Docker, CUDA, JAX" }
  - { k: Budget, v: "$300 in credits" }
links:
  - { label: Code, url: "https://github.com/AravindKurapati/alphafold-prediction" }
  - { label: Blog post, url: "/writing/when-300-and-2-8tb-nearly-broke-my-alphafold/" }
---

I ran DeepMind's AlphaFold2 end to end on one GCP VM with a T4 and predicted the structure of human insulin. The weights are 5 GB; the hard part is the 2.5 TB of databases it searches first.

Most of the work was infrastructure: a boot disk that filled during Docker pulls, a cloud kernel without the NVIDIA headers, a corrupted apt source, and a 1.7 TB database extraction that ran the disk dry halfway through. It ran, and produced all five models.
