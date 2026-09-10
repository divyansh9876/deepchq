export const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
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
      "Weekly scans + competitor share of voice",
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
    blurb: "White-label reports for clients and retainers.",
    cta: "Talk to sales",
    href: "/contact?plan=agency",
    featured: false,
    features: [
      "Unlimited brands & clients",
      "Unlimited prompts",
      "Daily scans",
      "Client-ready PDF reports",
      "Shared workspaces & roles",
      "Priority support",
      "Custom onboarding",
    ],
  },
] as const;

export const FEATURES = [
  {
    title: "Prompt tracking",
    desc: "Define the questions buyers ask AI engines. Track whether your brand is mentioned, cited, or ignored — daily.",
    active: "bg-teal-600 text-white shadow-md shadow-teal-200",
    idle: "hover:bg-teal-50",
    kicker: "text-teal-700",
    bar: "bg-teal-600",
    card: "border-teal-100 bg-gradient-to-br from-teal-50 to-white",
  },
  {
    title: "Multi-engine scans",
    desc: "Monitor ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude, and Copilot from one report.",
    active: "bg-violet-600 text-white shadow-md shadow-violet-200",
    idle: "hover:bg-violet-50",
    kicker: "text-violet-700",
    bar: "bg-violet-600",
    card: "border-violet-100 bg-gradient-to-br from-violet-50 to-white",
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
    tone: "text-teal-600",
    wash: "bg-teal-50 border-teal-100",
  },
  {
    n: "02",
    title: "Scan AI engines",
    desc: "Run visibility scans across the engines that matter. See mentions, citations, and competitor hits.",
    tone: "text-violet-600",
    wash: "bg-violet-50 border-violet-100",
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
    wash: "bg-violet-50 border-violet-100 hover:border-violet-300",
    chip: "bg-violet-600",
  },
  {
    title: "Founders & SEO leads",
    desc: "Know if ChatGPT recommends you before a prospect even visits Google. Close the citation gap.",
    wash: "bg-amber-50 border-amber-100 hover:border-amber-300",
    chip: "bg-amber-500",
  },
] as const;

export const STAT_TONES = [
  { wrap: "bg-teal-50 border-teal-100", num: "text-teal-700" },
  { wrap: "bg-violet-50 border-violet-100", num: "text-violet-700" },
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
    q: "Do you run real ChatGPT queries?",
    a: "Yes, when an OpenAI API key is configured. Other engines use intelligent simulated scans so you can still compare share of voice while live connectors roll out.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Starter is free forever. Paid plans can be canceled from your workspace; you keep access through the current billing period.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes — two months free on Growth and Agency when billed annually. Contact us and we will switch your workspace.",
  },
] as const;

export const STATS = [
  { value: 6, suffix: "", label: "AI engines tracked" },
  { value: 40, suffix: "k+", label: "prompts scanned" },
  { value: 2, suffix: "x", label: "faster GEO loops" },
  { value: 72, suffix: "%", label: "avg. visibility lift*" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "We finally stopped guessing whether ChatGPT recommended us. Deepchq made AI search a weekly report, not a rumor from sales.",
    name: "Rebecca Chen",
    role: "Content lead, Instant Stack",
  },
  {
    quote:
      "Share of voice vs three competitors, by engine. That is what I needed to get budget for GEO.",
    name: "Marcus Hale",
    role: "SEO director, Northline",
  },
  {
    quote:
      "The audit-to-action list is the difference. We ship the top three items and re-scan. Visibility actually moved.",
    name: "Sofia Alvarez",
    role: "Agency partner, Stella Digital",
  },
] as const;

export const TEAM = [
  {
    name: "Priya Mehta",
    role: "CEO",
    bio: "Previously led growth at a B2B SaaS company that lived and died by organic search.",
  },
  {
    name: "Arjun Shah",
    role: "CTO",
    bio: "Built ranking and crawl systems. Now obsessed with how language models pick sources.",
  },
  {
    name: "Elena Rossi",
    role: "Head of GEO",
    bio: "Content strategist turned measurement nerd. Writes the playbooks behind our recommendations.",
  },
] as const;
