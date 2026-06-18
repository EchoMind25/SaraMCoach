# Sarah Mitchell — Demo Coaching Site + AI Lead System

A productized, conversion-optimized website with a 24/7 Claude-powered lead
assistant, built to the spec in [`../docs/braxton-prd-v1-build-spec.html`](../docs/braxton-prd-v1-build-spec.html).

> **Demo note:** "Sarah Mitchell" is a fictional client used to showcase the
> system. All client-specific content lives in [`src/lib/content.ts`](src/lib/content.ts);
> swapping it is the bulk of customizing this for a real coach.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **CSS Modules** + a canonical design-token system in [`src/app/globals.css`](src/app/globals.css)
- Self-hosted fonts via `next/font` (Syne / Inter / JetBrains Mono)
- **Claude API** (`@anthropic-ai/sdk`, `claude-sonnet-4-6`) for the lead assistant
- **Supabase** (lead storage) + **Resend** (email notifications) — optional
- Deploys to **Vercel** with zero config

## Local development

```bash
npm install
cp .env.example .env.local   # optional — see "Go live" below
npm run dev                  # http://localhost:3000
```

The site runs fully **without any keys**: the assistant falls back to a scripted
flow and captured leads are logged to the server console.

```bash
npm run build   # production build (TypeScript + ESLint + static export)
npm start        # serve the production build
```

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx            Root layout: fonts, metadata, Nav, Footer, LeadAssistant
│  ├─ page.tsx              Home (hero + particle field, social proof, offers, CTA)
│  ├─ about|services|results|contact/   The five pages (§05)
│  ├─ api/chat/route.ts     Claude proxy + rate limiting (server-only key)
│  ├─ api/lead/route.ts     Lead → Supabase + Resend
│  ├─ icon.tsx · opengraph-image.tsx · twitter-image.tsx
│  ├─ sitemap.ts · robots.ts · not-found.tsx
│  └─ globals.css           Design tokens (single source of truth)
├─ components/
│  ├─ ui/                   Button, GlassCard, Callout, Badge, SectionEyebrow/Title
│  ├─ layout/               Nav, Footer
│  ├─ sections/             PageHero, CTASection
│  ├─ motion/               useScrollReveal, Reveal
│  ├─ visual/               ParticleField (hero canvas)
│  ├─ contact/              BookingPanel, ContactForm
│  └─ assistant/            LeadAssistant (the chat widget)
└─ lib/
   ├─ content.ts            ← all client content (swap this per coach)
   ├─ assistant.ts          Chat script copy
   └─ metadata.ts           Per-page metadata helper
```

## Going live

The demo is fully functional offline. To make it a real, deployed client site,
follow **[GO-LIVE.md](GO-LIVE.md)** — it lists every step that needs your input
(API keys, accounts, real Calendly link, domain, photos), with copy-paste config.
