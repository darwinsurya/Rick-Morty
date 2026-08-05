<div align="center">

```
 ____  _     ____  ____   ___    ____  ___  
|  _ \| |   |  _ \/ ___| / _ \  / ___|/ _ \ 
| |_) | |   | |_) \___ \| | | | \___ \ (_) |
|  _ <| |___|  _ < ___) | |_| |  ___) \__, |
|_| \_\_____|_| \_\____/ \___/  |____/  /_/ 
```

# 🧪 RICK-OS C-137

**A fan-made operating system for the multiverse.**

Portal fluid not included. Handle with care — or don't, honestly, that's kind of Rick's whole thing.

![Portal Fluid](https://img.shields.io/badge/Portal%20Fluid-85%25-%23aff81a?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Operational-%2300affe?style=for-the-badge)
![Wubba Lubba Dub Dub](https://img.shields.io/badge/Wubba%20Lubba%20Dub%20Dub-%F0%9F%8C%8C-%238dcdff?style=for-the-badge)

![React](https://img.shields.io/badge/React-19-%2361DAFB?logo=react&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-%233178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-6-%23646CFF?logo=vite&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)
![Motion](https://img.shields.io/badge/Motion-Framer-%23e91e8c?style=for-the-badge)
![Recharts](https://img.shields.io/badge/Recharts-3-%23F7B500?style=for-the-badge)

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
