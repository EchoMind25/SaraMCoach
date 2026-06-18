import { DEMO, SARAH } from "./content";

/**
 * Email templates (server-only). Table-based, inline-styled HTML for broad
 * client compatibility, themed to the site (void/navy/indigo/ghost).
 */

type Lead = {
  email: string;
  inquiryType?: string;
  detail?: string;
  name?: string;
  sessionId?: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Internal alert sent to the coach when a lead is captured. */
export function coachAlertEmail(lead: Lead): { subject: string; html: string } {
  return {
    subject: `New lead from your website — ${lead.email}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1a1a2e">
        <h2 style="margin:0 0 12px">New lead captured</h2>
        <p style="margin:4px 0"><strong>Email:</strong> ${esc(lead.email)}</p>
        <p style="margin:4px 0"><strong>Interested in:</strong> ${esc(lead.inquiryType ?? "—")}</p>
        <p style="margin:4px 0"><strong>Notes:</strong> ${esc(lead.detail ?? "—")}</p>
        <p style="margin:16px 0 0;color:#8888aa;font-size:12px">
          Captured by ${SARAH.firstName}'s assistant · session ${esc(lead.sessionId ?? "—")} · demonstration site
        </p>
      </div>`,
  };
}

/** Branded confirmation sent to the visitor, with the demo disclaimer. */
export function leadConfirmationEmail(): { subject: string; html: string } {
  return {
    subject: `Thanks for reaching out — your next step (demo)`,
    html: `
  <body style="margin:0;padding:0;background:#0a0a12;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a12;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#1a1a2e;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
          <tr><td style="height:4px;background:linear-gradient(90deg,#6c63ff,#a78bfa);"></td></tr>
          <tr><td style="padding:32px 32px 8px;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0 0 6px;color:#6c63ff;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;">Mindset &amp; Performance Coaching</p>
            <h1 style="margin:0 0 14px;color:#f0f0ff;font-size:26px;line-height:1.2;">Thanks for reaching out.</h1>
            <p style="margin:0 0 20px;color:#c9c9e0;font-size:15px;line-height:1.7;">
              Great to connect. The best next step is a short, no-pressure intro call — grab whatever time works for you:
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr><td style="border-radius:8px;background:linear-gradient(135deg,#6c63ff,#a78bfa);">
                <a href="${SARAH.calendly}" style="display:inline-block;padding:13px 28px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;">Book your call →</a>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:0 32px 28px;font-family:Arial,Helvetica,sans-serif;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.25);border-radius:12px;">
              <tr><td style="padding:14px 16px;">
                <p style="margin:0 0 4px;color:#f87171;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:bold;">Please note</p>
                <p style="margin:0;color:#c9c9e0;font-size:13px;line-height:1.6;">${DEMO.notice}</p>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:0 32px 28px;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0;color:#8888aa;font-size:12px;line-height:1.6;">
              ${SARAH.name} · Demonstration site · This mailbox isn’t monitored.
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>`,
  };
}
