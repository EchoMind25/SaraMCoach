/**
 * Single source of client content for the demo site.
 * Swapping these values is the bulk of Phase 4 (client customization).
 */

export const SARAH = {
  name: "Sara Mitchell",
  firstName: "Sara",
  role: "Mindset & Performance Coach",
  email: "hello@saramcoach.com",
  calendly: "https://calendly.com/echomindautomation/30min",
  responseSla: "one business day",
} as const;

/** Demo disclaimers — surfaced in the footer, contact page, chat widget, and
 *  the lead confirmation email. Edit here to change the wording everywhere. */
export const DEMO = {
  short: "For demonstration purposes only.",
  notice:
    "This website and its booking calendar are for demonstration purposes only. “Sara Mitchell” is a fictional coach — any message you send or time you book here is part of a demo and won’t create a real appointment or coaching relationship.",
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
    tag: "1:1 · 90 days",
    title: "The Pivot Protocol",
    summary:
      "A private 90-day intensive to move from stuck to a clear, committed next move — with the strategy, structure, and accountability to actually act on it.",
    price: "$3,500",
    cadence: "90-day engagement",
    includes: [
      "Weekly 1:1 coaching sessions",
      "A personalized alignment & decision map",
      "Async support between sessions",
      "Performance and mindset frameworks",
      "A concrete 90-day action plan",
    ],
    featured: true,
  },
  {
    id: "clarity-circle",
    tag: "Group · Monthly",
    title: "The Clarity Circle",
    summary:
      "A monthly group for professionals doing the work alongside peers who get it. Live coaching, proven frameworks, and steady momentum.",
    price: "$297",
    cadence: "per month",
    includes: [
      "Two live group coaching calls a month",
      "A private peer community",
      "Monthly frameworks and worksheets",
      "Guest sessions and Q&A",
      "Cancel anytime",
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
    initials: "AR",
    name: "Alex R.",
    role: "SVP, Finance",
    context: "Pivot Protocol · 1:1",
    quote:
      "I came in certain I needed a new job. I left with a clearer head, a stronger team, and the role I already had — finally feeling like mine.",
  },
  {
    initials: "PS",
    name: "Priya S.",
    role: "Marketing Director",
    context: "Pivot Protocol · 1:1",
    quote:
      "Sara is warm, but she doesn't let you hide. Ninety days in, I finally made the move I'd been circling for two years.",
  },
  {
    initials: "TW",
    name: "Tom W.",
    role: "Product Lead",
    context: "Clarity Circle · Group",
    quote:
      "Evidence-based and refreshingly direct. The frameworks stuck because they actually made sense — and they held up under pressure.",
  },
];

export const CREDENTIALS = [
  "ICF Professional Certified Coach (PCC)",
  "15 years in corporate leadership",
  "Trained in cognitive & performance psychology",
  "200+ professionals coached since 2019",
];

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/results", label: "Results" },
  { href: "/contact", label: "Contact" },
] as const;
