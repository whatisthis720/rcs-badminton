/* ────────────────────────────────────────────────────────────────────── */
/* Data constants — all static content for the landing page              */
/* ────────────────────────────────────────────────────────────────────── */

export const NAV_LINKS = [
  { label: "About", href: "#philosophy" },
  { label: "Memberships", href: "#memberships" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const PILLARS = [
  {
    label: "One on One",
    desc: "Every session is built around a single player. No classes, no queues, no shared attention.",
  },
  {
    label: "Film Study",
    desc: "Match footage reviewed frame by frame, translating raw instinct into repeatable pattern.",
  },
  {
    label: "Match IQ",
    desc: "Tactical literacy trained as rigorously as footwork — reading the court, not just reacting to it.",
  },
];

export const TIERS = [
  {
    name: "Individual",
    capacity: "Private 1-on-1 Coaching",
    tagline: "Bespoke Strategy & Tournament Prep.",
    price: "₹12,000",
    period: "/ month",
    sessions: "12 sessions",
    features: [
      "Private 1-on-1 coaching",
      "Bespoke strategy & tournament preparation",
      "Total athlete development, 12 sessions monthly",
    ],
    featured: true,
  },
  {
    name: "Group",
    capacity: "Group Coaching — Max 5 Players",
    tagline: "Foundation & Technique.",
    price: "₹3,500",
    period: "/ person / month",
    sessions: "12 sessions",
    features: [
      "Group coaching, max 5 players",
      "Foundational stroke & footwork technique",
      "12 sessions monthly",
    ],
    featured: false,
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Rc doesn't coach in generalities. Every correction is specific, every drill has a reason. Six months in and my footwork finally feels like my own.",
    name: "Mrs. Nirali Chokshi",
    role: "Group Member",
  },
  {
    quote:
      "The kind of discipline you'd expect from someone who trained at the national level. No wasted sessions, no wasted words.",
    name: "Mrs. Asmita",
    role: "Individual Member",
  },
  {
    quote:
      "I've trained with three coaches before Rc. This is the first time someone watched the film and told me exactly what I couldn't see myself.",
    name: "Mr. Dhawal Bankar",
    role: "Group Member",
  },
];

export const STATS = [
  { value: "5+", label: "Years Elite Coaching" },
  { value: "AF", label: "National-Level Player" },
  { value: "2", label: "Membership Tracks" },
  { value: "Pune", label: "India" },
];
