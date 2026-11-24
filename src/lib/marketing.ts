export const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/tools/geo-audit", label: "Free audit" },
  { href: "/learn", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
] as const;

export const PLANS = [
  {
    id: "free",
    name: "Starter",
    price: "$0",
    period: "forever",
    blurb: "See if your brand shows up in AI answers.",
    cta: "Start free",
    href: "/register",
    featured: false,
    features: [
      "1 brand report",
      "5 tracked prompts",
      "3 engines (ChatGPT, Perplexity, Google AI)",
      "1 GEO audit / month",
      "Basic recommendations",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$79",
    period: "/ month",
    blurb: "For marketing teams owning AI search visibility.",
    cta: "Start 14-day trial",
    href: "/register?plan=growth",
    featured: true,
    features: [
      "5 brand reports",
      "50 tracked prompts",
      "All 6 AI engines",
      "Weekly automated scans + email digests",
      "Competitor share of voice",
      "Unlimited GEO audits",
      "Prioritized action plans",
      "CSV export",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    price: "$249",
    period: "/ month",
    blurb: "Run GEO retainers across every client brand.",
    cta: "Start Agency",
    href: "/register?plan=agency",
    featured: false,
    features: [
      "Up to 100 brands & clients",
      "1,000 tracked prompts per brand",
      "All 6 AI engines",
      "Daily automated scans + email digests",
      "Unlimited GEO audits",
      "CSV export for client reporting",
      "Priority support & onboarding",
    ],
  },
] as const;

export const FEATURES = [
  {
    title: "Prompt tracking",
    desc: "Define the questions buyers ask AI engines. Track whether your brand is mentioned, cited, or ignored — daily.",
    active: "bg-brand-600 text-white shadow-md shadow-brand-200",
    idle: "hover:bg-brand-50",
    kicker: "text-brand-700",
    bar: "bg-brand-600",
    card: "border-brand-100 bg-gradient-to-br from-brand-50 to-white",
  },
  {
    title: "Multi-engine scans",
    desc: "Monitor ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude, and Copilot from one report.",
    active: "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-200",
    idle: "hover:bg-fuchsia-50",
    kicker: "text-fuchsia-700",
    bar: "bg-fuchsia-600",
    card: "border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-white",
  },
  {
    title: "Share of voice",
    desc: "See how often you appear versus named competitors, and which engines favor whom.",
    active: "bg-amber-500 text-white shadow-md shadow-amber-200",
    idle: "hover:bg-amber-50",
    kicker: "text-amber-700",
    bar: "bg-amber-500",
    card: "border-amber-100 bg-gradient-to-br from-amber-50 to-white",
  },
  {
    title: "GEO audit",
    desc: "Check robots.txt, llms.txt, schema, crawlability, and content depth so models can actually cite you.",
    active: "bg-sky-600 text-white shadow-md shadow-sky-200",
    idle: "hover:bg-sky-50",
    kicker: "text-sky-700",
    bar: "bg-sky-600",
    card: "border-sky-100 bg-gradient-to-br from-sky-50 to-white",
  },
  {
    title: "Recommendations",
    desc: "Get ranked on-page and off-page actions that close visibility gaps — not a generic SEO checklist.",
    active: "bg-rose-500 text-white shadow-md shadow-rose-200",
    idle: "hover:bg-rose-50",
    kicker: "text-rose-700",
    bar: "bg-rose-500",
    card: "border-rose-100 bg-gradient-to-br from-rose-50 to-white",
  },
  {
    title: "Prompt research",
    desc: "Turn keywords into starter prompts across TOFU, MOFU, and BOFU so you are not guessing what to track.",
    active: "bg-indigo-600 text-white shadow-md shadow-indigo-200",
    idle: "hover:bg-indigo-50",
    kicker: "text-indigo-700",
    bar: "bg-indigo-600",
    card: "border-indigo-100 bg-gradient-to-br from-indigo-50 to-white",
  },
] as const;

export const STEPS = [
  {
    n: "01",
    title: "Create a brand report",
    desc: "Add your domain, competitors, and a few keywords. We generate starter prompts automatically.",
    tone: "text-brand-600",
    wash: "bg-brand-50 border-brand-100",
  },
  {
    n: "02",
    title: "Scan AI engines",
    desc: "Run visibility scans across the engines that matter. See mentions, citations, and competitor hits.",
    tone: "text-fuchsia-600",
    wash: "bg-fuchsia-50 border-fuchsia-100",
  },
  {
    n: "03",
    title: "Audit & act",
    desc: "Fix crawl and content gaps, then re-scan. Watch share of voice move as recommendations ship.",
    tone: "text-amber-600",
    wash: "bg-amber-50 border-amber-100",
  },
] as const;

export const USE_CASES = [
  {
    title: "In-house marketers",
    desc: "Prove AI search is a channel, not a rumor. Report visibility to leadership with engine-level data.",
    wash: "bg-sky-50 border-sky-100 hover:border-sky-300",
    chip: "bg-sky-600",
  },
  {
    title: "Agencies",
    desc: "Productize GEO retainers. Track every client brand and send a report they can actually read.",
    wash: "bg-fuchsia-50 border-fuchsia-100 hover:border-fuchsia-300",
    chip: "bg-fuchsia-600",
  },
  {
    title: "Founders & SEO leads",
    desc: "Know if ChatGPT recommends you before a prospect even visits Google. Close the citation gap.",
    wash: "bg-amber-50 border-amber-100 hover:border-amber-300",
    chip: "bg-amber-500",
  },
] as const;

export const STAT_TONES = [
  { wrap: "bg-brand-50 border-brand-100", num: "text-brand-700" },
  { wrap: "bg-fuchsia-50 border-fuchsia-100", num: "text-fuchsia-700" },
  { wrap: "bg-amber-50 border-amber-100", num: "text-amber-700" },
  { wrap: "bg-sky-50 border-sky-100", num: "text-sky-700" },
] as const;

export const FAQS = [
  {
    q: "What is GEO?",
    a: "Generative Engine Optimization is the practice of earning mentions and citations inside AI answers — ChatGPT, Perplexity, Google AI Overviews, and similar products. Deepchq measures that visibility and tells you how to improve it.",
  },
  {
    q: "Is this the same as SEO?",
    a: "Related, not the same. Classic SEO ranks pages in blue links. GEO is about being named and sourced in generated answers. Crawlability and content still matter; so do entity clarity, citations, and how models talk about your category.",
  },
  {
    q: "Which engines do you cover?",
    a: "ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude, and Microsoft Copilot. Starter covers the first three; Growth and Agency include all six.",
  },
  {
    q: "Are the AI answers real?",
    a: "Yes. ChatGPT, Perplexity, Gemini and Claude are queried through their official APIs and every answer is analysed for mentions, citations, position and sentiment. Google AI Overviews and Copilot have no public answer API, so those rows are clearly labelled Estimated and paired with a live audit of the signals you control.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Starter is free forever. Paid plans can be cancelled from Settings in one click; you keep access until the end of the billing period.",
  },
  {
    q: "Is everything automated?",
    a: "Yes. When you add a brand we generate starter prompts, audit the site and run the first scan automatically. After that, scans repeat on your plan's schedule (monthly, weekly or daily), recommendations refresh, and a digest lands in your inbox.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes — about two months free on Growth and Agency when billed annually. Pick annual at checkout.",
  },
] as const;

export const STATS = [
  { value: 6, suffix: "", label: "AI engines covered" },
  { value: 4, suffix: "", label: "engines queried live via official APIs" },
  { value: 20, suffix: "", label: "GEO audit checks" },
  { value: 7, suffix: " days", label: "between automatic scans on Growth" },
] as const;

