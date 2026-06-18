/**
 * Single source of client content for the demo site.
 * Swapping these values is the bulk of Phase 4 (client customization).
 */

export const SARAH = {
  name: "Sara Mitchell",
  firstName: "Sara",
  role: "Business & Life Coach",
  location: "Nashville, TN",
  email: "hello@saramcoach.com",
  calendly: "https://calendly.com/echomindautomation/30min",
  responseSla: "one business day",
} as const;

/** Demo disclaimers, surfaced in the footer, contact page, chat widget, and
 *  the lead confirmation email. Edit here to change the wording everywhere.
 *  Kept subtle but honest, with no em dashes per the brand copy rules. */
export const DEMO = {
  short: "For demonstration purposes only.",
  notice:
    "This website and its booking calendar are a demonstration. “Sara Mitchell” is a fictional coach, so any message you send or time you book here is part of a demo and won’t create a real appointment or coaching relationship.",
} as const;

/** Contact form copy. Field labels stay inline in the form; these are the
 *  states that change at runtime (submission + failure). */
export const CONTACT = {
  sending: "Sending…",
  errorRetry: `Something went wrong sending your message. Try again, or email Sara directly at ${SARAH.email}.`,
} as const;

export type Offer = {
  id: string;
  tag: string;
  title: string;
  summary: string;
  price: string | null;
  cadence: string | null;
  includes: string[];
  featured: boolean;
};

export const OFFERS: Offer[] = [
  {
    id: "pivot-protocol",
    tag: "Private 1:1 · 6 months",
    title: "The Pivot Protocol",
    summary:
      "A private six-month engagement built around one outcome: your next real move, made on purpose. We build the strategy, the 90-day plan, and the exact words for the conversation you’ve been avoiding for two years. Then we work it until it’s done.",
    price: "$12,000",
    cadence: "6-month engagement",
    includes: [
      "Weekly 1:1 strategy sessions",
      "A 90-day plan mapped to your timeline",
      "Negotiation and promotion scripts written for your situation",
      "Direct access between sessions when it counts",
      "Six private clients at a time, so you’re never one of forty",
    ],
    featured: true,
  },
  {
    id: "clarity-circle",
    tag: "Small group · Monthly",
    title: "The Inner Circle",
    summary:
      "The same frameworks Sara uses with private clients, in a small room of people who refuse to coast. Live coaching twice a month, real accountability, and peers who will call you on your own excuses.",
    price: "$500",
    cadence: "per month",
    includes: [
      "Two live group coaching calls a month",
      "A private room of high performers, capped on purpose",
      "Monthly frameworks and scripts you can use that week",
      "Hot-seat coaching when you’re the one stuck",
      "Cancel any time, no exit interview",
    ],
    featured: false,
  },
];

export type Testimonial = {
  initials: string;
  name: string;
  role: string;
  context: string;
  quote: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    initials: "MR",
    name: "Marcus R.",
    role: "VP, Operations",
    context: "The Pivot Protocol · 1:1",
    quote:
      "I’d been passed over twice and couldn’t tell you why. Sara found it in week two. Five months later I was running the division I kept getting overlooked for.",
  },
  {
    initials: "PS",
    name: "Priya S.",
    role: "Marketing Director",
    context: "The Pivot Protocol · 1:1",
    quote:
      "I came in ready to quit. I left with a 22 percent raise, a team that respects my calendar, and a job I actually want to keep.",
  },
  {
    initials: "TW",
    name: "Tom W.",
    role: "Founder",
    context: "The Inner Circle · Group",
    quote:
      "Six weeks in, I’d raised my rates 40 percent and stopped flinching when I said the number. Nobody walked.",
  },
];

/** Mentioned once, briefly. Results carry the page, not the credential list. */
export const CREDENTIALS = [
  "Certified business and life coach",
  "Ten years in corporate HR before this",
  "Six private clients at a time, on purpose",
  "Based in Nashville, working with clients everywhere",
];

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/results", label: "Results" },
  { href: "/contact", label: "Contact" },
] as const;
