---
title: AlphaFold on a $300 budget
tagline: DeepMind's full AlphaFold2 pipeline, running on one rented GPU with 2.5 TB of reference databases.
kind: Infrastructure · Open source
year: 2025
order: 3
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

## The goal

Run DeepMind's AlphaFold2 end to end, on my own infrastructure, and predict the 3D structure of human insulin from its amino acid sequence. Insulin is small and has a well-known experimental structure, which makes it a good test that every stage of the pipeline actually works.

This is inference, not training. The published weights are about 5 GB. The hard part is everything around them: roughly 2.5 TB of reference databases that the model searches before it predicts anything.

## The setup

One GCP VM with an NVIDIA T4, 8 vCPUs and 30 GB of RAM, a 30 GB boot disk, and a separate 3 TB SSD for the databases, Docker images and outputs. Docker's storage root lives on the big disk, because the images alone would fill the boot disk.

## What broke

Most of the project was debugging, and the log is the useful part.

The boot disk filled to 100% during Docker pulls, so Docker and the apt cache moved to the persistent disk. `nvidia-smi` could not reach the driver because the VM booted a cloud-optimised kernel without the headers the NVIDIA module needed to compile; booting the standard kernel fixed it. The container toolkit failed because a distro-specific repository URL returned an HTML page that corrupted the apt source. And the BFD database, a 272 GB tarball that extracts to about 1.7 TB, ran the disk out of space mid-extraction, which meant expanding the disk and resizing the filesystem live.

## The result

AlphaFold ran and produced structures for all five models. The alignment pulled 675 UniRef90 hits, 372 from BFD and 9 from MGnify, deduplicated to 981 sequences, with 20 templates from the PDB.

## What I would do differently

I fed it a single chain. Insulin's native fold depends on contacts between its A and B chains, so the prediction is a partial structure without the interactions that stabilise it. The next run would use the full proinsulin sequence, or the multimer preset with both chains.
