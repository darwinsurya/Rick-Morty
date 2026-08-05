<div align="center">

# 🧪 RICK-OS C-137

**A fan-made operating system for the multiverse.**

Portal fluid not included. Handle with care — or don't, honestly, that's kind of Rick's whole thing.

</div>

---

## What is this?

Rick-OS is a wubba-lubba-dub-dub-styled dashboard that lets you pretend you're running the lab in Dimension C-137. Pick a dimension, burn some portal fluid, poke through character dossiers, chart the Central Finite Curve, and hunt for secrets. It's part toy, part fan art, all beeps and neon.

## Features

- **🌌 Portal Hub** — pick a dimension, watch the portal swirl, and warp between realities. Watch the portal fluid gauge drop, and panic-refill when it hits critical.
- **🧬 Characters** — flick through holographic dossiers of the whole gang: Rick, Morty, Summer, Beth, Jerry, and Diane. Inspect stats, quotes, gear, and associates — or register your own questionable variant.
- **📓 Lab Notes** — Microverse Battery schematics, a grocery list that includes *Kalaxian Crystals*, a live data stream that is honestly just vibes, and a data-export button that copies "classified" JSON to your clipboard.
- **🗺️ Multiverse Map** — chart the Central Finite Curve, scan unmapped sectors, and add your own dimensions. Somewhere out there is a place you probably shouldn't visit.
- **🥚 Easter eggs everywhere** — type secret words, tap the avatar seven times, punch in the Konami code, and unlock a full catalog of hidden surprises. There's even a Memory Vial about Diane if you look hard enough.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** for building
- **Tailwind CSS v4** for styling
- **Motion** (Framer Motion) for animations
- **Recharts** for the portal-fluid trend chart
- **Web Audio + SpeechSynthesis** for all the synthetic beeps and "Rick speaks now" moments

## Run Locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000` (or whatever port Vite picks).

> No API key needed — all data lives in the codebase. Egg discoveries are saved to your browser's `localStorage`.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Add `base: '/<your-repo-name>/'` to `vite.config.ts`.
3. Create `.github/workflows/deploy.yml` (build + deploy with the `actions/deploy-pages` workflow).
4. Repo → **Settings → Pages → Source: GitHub Actions**.

Every push to `main` then auto-deploys.

## Disclaimer

This is an unofficial, non-commercial fan project made for fun. *Rick and Morty* and its characters are property of their respective owners. All images used are decorative placeholders.

---

<div align="center">

*"To live is to suffer, to survive is to find some meaning in the suffering."* — Rick Sanchez C-137

</div>
