import { OFFERS, SARAH } from "./content";

/**
 * Client-safe configuration for the lead assistant widget (§06 flow).
 * The Claude system prompt lives server-side in /api/chat — this file only
 * holds the scripted, deterministic conversation copy the widget renders.
 */

export const ASSISTANT = {
  name: `${SARAH.firstName}'s Assistant`,
  initials: "SM",
  subtitle: "Usually replies in a few minutes",
} as const;

export const GREETING = `Hey, thinking about working with ${SARAH.firstName}? I can point you in the right direction.`;

export const INTENT_QUESTION = "What brings you here today?";

export const INTENT_OPTIONS = [
  "Learn about coaching",
  "Pricing",
  "Something else",
] as const;

export type Intent = (typeof INTENT_OPTIONS)[number];

/** Step-2 branch, keyed by the step-1 selection. */
export const FOLLOWUP: Record<Intent, { prompt: string; options?: string[] }> = {
  "Learn about coaching": {
    prompt: "What's the main challenge you're working through right now?",
  },
  Pricing: {
    prompt: "What kind of support are you looking for?",
    options: ["1:1 coaching", "Group program", "Still figuring it out"],
  },
  "Something else": {
    prompt: "No problem. What's on your mind?",
  },
};

export const EMAIL_PROMPT = `I'd love to have ${SARAH.firstName} follow up with you personally. What's the best email to reach you?`;

export const EMAIL_INVALID = "Hmm, that doesn't look like a valid email. Mind trying again?";

export const CONFIRMATION = `Perfect. ${SARAH.firstName} will follow up with you personally. You can also grab a time on her calendar right now:`;

export const BOOKING_LABEL = "Grab a time";

/**
 * A plain-language price summary for the Pricing branch, built from OFFERS so it
 * always matches what the Services page shows. Surfaced before we ask for an
 * email, so visitors see the numbers before we offer a personal follow-up.
 */
const pivot = OFFERS.find((o) => o.id === "pivot-protocol");
const circle = OFFERS.find((o) => o.id === "clarity-circle");

export function pricingSummary(choice: string): string {
  const oneOnOne = pivot
    ? `${pivot.title}, a six-month 1:1 at ${pivot.price}`
    : "private 1:1 coaching";
  const group = circle
    ? `${circle.title} at ${circle.price} a month`
    : "the small-group program";

  if (choice === "Group program") {
    return `That's ${group}. Two live coaching calls a month and a capped room of people doing the work.`;
  }
  if (choice === "1:1 coaching") {
    return `That's ${oneOnOne}. ${SARAH.firstName} keeps it to six clients at a time, so spots are limited.`;
  }
  return `Two ways in: ${oneOnOne}, or ${group}. A quick call is the easiest way to see which one fits.`;
}
