# Refinement Checklist — Sara Mitchell demo

A standalone to-do list for polishing this site to expert-grade. Each item is
self-contained (what / why / where / how / verify) so it can be executed in a
fresh session without prior chat context. Work top-down; Tier 1 first.

## Read first (guardrails for any session)
- **Brand name is "Sara Mitchell" — no "h".** Never write "Sarah". **Never** put
  "Braxton" in any rendered UI (it's the builder's name, not the client's).
- This is **Next.js 16** (App Router, Turbopack, React 19, TypeScript). Per
  `AGENTS.md`, **read the relevant guide in `node_modules/next/dist/docs/` before
  writing Next code** — APIs differ from older versions.
- All client copy lives in **`src/lib/content.ts`** (`SARAH`, `OFFERS`,
  `TESTIMONIALS`, `DEMO`). Design tokens live in **`src/app/globals.css`** —
  components consume `var(--token)`, no hardcoded colors/spacing.
- Secrets live in **`.env.local`** (git-ignored). Never commit them;
  `.env.example` is the placeholder template. The app runs without keys
  (graceful fallbacks).
- After every change: **`npm run build`** must stay green, and verify in the
  browser (`npm run dev`). Keep the build's route table intact.
- When touching Claude/Anthropic code, consult the `claude-api` skill; model is
  `claude-sonnet-4-6` (see `.env.example` / `ANTHROPIC_MODEL`).

---

## Tier 1 — Real gaps (do before sending real traffic)

- [ ] **1. Wire the contact form to actually submit.**
  - *Why:* `src/components/contact/ContactForm.tsx` validates and shows a
    "Message on its way" success state but **never sends anything** — no email,
    no DB row. Only the chat widget (`LeadAssistant.tsx`) hits `/api/lead`. A
    prospect who tests the form gets a false confirmation.
  - *Where:* `src/components/contact/ContactForm.tsx`, `src/app/api/lead/route.ts`.
  - *How:* On submit (after the existing client validation passes), `await fetch("/api/lead", { method: "POST", … })` with
    `{ email, name, detail: message, inquiryType: "Contact form", sessionId }`.
    Only show the success state on a 2xx; on failure show a retry message. The
    `/api/lead` route already accepts `name`/`detail` and sends both emails +
    stores the lead — no route change needed.
  - *Verify:* Submit the form on `/contact` → a row appears in the Supabase
    `leads` table and the coach alert + visitor confirmation emails fire (check
    server logs and inbox).

- [ ] **2. Add abuse protection to the lead endpoints.**
  - *Why:* `/api/lead` is an open POST wired to **real** Supabase + Resend — it
    can be spammed into real emails, DB rows, and cost. `/api/chat` is
    rate-limited; `/api/lead` and the forms are not.
  - *Where:* `src/app/api/lead/route.ts`, `src/components/contact/ContactForm.tsx`,
    `src/components/assistant/LeadAssistant.tsx`.
  - *How:* (a) Add a per-IP rate limit in `/api/lead` mirroring the in-memory
    limiter in `src/app/api/chat/route.ts`; derive IP from
    `request.headers.get("x-forwarded-for")`. (b) Add a hidden **honeypot** input
    (e.g. `company`, visually hidden, `tabindex=-1`, `autocomplete=off`) to both
    forms; if it's non-empty on submit, return `{ ok: true }` without storing or
    emailing. (c) Optionally cap N submissions/min/IP.
  - *Note:* the in-memory limiter resets per serverless instance — acceptable for
    a demo; see Tier 3 for the durable version.
  - *Verify:* rapid repeat POSTs get HTTP 429; a submission with the honeypot
    filled is silently ignored (no row, no email).

---

## Tier 2 — Elevate to expert (polish; not blocking)

- [ ] **3. Run Lighthouse on the deployed site and fix findings.**
  - *How:* Chrome DevTools → Lighthouse, mobile **and** desktop, against the live
    Vercel URL. Target ≥ 90 in all four categories.
  - *Likely fixes:* verify `--color-muted` (`#8888AA`) text contrast on
    `--color-void`/`--color-navy` meets WCAG AA (4.5:1 for normal text, 3:1
    large) — darken the token or bump weight/size where it fails; confirm the
    Calendly `widget.js` stays lazy; check no render-blocking resources.
  - *Verify:* Lighthouse ≥ 90 for Performance, Accessibility, Best Practices, SEO.

- [ ] **4. Add JSON-LD structured data.**
  - *Why:* richer SEO for a coaching site; currently none.
  - *Where:* `src/app/layout.tsx` (site-wide) and/or per page.
  - *How:* render a `<script type="application/ld+json">` with a
    `ProfessionalService` (or `Person`) graph — name "Sara Mitchell", description,
    `url: https://saramcoach.com`, the two `OFFERS` as `makesOffer`, and contact
    info — sourced from `src/lib/content.ts`. (Follow the Next.js metadata docs
    for the recommended script pattern.)
  - *Verify:* passes Google's Rich Results Test / schema.org validator.

- [ ] **5. Stream the chat assistant's replies.**
  - *Why:* free-text replies currently appear all at once after a pause; token
    streaming feels markedly more responsive.
  - *Where:* `src/app/api/chat/route.ts` (Anthropic streaming → a `ReadableStream`
    / SSE response), `src/components/assistant/LeadAssistant.tsx` (append tokens
    as they arrive). Read the Next.js streaming docs and the `claude-api` skill
    (`messages.stream` / `.finalMessage()`) first.
  - *Verify:* the assistant's free-text answers render token-by-token; the
    scripted button flow is unchanged.

- [ ] **6. Add Vercel Analytics + Speed Insights.**
  - *How:* `npm i @vercel/analytics @vercel/speed-insights`, render `<Analytics/>`
    and `<SpeedInsights/>` in `src/app/layout.tsx`, enable both in the Vercel
    dashboard.
  - *Verify:* data appears in Vercel after a deploy.

---

## Tier 3 — Diminishing returns (skip unless going full production)

- [ ] Replace the in-memory rate limiters with a durable store (Upstash Redis or
      Vercel KV) so limits survive across serverless instances.
- [ ] Automated tests (Vitest unit + Playwright e2e for the lead flow) + CI
      (GitHub Actions running `npm run build` + tests on PRs).
- [ ] Chat dialog a11y: focus-trap while open, return focus to the launcher on
      close, full keyboard navigation pass.

---

## Manual steps (you, not code — see `GO-LIVE.md`)
- [ ] Rotate the Anthropic / Supabase / Resend keys (shared in plaintext during
      setup), then update `.env.local` + Vercel env vars.
- [ ] In Calendly, rename the event + booker-facing display name to
      **"Sara Mitchell"** (the on-site embed hides it, but the standalone page
      shows the account name).
- [ ] In Vercel: import the repo, set the 7 env vars from `.env.local`, attach
      `saramcoach.com`.
