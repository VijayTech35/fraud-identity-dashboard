# TrustGuard Console

Production-level Next.js web app for **Ad Fraud Detection** and **User Identity Verification** with interactive charts, simulated real-time updates, export capabilities, and reusable UI patterns.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Recharts
- `next-themes` (persistent dark/light mode)
- Jest + React Testing Library

## Modules

- `Ad Fraud Detection`: KPI cards, filters, trend/distribution/source charts, hotspot map, incidents table with action controls.
- `Identity Verification`: workflow status cards, real-time progress simulation, extracted profile panel, verification history and exports.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you will be redirected to `/fraud`.

## Testing

```bash
npm run test
```

## Build

```bash
npm run build
```

## Deployment

Deploy on [Vercel](https://vercel.com/new) for production hosting.
