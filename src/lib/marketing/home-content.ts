import { BRAND_NAME } from "@/lib/brand";

export const POPULAR_SEARCHES = [
  { name: "Elon Musk", image: "https://i.pravatar.cc/80?u=elon" },
  { name: "Playboi Carti", image: "https://i.pravatar.cc/80?u=carti" },
  { name: "Taylor Swift", image: "https://i.pravatar.cc/80?u=taylor" },
  { name: "Kim Kardashian", image: "https://i.pravatar.cc/80?u=kim" },
];

export const USE_CASES = [
  {
    id: "fullName",
    title: "Full Name",
    desc: "Discover the name(s) linked to the number.",
  },
  {
    id: "socialMedia",
    title: "Social Media Accounts",
    desc: "Reveal associated profiles across major platforms.",
  },
  {
    id: "email",
    title: "Email Address",
    desc: "Find public emails associated with the contact.",
  },
  {
    id: "location",
    title: "City & Region",
    desc: "See the most likely location data.",
  },
  {
    id: "connections",
    title: "Connections",
    desc: "Get insights into related or frequently mentioned individuals.",
  },
  {
    id: "webMentions",
    title: "Web Mentions",
    desc: "Explore where the person appears online.",
  },
];

export type LatestResult = {
  name: string;
  gender: string;
  phoneCode: string;
  phoneMasked: string;
  phoneSuffix: string;
  city: string;
  country: string;
};

export const LATEST_RESULTS: LatestResult[] = [
  {
    name: "Oliver Svensson",
    gender: "Male",
    phoneCode: "+46",
    phoneMasked: "*** ***",
    phoneSuffix: "331",
    city: "Stockholm",
    country: "Sweden",
  },
  {
    name: "Isabella García",
    gender: "Female",
    phoneCode: "+34",
    phoneMasked: "*** ***",
    phoneSuffix: "657",
    city: "Madrid",
    country: "Spain",
  },
  {
    name: "Hiroshi Tanaka",
    gender: "Male",
    phoneCode: "+81",
    phoneMasked: "*** ***",
    phoneSuffix: "443",
    city: "Tokyo",
    country: "Japan",
  },
  {
    name: "Lucas Ferreira",
    gender: "Male",
    phoneCode: "+55",
    phoneMasked: "*** ***",
    phoneSuffix: "918",
    city: "São Paulo",
    country: "Brazil",
  },
  {
    name: "Noah Jensen",
    gender: "Male",
    phoneCode: "+45",
    phoneMasked: "*** ***",
    phoneSuffix: "007",
    city: "Aarhus",
    country: "Denmark",
  },
  {
    name: "Ava Thompson",
    gender: "Female",
    phoneCode: "+1",
    phoneMasked: "*** ***",
    phoneSuffix: "562",
    city: "New York",
    country: "USA",
  },
];

export const TESTIMONIALS = [
  {
    name: "David K.",
    quote: `This tool helped me verify someone I met online. Saved me from a potential scam.`,
    location: "London, United Kingdom",
  },
  {
    name: "Sophie R.",
    quote: `I found an old friend's Instagram in seconds. ${BRAND_NAME} really feels like digital magic.`,
    location: "New York, United States",
  },
  {
    name: "James T.",
    quote: `I reconnected with family members I hadn't spoken to in years. Total game changer.`,
    location: "Los Angeles, United States",
  },
  {
    name: "Maria L.",
    quote: `I found my childhood crush after all these years. ${BRAND_NAME} actually works.`,
    location: "Toronto, Canada",
  },
];

export type FaqItem = { question: string; answer: string };

export function getFaqItems(): FaqItem[] {
  return [
    {
      question: `What is ${BRAND_NAME}?`,
      answer: `${BRAND_NAME} is a powerful tool that helps you uncover digital footprints connected to names, numbers, or emails.`,
    },
    {
      question: "How does it work?",
      answer: `Enter a full name to start. ${BRAND_NAME} scans publicly available sources and organizes what it finds into a report with reference links you can verify.`,
    },
    {
      question: "What can I find with it?",
      answer:
        "Depending on public availability, you may see social profile hints, email patterns, location clues, connections, and web mentions.",
    },
    {
      question: "Is it safe and legal to use?",
      answer: `${BRAND_NAME} uses public sources only. It is not a consumer reporting agency and must not be used for employment, credit, or tenant screening. You must be 18 or older.`,
    },
    {
      question: "Can people know I searched for them?",
      answer: "No. Searches are private to your account; subjects are not notified.",
    },
    {
      question: `Can I use ${BRAND_NAME} on mobile devices?`,
      answer:
        "Yes — use the website on any phone, or get the app on Google Play and the App Store.",
    },
    {
      question: "Does it work in every country?",
      answer:
        "Coverage depends on publicly indexed information in each region. Results vary by person and location.",
    },
    {
      question: "What if I can't find anything?",
      answer:
        "Try alternate spellings or search again later. Public indexing updates over time.",
    },
  ];
}
