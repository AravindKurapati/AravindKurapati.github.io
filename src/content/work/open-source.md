---
title: Open source
tagline: Fixes and tested answers in the ML repos I actually use.
kind: Open source
year: 2026
order: 6
result:
  value: "117 / 117"
  caption: AlphaFold 3 data tests passing on both the pinned RDKit and the 2026 release, posted on issue #748.
facts:
  - { k: Repos, v: "AlphaFold 2 and 3, prime-rl, verifiers" }
  - { k: Rule, v: "Reproduce before posting" }
links:
  - { label: verifiers PR, url: "https://github.com/PrimeIntellect-ai/verifiers/pull/2635" }
  - { label: prime-rl, url: "https://github.com/PrimeIntellect-ai/prime-rl/pull/3708#issuecomment-5878301166" }
  - { label: AlphaFold 3, url: "https://github.com/google-deepmind/alphafold3/issues/748#issuecomment-5874784873" }
---

I pick up issues in tools I already run and answer them only after reproducing them. For AlphaFold 3, I built it on a cloud container and ran the data tests against both RDKit versions before saying the upgrade was safe. For a prime-rl fix nobody had run on a GPU, I showed the test failing 4 of 8 on main and passing 8 of 8 with the patch.

Smaller ones: a docs PR to verifiers stating it needs Linux or macOS, and answers on AlphaFold 2 issues that had sat open for months with no reply.
