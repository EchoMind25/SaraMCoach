# Go-Live Checklist — your manual steps

Everything in the build is done. This file lists the steps that need **you** —
accounts, secrets, the real booking link, photos, and the domain. The site works
without any of these (demo fallbacks), so do them in any order; each one upgrades
the demo toward production.

Legend: 🔑 needs an account/secret · ✏️ a quick edit · 🌐 hosting/DNS

---

## 1. 🔑 Claude API — turn on live AI replies

Today the assistant runs a smart scripted flow. Add a key to let it answer
free-text questions with Claude.

1. Create a key at **console.anthropic.com → API Keys**.
2. Add to `.env.local` (local) and to your host's env vars (production):

```bash
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6   # already the default
```

No key = the assistant still works, using the built-in fallback reply.

---

## 2. 🔑 Supabase — store captured leads

1. Create a project at **supabase.com**.
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) (creates the `leads` table).
3. Copy **Project URL** and the **service_role** key (Settings → API), then set:

```bash
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # service_role (server-side only — never exposed to the browser)
```

No keys = leads are logged to the server console instead of stored.

---

## 3. 🔑 Resend — lead emails (internal alert + visitor confirmation)

1. Create an account at **resend.com** and create an API key.
2. Set:

```bash
RESEND_API_KEY=re_...
LEAD_NOTIFY_EMAIL=sarah@herdomain.com    # where new-lead emails go
LEAD_FROM_EMAIL=assistant@herdomain.com  # a verified sender on your Resend domain
```

**No domain yet?** You don't need one to start. Resend lets you send **from**
`onboarding@resend.dev` **to your own account email** (the address you signed up
with) without verifying a domain — perfect for a single-recipient lead alert:

```bash
RESEND_API_KEY=re_...
LEAD_FROM_EMAIL=onboarding@resend.dev    # Resend's shared test sender
LEAD_NOTIFY_EMAIL=you@youremail.com      # MUST be your Resend signup email
```

Limits until you verify a domain: you can only deliver to that one address, and
the "from" stays `resend.dev`. When you get a domain (≈$10/yr at Namecheap or
Cloudflare), verify it in Resend and switch `LEAD_FROM_EMAIL` to a branded sender.
A free `*.vercel.app` subdomain can't be used here — Resend needs a domain whose
DNS you control.

**Two emails are sent per captured lead:** (1) an internal alert to
`LEAD_NOTIFY_EMAIL`, and (2) a branded confirmation to the visitor that includes
the demo disclaimer and the booking link. The visitor confirmation can only reach
arbitrary addresses **after your domain is verified in Resend** — until then it
fails gracefully (logged, never breaks the chat) while the internal alert to your
own account email still works. Email templates live in `src/lib/emails.ts`.

> **Demo disclaimers are already on the site** (footer, the contact/booking page,
> the chat widget) and in the visitor email — all sourced from the `DEMO` constant
> in [`src/lib/content.ts`](src/lib/content.ts). Edit there to change the wording
> everywhere.

No keys = no email is sent (the lead is still captured if Supabase is set, and you
can read leads in the Supabase dashboard).

---

## 4. ✏️ Real Calendly link

**Free Calendly is enough here.** The free plan gives unlimited 1:1 meetings and
one active event type — and this site books exactly one thing (a free intro
call). Only upgrade (~$10–12/mo) if you later want multiple bookable event types,
to remove Calendly's small branding, SMS reminders, or to collect payment.

In [`src/lib/content.ts`](src/lib/content.ts), set `SARAH.calendly` to the coach's real link:

```ts
calendly: "https://calendly.com/REAL-HANDLE/intro-call",
```

That instantly updates the chat assistant's booking button and every CTA.

> ⚠️ **Important — your Calendly shows the account owner's name.** Calendly's
> booking page displays the host name and event title from your account (e.g.
> "Braxton Seegmiller / 30 Minute Meeting"). The on-site embed hides that panel
> (`hide_event_type_details=1` in `BookingPanel.tsx`), but the **standalone**
> Calendly page — opened by the assistant's "Grab a time" button and any direct
> link — still shows it. To keep the demo on-brand, in Calendly:
> rename the event type to something neutral (e.g. **"Intro Call"**), and set the
> profile/branding name shown to bookers to **"Sarah Mitchell"** (or use a
> scheduling profile that doesn't show the owner's personal name).

**Optional — swap the contact-page scheduler for a real Calendly embed.** The
`/contact` page currently uses a self-contained demo scheduler
([`BookingPanel.tsx`](src/components/contact/BookingPanel.tsx)). To use the live
Calendly inline widget instead, replace that component's body with:

```tsx
"use client";
import Script from "next/script";
import { SARAH } from "@/lib/content";

export function BookingPanel() {
  return (
    <>
      <div
        className="calendly-inline-widget"
        data-url={SARAH.calendly}
        style={{ minWidth: "320px", height: "640px" }}
      />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </>
  );
}
```

---

## 5. ✏️ Real content & photos (for a real client)

- **Copy / offers / testimonials:** edit [`src/lib/content.ts`](src/lib/content.ts) — one file drives the whole site.
- **Photos — keeping the initials monograms (recommended; nothing to do).** The
  About portrait and testimonial avatars use tasteful "SM / AR / PS / TW"
  monograms. For a *fictional* coach this is the cleanest, lowest-risk choice — no
  licensing, and no real face attached to invented testimonials. If you later want
  real faces: **AI-generated headshots** are ideal for a fictional persona (a
  consistent "Sarah" plus distinct testimonial faces — no consent/likeness
  issues); otherwise free stock (Unsplash, Pexels) or paid (Adobe Stock, iStock) —
  verify the license allows commercial use, and never present a stock face as a
  real testimonial author. Look for a warm, professional woman ~35–50, good
  lighting, ~4:5 crop for the portrait; simple neutral-background headshots for
  testimonials. Then drop images in `public/` and replace the monogram markup in
  [`src/app/about/page.tsx`](src/app/about/page.tsx) and
  [`src/app/results/page.tsx`](src/app/results/page.tsx) with `next/image`.
- **System prompt / FAQs:** tune the assistant's voice and answers in the
  `buildSystemPrompt()` function in [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts).

---

## 6. 🌐 Domain & deploy (Vercel)

**Which domain to buy:** target a plain **`.com`** — most credible in the address
bar and cheapest to keep (~$10–12/yr to register *and* renew). Register at
**Porkbun**, **Cloudflare**, or **Spaceship** (free WHOIS privacy, no renewal
markups); **avoid GoDaddy** (renewals jump to ~$22). **Skip `.coach`** — it looks
on-brand but renews ~$64/yr vs ~$12 for `.com`; use `.co` (~$27/yr) only as a
fallback if your `.com` is taken. Pick an available, believable name (e.g.
`sarahmitchellcoaching.com`) — the site's placeholder base URL already uses that
`.com` form, so just swap in your exact purchased domain in step 5 below.

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. Import it at **vercel.com → New Project**. Framework auto-detects as Next.js.
3. Add the env vars from steps 1–3 in **Project → Settings → Environment Variables**.
4. Add the custom domain (**Settings → Domains**) and point DNS as Vercel instructs.
   SSL is automatic.
5. Update the production URL in three places (currently `https://sarahmitchell.coach`):
   - `metadataBase` in [`src/app/layout.tsx`](src/app/layout.tsx)
   - `BASE_URL` in [`src/app/sitemap.ts`](src/app/sitemap.ts)
   - `BASE_URL` in [`src/app/robots.ts`](src/app/robots.ts)

---

## Quick reference — all env vars

```bash
# Claude (lead assistant)
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-6

# Supabase (lead storage)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Resend (coach notification)
RESEND_API_KEY=
LEAD_NOTIFY_EMAIL=
LEAD_FROM_EMAIL=
```

## Final QA (after the above)

- [ ] Assistant returns a real Claude reply to a free-text question
- [ ] A test conversation creates a row in the Supabase `leads` table
- [ ] The coach receives the notification email
- [ ] The booking button opens the real Calendly
- [ ] Site loads on the custom domain over HTTPS; run Lighthouse (target 90+)
