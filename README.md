# aravindkurapati.github.io

My personal site. Astro, static, deployed to GitHub Pages.

The Now page is generated from my own trackers: a monthly job aggregates them on my laptop and writes `src/data/now.json`, the only personal data that reaches this repo. `npm test` fails the build if that file ever carries coordinates, video ids, money or any key outside the allowlist.

The hero loop in `motion/` is one HTML page whose every frame is a pure function of time, rendered with Playwright and blended for motion blur with ffmpeg.

```
npm install
npm run dev
```
