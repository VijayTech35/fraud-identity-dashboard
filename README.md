# Fraud & Identity Dashboard

A production-grade SaaS dashboard for ad fraud detection and user identity verification built with Next.js, TypeScript, and shadcn/ui.

## Features

- **Ad Fraud Detection** - Monitor suspicious traffic, blocked incidents, and campaign risk signals
- **Identity Verification** - Track phone checks, document OCR, and face matching confidence in real time
- **Dark/Light Mode** - Seamless theme switching with persistent preferences
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **Export Capabilities** - CSV and PDF export for incident reports and verification logs
- **Interactive Charts** - Recharts-powered line, pie, and bar charts with custom tooltips

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Card, Button, Badge, Table, Select, Input, Progress, Sheet)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm run test

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Redirects to /fraud
│   ├── layout.tsx            # Root layout with theme provider
│   ├── globals.css           # Global styles and CSS variables
│   ├── fraud/page.tsx        # Ad Fraud Detection dashboard
│   └── verification/page.tsx # Identity Verification dashboard
├── components/
│   ├── ui/                   # shadcn/ui components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx
│   │   └── table.tsx
│   └── layout/
│       └── app-shell.tsx     # Main layout with responsive sidebar
└── lib/
    ├── export.ts             # CSV and PDF export utilities
    └── utils.ts              # cn() utility for class merging
```

## Deployment

Deploy on Vercel by connecting this repository. No additional configuration needed.

## License

MIT
