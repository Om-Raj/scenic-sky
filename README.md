This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
# scenic-sky (local developer notes)

Lightweight Next.js + TypeScript demo that visualizes Great-Circle flights and seatmap recommendations.

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm, pnpm, or yarn (examples below use npm/pnpm)

## Install

Install dependencies with your preferred package manager:

```bash
# npm
npm install

# or pnpm
pnpm install

# or yarn
yarn install
```

## Run (development)

Start the dev server (hot reload):

```bash
# npm
npm run dev

# or pnpm
pnpm dev
```

Then open http://localhost:3000 in your browser.

## Build & Start (production)

```bash
# build
npm run build

# run the production server
npm run start
```

Replace `npm` with `pnpm` or `yarn` if you prefer those tools.

## Lint & Format

```bash
# lint
npm run lint

# format (prettier)
npm run format
```

## Notes / Troubleshooting

- Demo mode: the app ships with hard-coded demo airports and coordinates. No external airport API is required.
- Iframe scraping: the seatmap scraper will only access iframe content when the iframe is same-origin. For cross-origin seatmaps use a backend extractor or a postMessage-based integration.
- If the map tiles or satellite imagery require a token, check for a `.env` or `.env.local` in the project root and set tokens there (no token is required for the demo behavior included in this repo).
- If you see TypeScript or ESLint errors after editing, run `npm run build` to surface issues and follow the diagnostics.

## Project layout (quick)

- `app/` — Next.js App Router pages and layouts (UI entrypoints)
- `src/components/` — React components (map, flight path, seat UI)
- `src/hooks/` — React hooks and local logic
- `src/lib/` — domain logic (gis, solar calculations, seat scraping)

If you need help running the project or want me to add a short troubleshooting checklist for a specific OS, tell me which OS and package manager you use.
