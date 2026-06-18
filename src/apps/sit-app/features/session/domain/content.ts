export type SitSurface =
  | "landing"
  | "meditation"
  | "intention"
  | "timer"
  | "focus"
  | "completion"
  | "philosophy"
  | "vipassana";

export type SitSessionType = "anapana" | "vipassana" | "metta";

export const SIT_SESSION_TYPE_LABELS: Record<SitSessionType, string> = {
  anapana: "anapana",
  vipassana: "vipassana",
  metta: "metta",
};

export const SIT_SESSION_TYPE_DESCRIPTIONS: Record<SitSessionType, string> = {
  anapana: "Anchor awareness on the natural breath, letting thoughts arise and pass.",
  vipassana: "Scan the body systematically, observing sensation without reaction.",
  metta: "Extend compassion to yourself and all beings, without condition.",
};

export const SIT_DURATION_OPTIONS = [5, 10, 20, 45] as const;

export type DhammapadaQuoteId =
  | "mind-precedes"
  | "pure-mind"
  | "non-hatred"
  | "do-good"
  | "self-purified"
  | "own-good"
  | "teaching-of-the-buddhas"
  | "impermanent";

export type DhammapadaQuote = {
  id: DhammapadaQuoteId;
  text: string;
  attribution: string;
};

export const DHAMMAPADA_QUOTES: DhammapadaQuote[] = [
  {
    id: "mind-precedes",
    text: "Mind precedes thoughts, mind is their chief, their quality is made by mind.",
    attribution: "Dhammapada 1",
  },
  {
    id: "pure-mind",
    text: "If with pure mind one speaks or acts, happiness follows like a shadow that does not depart.",
    attribution: "Dhammapada 2",
  },
  {
    id: "non-hatred",
    text: "Hatred never ceases by hatred. It ceases only by non-hatred. This is an eternal law.",
    attribution: "Dhammapada 5",
  },
  {
    id: "do-good",
    text: "That which is beneficial and good is supremely hard to do.",
    attribution: "Dhammapada 163",
  },
  {
    id: "self-purified",
    text: "By oneself is one purified.",
    attribution: "Dhammapada 165",
  },
  {
    id: "own-good",
    text: "Knowing what is good for oneself, one should be intent on that good.",
    attribution: "Dhammapada 166",
  },
  {
    id: "teaching-of-the-buddhas",
    text: "Do no evil, cultivate the good, purify the mind.",
    attribution: "Dhammapada 183",
  },
  {
    id: "impermanent",
    text: "All conditions are impermanent. Seeing this with wisdom is the path to purity.",
    attribution: "Dhammapada 277",
  },
];

const QUOTE_BY_ID = Object.fromEntries(DHAMMAPADA_QUOTES.map((quote) => [quote.id, quote])) as Record<
  DhammapadaQuoteId,
  DhammapadaQuote
>;

export type SitOnboardingSlide =
  | {
      kind: "content";
      theme: string;
      headline: string;
      quote: string;
      attribution: string;
    }
  | {
      kind: "cta";
    };

function quote(id: DhammapadaQuoteId) {
  return QUOTE_BY_ID[id];
}

export const SIT_ONBOARDING_SLIDES: SitOnboardingSlide[] = [
  {
    kind: "content",
    theme: "the mind",
    headline: "You can't stop thinking,\neven when you're exhausted.",
    quote: quote("mind-precedes").text,
    attribution: quote("mind-precedes").attribution,
  },
  {
    kind: "content",
    theme: "relationships",
    headline: "You keep giving.\nBut do they see you?",
    quote: quote("non-hatred").text,
    attribution: quote("non-hatred").attribution,
  },
  {
    kind: "content",
    theme: "work",
    headline: "Busy all day.\nAccomplished nothing that matters.",
    quote: quote("do-good").text,
    attribution: quote("do-good").attribution,
  },
  {
    kind: "content",
    theme: "release",
    headline: "Most of what you're holding onto\nisn't yours to carry.",
    quote: quote("impermanent").text,
    attribution: quote("impermanent").attribution,
  },
  {
    kind: "cta",
  },
];

export type PhilosophyTopic = {
  id: string;
  title: string;
  body: string[];
  quote?: string;
};

export const PHILOSOPHY_TOPICS: PhilosophyTopic[] = [
  {
    id: "not-thoughts",
    title: "You are not your thoughts",
    body: [
      "Most meditation apps tell you this and stop there. That can feel destabilizing rather than freeing.",
      "The instruction here is simpler: sit long enough, and the need to explain yourself loosens.",
    ],
    quote: "Do not chase the thought. Do not push it away. Watch it arise and pass.",
  },
  {
    id: "no-streaks",
    title: "Why no streaks",
    body: [
      "Streaks create craving. The day you miss one, the self-story collapses with it.",
      "Each session is complete in itself. It does not need to accumulate into a score.",
    ],
  },
  {
    id: "then-act",
    title: "Then act",
    body: [
      "Meditation is not escape. It is clarification.",
      "You sit to see what matters. Then you act on one thing, not ten.",
    ],
    quote: "Bhavatu sabba mangalam. May all beings be happy.",
  },
];

export type VipassanaSession = {
  id: string;
  startHour: number;
  startMin: number;
  label: string;
  duration: number;
  description: string;
  adhi?: true;
  kind: "sit" | "rest";
};

export const VIPASSANA_SESSIONS: VipassanaSession[] = [
  { id: "s1", startHour: 4, startMin: 0, label: "awaken", duration: 30, description: "anapana · settle the mind", kind: "sit" },
  { id: "s2", startHour: 4, startMin: 30, label: "meditate", duration: 120, description: "body scan, head to feet", kind: "sit", adhi: true },
  { id: "s3", startHour: 6, startMin: 30, label: "breakfast & walking", duration: 90, description: "slow, mindful movement", kind: "rest" },
  { id: "s4", startHour: 8, startMin: 0, label: "adittan", duration: 180, description: "deep body scan, feet to head", kind: "sit", adhi: true },
  { id: "s5", startHour: 11, startMin: 0, label: "lunch & rest", duration: 120, description: "last meal · silence kept", kind: "rest" },
  { id: "s6", startHour: 13, startMin: 0, label: "adittan", duration: 60, description: "free scan · observe arising", kind: "sit", adhi: true },
  { id: "s7", startHour: 15, startMin: 0, label: "meditate", duration: 120, description: "head to feet · passing", kind: "sit", adhi: true },
  { id: "s8", startHour: 17, startMin: 0, label: "tea break", duration: 60, description: "fruit & tea only", kind: "rest" },
  { id: "s9", startHour: 18, startMin: 0, label: "adittan", duration: 60, description: "strong determination", kind: "sit", adhi: true },
  { id: "s10", startHour: 20, startMin: 30, label: "closing sit · metta", duration: 15, description: "loving-kindness · release", kind: "sit" },
];

export type BreathPhase = {
  word: string;
  ms: number;
};

export const BREATH_CYCLE: BreathPhase[] = [
  { word: "breathe in", ms: 4000 },
  { word: "hold", ms: 2000 },
  { word: "breathe out", ms: 5000 },
  { word: "release", ms: 1000 },
];
