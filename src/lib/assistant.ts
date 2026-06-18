import { SARAH } from "./content";

/**
 * Client-safe copy for the lead assistant widget. The conversation itself is
 * driven by Claude (system prompt in /api/chat); this file only holds the few
 * deterministic strings the widget renders. No em dashes, per the bot voice.
 */

export const ASSISTANT = {
  name: `${SARAH.firstName}'s Assistant`,
  initials: "SM",
  subtitle: "Usually replies in a few minutes",
} as const;

/** Opening line. Invites a typed question first, with the quick-starts as an
 *  optional convenience, so the input never reads as buttons-only. */
export const GREETING = `Hi, I'm ${SARAH.firstName}'s assistant. Ask me anything about the programs, the cost, or whether it's a fit. Or tap a quick start below.`;

/** Optional quick-starts. Tapping one seeds that text as the first message and
 *  routes it to Claude, exactly like typing it. */
export const INTENT_OPTIONS = [
  "Learn about coaching",
  "Pricing",
  "Something else",
] as const;

export const INPUT_PLACEHOLDER = "Ask a question or tell me what's going on…";

/** Graceful confirmation used only if an email is captured but the network
 *  reply fails. In the normal path Claude confirms in its own voice. */
export const CONFIRMATION = `Perfect. ${SARAH.firstName} will follow up with you personally. You can also grab a time on her calendar right now:`;

export const BOOKING_LABEL = "Grab a time";
