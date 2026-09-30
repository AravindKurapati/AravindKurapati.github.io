---
title: querencia
tagline: A personal knowledge graph of places, built from my own Google Maps history.
kind: Personal tooling
year: 2026
order: 7
result:
  value: "386 places"
  caption: From 1,038 geotagged photos, 86 reviews and 21 trips, in one local SQLite file.
facts:
  - { k: Stack, v: "Python, SQLite, sqlite-vec" }
  - { k: Surfaces, v: "CLI, MCP server" }
links:
  - { label: Code, url: "https://github.com/AravindKurapati/querencia" }
---

- Google wiped my Timeline history in 2024, but my Maps contributions survived: reviews, photos, saved places, routes.
- querencia turns them into a graph I can search by meaning and draw.
- It answers things like "what would I like in a city I have never been to?"
- Runs locally, and as an MCP server so Claude can query it. My gym tracker reads it to tag walks.
