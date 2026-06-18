import { coachAlertEmail, leadConfirmationEmail } from "@/lib/emails";

/**
 * POST /api/lead — stores a captured lead and sends emails (§06 step 5).
 *
 * Two emails go out (both via Resend, when configured):
 *   1. Internal alert → the coach (LEAD_NOTIFY_EMAIL)
 *   2. Branded confirmation → the visitor (with the demo disclaimer)
 *
 * Storage (Supabase) and email (Resend) each activate only when their env vars
 * are present, so the demo runs with zero config: the lead is logged and we
 * still return { ok: true } so the widget confirms.
 *
 * Note: the visitor confirmation can only reach arbitrary addresses once a
 * domain is verified in Resend; with onboarding@resend.dev it will fail for
 * non-account recipients (caught and logged — never breaks the confirmation).
 */

type Lead = {
  email: string;
  inquiryType?: string;
  detail?: string;
  name?: string;
  sessionId?: string;
  /** Honeypot — hidden from humans; if filled, it's a bot. */
  company?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort per-IP limiter, mirroring the one in /api/chat: a Map keyed by
// IP over a fixed 60s window. Resets on cold start / per serverless instance —
// fine for the demo; production swaps this for a shared store (e.g. Upstash).
const MAX_REQUESTS_PER_MINUTE = 5;
const RATE_WINDOW_MS = 60_000;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now >= entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_MINUTE;
}

async function storeInSupabase(lead: Lead): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const res = await fetch(`${url}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email: lead.email,
      name: lead.name ?? null,
      inquiry_type: lead.inquiryType ?? null,
      detail: lead.detail ?? null,
      session_id: lead.sessionId ?? null,
      created_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    console.error("[/api/lead] Supabase insert failed:", res.status, await res.text());
  }
}

async function sendEmail(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    console.error(`[/api/lead] Resend send to ${to} failed:`, res.status, await res.text());
  }
}

async function sendEmails(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!apiKey || !from) return;

  const tasks: Promise<void>[] = [];

  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
  if (notifyTo) {
    const alert = coachAlertEmail(lead);
    tasks.push(sendEmail(apiKey, from, notifyTo, alert.subject, alert.html));
  }

  const confirmation = leadConfirmationEmail();
  tasks.push(sendEmail(apiKey, from, lead.email, confirmation.subject, confirmation.html));

  await Promise.all(tasks);
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return Response.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let lead: Lead;
  try {
    lead = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: a real visitor never sees or fills this. Silently accept and
  // drop — no storage, no email — so bots get no signal they were caught.
  if (lead?.company && lead.company.trim()) {
    return Response.json({ ok: true });
  }

  if (!lead?.email || !EMAIL_RE.test(lead.email)) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  try {
    await Promise.all([storeInSupabase(lead), sendEmails(lead)]);
  } catch (error) {
    // Never fail the visitor's confirmation on a backend hiccup.
    console.error("[/api/lead] processing error:", error);
  }

  if (!process.env.SUPABASE_URL && !process.env.RESEND_API_KEY) {
    console.log("[/api/lead] (demo) captured lead:", JSON.stringify(lead));
  }

  return Response.json({ ok: true });
}
