# Portfolio – Claude Code Spec

This is a static single-file portfolio site (`index.html`) deployed via GitHub Pages from the `main` branch.

## Current state

The working branch is `feat/portfolio-improvements`. All changes should be made on this branch. Do NOT commit to `main`.

The `index.html` on this branch was partially updated in a previous session. **Before making any changes, verify the file is complete** — check that it ends with `</footer></body></html>`. If it is truncated, reconstruct the missing footer from the structure below.

### Expected footer structure
```html
  <footer>
    <span>© 2026 Kurapati Sreenivas Aravind</span>
    <div class="footer-links">
      <a href="https://linkedin.com/in/aravind-kurapati" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="https://medium.com/@aravind.kurapati" target="_blank" rel="noopener noreferrer">Blog</a>
      <a href="https://github.com/AravindKurapati" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </footer>
</body>
</html>
```

---

## Stack

- Pure HTML/CSS/JS — no build step, no framework, no npm
- Single file: `index.html`
- External: Google Fonts (Syne, DM Mono, DM Sans), `css/styles.css` (external sheet, mostly overridden by inline styles)
- Deployed: GitHub Pages from `main` branch
- Preview locally: `python -m http.server 8000` then open `localhost:8000`

---

## Tasks for CC

Work through these in order. Commit each logical group separately with a clear message.

### 1. Verify & fix file integrity
- Check `index.html` ends with `</body></html>`
- If truncated, restore the footer (see above) and any missing closing tags
- Run a quick sanity check: all opened `<section>` tags should be closed, all `<div class="container">` should be closed

### 2. Fix broken links
Every project and publication currently has placeholder or generic links. Replace with real URLs:

**Projects:**
| Project | GitHub URL | Blog URL |
|---|---|---|
| AI Prompt Watch | `https://github.com/AravindKurapati/system_prompts_leaks` | `https://aravindkurapati.github.io/system_prompts_leaks` (live link, not blog) |
| AlphaFold Pipeline | `https://github.com/AravindKurapati` | `https://medium.com/@aravind.kurapati/when-300-and-2-8tb-nearly-broke-my-alphafold-dreams-c58d8d75df7b` |
| FinSight RAG | `https://github.com/AravindKurapati` | `https://medium.com/@aravind.kurapati/why-most-engineers-miss-this-underrated-art-of-llm-inference-optimization-30eb7dc8dbe7` |
| Multi GPU HPC | `https://github.com/AravindKurapati` | `https://medium.com/@aravind.kurapati/when-100-cold-emails-and-850k-histopathology-tiles-changed-everything-bd8a4e9bbfbc` |
| WSI Classification | `https://github.com/AravindKurapati` | none |

Note: AlphaFold, FinSight, Multi GPU, WSI — the actual individual repos may not be public yet. Keep the links pointing to the profile root (`https://github.com/AravindKurapati`) until specific repo URLs are provided. Do NOT fabricate repo URLs.

**Publications:**
| Paper | Real link |
|---|---|
| Pneumonia/COVID-19 detection | Keep `https://www.researchgate.net` for now — real DOI not provided |
| Lung Cancer classification | Keep `https://ieeexplore.ieee.org` for now — real DOI not provided |

Note: leave pub links as-is until real DOIs are provided. Do not change them.

### 3. Add `rel="noopener noreferrer"` to all external links
Every `<a target="_blank">` needs `rel="noopener noreferrer"`. Search the file and add it everywhere it's missing.

### 4. Add Open Graph + SEO meta tags
Add these to the `<head>`, after the existing meta tags:

```html
<!-- SEO -->
<meta name="author" content="Aravind Kurapati">
<link rel="canonical" href="https://aravindkurapati.github.io/">

<!-- Open Graph (LinkedIn/Twitter previews) -->
<meta property="og:title" content="Aravind Kurapati | ML Engineer">
<meta property="og:description" content="ML Engineer and software developer. NYU CS grad. Working on AI research, LLM inference, and computer vision.">
<meta property="og:url" content="https://aravindkurapati.github.io/">
<meta property="og:type" content="website">
<meta property="og:image" content="https://aravindkurapati.github.io/assets/images/profile.jpeg">

<!-- Twitter card -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Aravind Kurapati | ML Engineer">
<meta name="twitter:description" content="ML Engineer and software developer. NYU CS grad.">
<meta name="twitter:image" content="https://aravindkurapati.github.io/assets/images/profile.jpeg">
```

Also update the existing `<title>` tag:
```html
<title>Aravind Kurapati | ML Engineer</title>
```

### 5. Add lazy loading to images
Add `loading="lazy"` to all `<img>` tags **except** the hero profile image (that one should load eagerly).

```html
<!-- hero — no lazy loading -->
<img src="assets/images/profile.jpeg" alt="Aravind" ...>

<!-- all others — add loading="lazy" -->
<img src="assets/images/violin.jpg" alt="Violin" loading="lazy" ...>
<img src="assets/images/place1.jpeg" alt="Paris" loading="lazy">
<!-- etc -->
```

### 6. Add mobile hamburger menu
The nav currently hides `ul` on mobile (`nav ul { display: none }`). Add a working hamburger menu.

Requirements:
- Hamburger button (☰) visible only on mobile (≤820px)
- Clicking it toggles a dropdown nav below the navbar
- Clicking a nav link closes the menu
- No external libraries — pure CSS/JS only
- Style consistent with existing nav (dark background, monospace font, same colors)

Suggested implementation:
```html
<!-- add inside <nav>, after <ul> -->
<button class="nav-toggle" aria-label="Toggle navigation" onclick="document.querySelector('nav ul').classList.toggle('open')">☰</button>
```

```css
/* add to styles */
.nav-toggle {
  display: none;
  background: none; border: 1px solid var(--border);
  color: var(--text); font-size: 1.2rem;
  padding: 0.3rem 0.7rem; border-radius: 4px; cursor: pointer;
}
@media (max-width: 820px) {
  .nav-toggle { display: block; }
  nav ul { display: none; flex-direction: column; position: absolute; top: 60px; left: 0; right: 0; background: rgba(10,10,15,0.97); border-bottom: 1px solid var(--border); padding: 1rem 1.5rem; gap: 1rem; }
  nav ul.open { display: flex; }
}
```

Also add JS to close the menu when a link is clicked:
```js
document.querySelectorAll('nav ul a').forEach(a => {
  a.addEventListener('click', () => document.querySelector('nav ul').classList.remove('open'));
});
```

Put the script just before `</body>`.

### 7. Add active nav highlighting on scroll
As the user scrolls, highlight the nav link corresponding to the current section.

```js
// Add to the script block before </body>
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`nav ul a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => observer.observe(s));
```

```css
nav ul a.active { color: var(--accent2); }
```

### 8. Add scroll-to-top button
Add a button that appears after scrolling down 400px and smoothly scrolls back to top.

```html
<!-- add just before </body> -->
<button id="scrollTop" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Scroll to top">↑</button>
```

```css
#scrollTop {
  position: fixed; bottom: 2rem; right: 2rem; z-index: 200;
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--accent); color: #fff; border: none;
  font-size: 1.1rem; cursor: pointer;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s;
}
#scrollTop.visible { opacity: 1; pointer-events: auto; }
```

```js
const scrollBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
});
```

### 9. Add resume download link
Add a "Download CV" button to the hero section, next to the existing CTA buttons.

```html
<a href="assets/resume.pdf" download class="btn btn-outline">↓ Resume</a>
```

Note: this assumes a file at `assets/resume.pdf`. If no PDF exists yet, add the button but set `href="#"` and add a `title="Coming soon"` attribute — do NOT fabricate or generate a PDF. The user will drop the file into `assets/` manually.

### 10. Improve hero bio copy
Replace the current generic bio:

> "Technologist working on applying machine learning to solve problems. Background includes both research-oriented AI projects and enterprise software development. Seeking to work on initiatives with transformative potential and high scientific value."

With something sharper — keep it honest but more specific:

> "ML Engineer with a background in computer vision, LLM inference, and enterprise data pipelines. MS Computer Science from NYU. I build things that ship — from cancer detection models to system prompt trackers — and write about it on Medium."

---

## Design constraints
- Keep the existing color palette and fonts — do not change CSS variables
- Keep the single-file approach — do not split into multiple HTML files
- Dark theme only — do not add a light mode toggle
- No new external JS libraries

## After all tasks are done
- Preview with `python -m http.server 8000` and verify:
  - Footer renders correctly
  - Mobile nav works at 375px viewport
  - Scroll-to-top appears after scrolling
  - Nav highlights update on scroll
  - All external links have `rel="noopener noreferrer"`
  - OG tags present in `<head>`
- Commit with message: `feat: portfolio polish — mobile nav, OG tags, scroll-to-top, active nav, lazy images, bio update`
