import type { EngineId } from "@/lib/brand";

export type EnginePage = {
  slug: string;
  engine: EngineId;
  name: string;
  title: string;
  description: string;
  answer: string;
  howItWorks: string[];
  crawlers: string[];
  tracks: string[];
  guide: string;
  faqs: { q: string; a: string }[];
};

export const ENGINE_PAGES: EnginePage[] = [
  {
    slug: "chatgpt",
    engine: "chatgpt",
    name: "ChatGPT",
    title: "ChatGPT Brand Visibility Tracker",
    description:
      "Track whether ChatGPT mentions, recommends and cites your brand for the prompts your buyers ask. Live answers, competitor share of voice and fixes.",
    answer:
      "Deepchq's ChatGPT tracker runs your buyer prompts through OpenAI's models on a schedule and records whether your brand is mentioned, where it ranks against competitors, the sentiment, and which domains are referenced — then tells you what to change to win the prompts you're losing.",
    howItWorks: [
      "ChatGPT answers from what its model learned in training plus, when search is used, pages indexed by OAI-SearchBot.",
      "Answers vary run to run, so visibility is measured as a rate across many prompts.",
      "Comparison, pricing and category pages are frequently referenced for commercial prompts.",
    ],
    crawlers: ["OAI-SearchBot", "ChatGPT-User", "GPTBot (training)"],
    tracks: ["Mention rate", "Position vs competitors", "Sentiment", "Referenced domains", "Answer text history"],
    guide: "how-to-rank-in-chatgpt",
    faqs: [
      { q: "Are the ChatGPT results real?", a: "Yes. With an OpenAI key configured, every scan sends your prompt to OpenAI's API and analyses the actual response. Results are labelled Live in your report." },
      { q: "How often is ChatGPT scanned?", a: "Monthly on Free, weekly on Growth and daily on Agency, plus manual scans whenever you want." },
    ],
  },
  {
    slug: "perplexity",
    engine: "perplexity",
    name: "Perplexity",
    title: "Perplexity Citation Tracker",
    description:
      "See how often Perplexity cites your domain, which sources it prefers for your category, and how you compare with competitors — updated automatically.",
    answer:
      "Deepchq queries Perplexity's Sonar API with your prompts and captures both the answer and its citation list, so you can see your mention rate, citation rate and the exact third-party sources Perplexity relies on for your category.",
    howItWorks: [
      "Perplexity retrieves live web results for nearly every question and shows numbered sources.",
      "Fresh, specific, well-structured pages are cited most.",
      "Citation lists reveal which publications and review sites shape your category.",
    ],
    crawlers: ["PerplexityBot", "Perplexity-User"],
    tracks: ["Citation rate", "Mention rate", "Source domains", "Competitor share of voice"],
    guide: "how-to-get-cited-by-perplexity",
    faqs: [
      { q: "Do you capture Perplexity's sources?", a: "Yes. The citation URLs returned with each answer are stored and shown per prompt, and aggregated into a source mix." },
    ],
  },
  {
    slug: "google-ai-overviews",
    engine: "google_aio",
    name: "Google AI Overviews",
    title: "Google AI Overviews Visibility Tracker",
    description:
      "Monitor your brand's presence in Google AI Overviews and AI Mode, audit eligibility issues, and get actions that make your pages more likely to be linked.",
    answer:
      "Deepchq estimates your Google AI Overviews visibility for each prompt and audits the Search eligibility signals behind it — indexability, snippet controls, structured data and content structure — so you know what to fix to be linked inside the overview.",
    howItWorks: [
      "AI Overviews and AI Mode draw on Google Search's index via Googlebot.",
      "Google-Extended does not control inclusion in AI Overviews.",
      "Pages that answer narrow sub-questions clearly are often linked even outside the top 10.",
    ],
    crawlers: ["Googlebot"],
    tracks: ["Estimated visibility", "Eligibility audit", "Structured data", "Content structure"],
    guide: "google-ai-overviews-optimization",
    faqs: [
      { q: "Is Google AI Overviews tracking live?", a: "Google doesn't offer a public API for AI Overviews, so Deepchq labels these results Estimated and pairs them with a live audit of the eligibility signals you control." },
    ],
  },
  {
    slug: "gemini",
    engine: "gemini",
    name: "Gemini",
    title: "Gemini Brand Visibility Tracker",
    description:
      "Track how Google Gemini answers questions in your category, whether it names your brand, and which web sources it grounds answers in.",
    answer:
      "Deepchq sends your prompts to Gemini with Google Search grounding enabled and records whether your brand appears, how it is described, and which sources Gemini grounded its answer in.",
    howItWorks: [
      "Gemini combines model knowledge with Google Search grounding.",
      "Google-Extended governs whether your content is used for Gemini models.",
      "Consistent entity data across the web helps Gemini describe you accurately.",
    ],
    crawlers: ["Googlebot", "Google-Extended (control token)"],
    tracks: ["Mention rate", "Grounding sources", "Sentiment", "Competitor share of voice"],
    guide: "schema-markup-for-ai-search",
    faqs: [
      { q: "Does blocking Google-Extended hide me from Gemini?", a: "It stops your content being used to improve Gemini models and some grounding uses. It doesn't affect Google Search. Most brands that want AI visibility leave it allowed." },
    ],
  },
  {
    slug: "claude",
    engine: "claude",
    name: "Claude",
    title: "Claude Brand Visibility Tracker",
    description:
      "Find out whether Anthropic's Claude recommends your brand, how it describes you, and which competitors it names instead.",
    answer:
      "Deepchq runs your prompts through Anthropic's Claude API and analyses whether your brand is mentioned, how it is positioned against competitors and the tone of the description — a direct read on what the model knows about you.",
    howItWorks: [
      "Claude answers from training data and, in its apps, from web search when enabled.",
      "Claude-SearchBot and Claude-User fetch pages for search and user requests; ClaudeBot collects training data.",
      "Clear, widely corroborated brand descriptions shape what the model says.",
    ],
    crawlers: ["Claude-SearchBot", "Claude-User", "ClaudeBot (training)"],
    tracks: ["Mention rate", "Position vs competitors", "Sentiment", "Answer text history"],
    guide: "ai-crawlers-robots-txt",
    faqs: [
      { q: "Why track Claude?", a: "Claude is widely used inside companies for research and vendor shortlists, so how it describes your category influences B2B buying decisions." },
    ],
  },
  {
    slug: "copilot",
    engine: "copilot",
    name: "Microsoft Copilot",
    title: "Microsoft Copilot Visibility Tracker",
    description:
      "Estimate your visibility in Microsoft Copilot answers, audit the Bing signals behind it, and see how competitors compare.",
    answer:
      "Deepchq estimates your Microsoft Copilot visibility and audits the Bing-side signals that drive it — Bingbot access, sitemaps, freshness and structured data — because Copilot grounds its answers in Bing's index.",
    howItWorks: [
      "Copilot grounds answers in Bing search results.",
      "Bing Webmaster Tools and IndexNow help new pages get discovered quickly.",
      "Copilot is embedded in Windows, Edge and Microsoft 365, so it reaches many workplace buyers.",
    ],
    crawlers: ["Bingbot"],
    tracks: ["Estimated visibility", "Bing crawl access", "Sitemap & freshness", "Competitor share of voice"],
    guide: "ai-crawlers-robots-txt",
    faqs: [
      { q: "Is Copilot tracking live?", a: "Copilot has no public answer API, so results are labelled Estimated and are combined with a live audit of the Bing signals you control." },
    ],
  },
];

export type IndustryPage = {
  slug: string;
  name: string;
  title: string;
  description: string;
  answer: string;
  prompts: string[];
  priorities: string[];
  faqs: { q: string; a: string }[];
};

export const INDUSTRY_PAGES: IndustryPage[] = [
  {
    slug: "saas",
    name: "SaaS",
    title: "GEO for SaaS: Get Recommended by AI When Buyers Shortlist Software",
    description:
      "How B2B and B2C SaaS companies win AI search: the prompts to track, the pages that get cited, and how to measure share of voice against competitors.",
    answer:
      "For SaaS, AI assistants have become a shortlist tool: buyers ask “best X for Y” and “X vs Y” and get three to five named products. Win by tracking those category and comparison prompts, publishing honest comparison and use-case pages, keeping pricing in crawlable HTML, and earning mentions on review sites and roundups that engines cite.",
    prompts: [
      "What's the best project management tool for a 15-person agency?",
      "Alternatives to [competitor] with better reporting",
      "[Your brand] vs [competitor] for startups",
      "Which CRM integrates natively with WhatsApp?",
      "How much does [category] software cost per user?",
    ],
    priorities: [
      "Comparison and alternatives pages with a clear “best for” verdict",
      "Use-case pages per persona and company size",
      "Pricing and limits in HTML text",
      "Profiles on review platforms with recent reviews",
      "Docs and changelog that crawlers can read",
    ],
    faqs: [
      { q: "Which AI engine matters most for SaaS?", a: "ChatGPT has the largest audience, but Perplexity and Claude are heavily used for research by technical and B2B buyers. Track all of them and prioritise where your buyers are." },
    ],
  },
  {
    slug: "ecommerce",
    name: "Ecommerce & D2C",
    title: "GEO for Ecommerce: Get Your Products Recommended by AI Shopping Answers",
    description:
      "How online stores and D2C brands appear in AI product recommendations: product data, reviews, buying guides and the prompts worth tracking.",
    answer:
      "AI shopping answers recommend products using structured product data, reviews and buying guides. Ecommerce brands win by publishing complete Product schema with price and availability, building genuinely useful buying guides, earning coverage in review roundups, and tracking “best [product] for [need] under [price]” prompts across engines.",
    prompts: [
      "Best running shoes for flat feet under $120",
      "Is [brand] good quality?",
      "Most sustainable [product] brands",
      "[Brand] vs [competitor] — which lasts longer?",
      "Gift ideas for a new homeowner",
    ],
    priorities: [
      "Product schema with offers, price, availability and reviews",
      "Buying guides that answer comparison questions",
      "Mentions in editorial roundups and review sites",
      "Clear shipping, returns and sizing information in text",
      "Fast, server-rendered category pages",
    ],
    faqs: [
      { q: "Do AI engines use my product feed?", a: "Some shopping experiences use merchant feeds, while conversational answers mostly rely on crawled pages and reviews. Keep both accurate and consistent." },
    ],
  },
  {
    slug: "agencies",
    name: "Agencies",
    title: "GEO for Agencies: Productise AI Search Visibility for Clients",
    description:
      "How marketing and SEO agencies sell, deliver and report GEO retainers: multi-client tracking, automated reports and an action plan per brand.",
    answer:
      "Agencies turn GEO into a retainer by tracking a prompt set per client, reporting visibility, citation rate and share of voice monthly, and shipping a prioritised action list each cycle. Automated scans and digests keep reporting time low so the retainer stays profitable.",
    prompts: [
      "Best [client category] in [city]",
      "[Client] reviews",
      "[Client] vs [competitor]",
      "Who are the top [industry] providers for enterprises?",
      "Is [client] legit?",
    ],
    priorities: [
      "A baseline audit and scan for every new client",
      "A fixed prompt set agreed with the client",
      "Monthly visibility and share-of-voice reporting",
      "Action plans tied to specific lost prompts",
      "Automated alerts when visibility drops",
    ],
    faqs: [
      { q: "How do agencies price GEO?", a: "Common models are a GEO add-on to an SEO retainer, or a standalone retainer priced by number of brands and prompts tracked plus content production." },
    ],
  },
  {
    slug: "fintech",
    name: "Fintech",
    title: "GEO for Fintech: Earn Trust in AI Answers About Money",
    description:
      "How fintech brands appear accurately in AI answers about banking, payments, lending and investing — with the trust signals engines need.",
    answer:
      "In finance, AI engines lean toward sources that show clear credentials, regulation and up-to-date fees. Fintech brands win by publishing precise, dated fee and rate pages, regulatory and security disclosures in plain text, comparison content, and by monitoring sentiment closely because one negative description can repeat across engines.",
    prompts: [
      "Best payment gateway for small businesses in India",
      "Cheapest way to send money from the UK to India",
      "Is [brand] regulated?",
      "[Brand] fees vs [competitor]",
      "Best business account for freelancers",
    ],
    priorities: [
      "Dated, specific fee and rate pages",
      "Licensing and security information in crawlable text",
      "Author and reviewer credentials on educational content",
      "Sentiment monitoring across engines",
      "Corroboration from regulators' registers and reputable press",
    ],
    faqs: [
      { q: "Why is sentiment so important in fintech?", a: "Trust drives conversion in financial products, and AI answers often repeat cautions from reviews and forums. Tracking sentiment shows which concerns to address directly on your site." },
    ],
  },
  {
    slug: "local-businesses",
    name: "Local businesses",
    title: "GEO for Local Businesses: Get Recommended When People Ask AI “Near Me”",
    description:
      "How clinics, restaurants, salons, contractors and other local businesses show up when people ask AI assistants for recommendations nearby.",
    answer:
      "When people ask AI for a local recommendation, engines rely on business profiles, reviews, directories and local news. Local businesses win by keeping name, address and phone identical everywhere, adding LocalBusiness schema, earning recent reviews, and publishing pages that answer specific service and pricing questions.",
    prompts: [
      "Best dentist in Indiranagar Bangalore open on Sunday",
      "Affordable wedding photographer in Austin",
      "Who does same-day AC repair near Andheri?",
      "Top-rated Italian restaurant for a birthday dinner in Pune",
      "[Business] reviews",
    ],
    priorities: [
      "Consistent name, address and phone across all listings",
      "LocalBusiness schema with hours and area served",
      "A steady flow of recent reviews",
      "Service pages with prices and FAQs",
      "Mentions in local guides and news",
    ],
    faqs: [
      { q: "Does my Google Business Profile matter for AI answers?", a: "Yes. Profiles, reviews and directory listings are among the most-used sources for local recommendations across AI assistants." },
    ],
  },
];

export function getEnginePage(slug: string) {
  return ENGINE_PAGES.find((e) => e.slug === slug) ?? null;
}

export function getIndustryPage(slug: string) {
  return INDUSTRY_PAGES.find((i) => i.slug === slug) ?? null;
}
