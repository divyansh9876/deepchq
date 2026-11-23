export type Term = { slug: string; term: string; short: string; body: string[]; related: string[]; guide?: string };

export const GLOSSARY: Term[] = [
  {
    slug: "generative-engine-optimization",
    term: "Generative Engine Optimization (GEO)",
    short: "The practice of increasing how often a brand is mentioned and cited in answers produced by AI systems such as ChatGPT, Perplexity and Google AI Overviews.",
    body: [
      "GEO focuses on being part of the answer rather than ranking as a link. It combines crawl access, entity clarity, quotable content and third-party corroboration.",
      "Progress is measured by tracking a fixed set of prompts and reporting visibility rate, citation rate and share of voice over time.",
    ],
    related: ["answer-engine-optimization", "ai-visibility", "share-of-voice"],
    guide: "what-is-generative-engine-optimization",
  },
  {
    slug: "answer-engine-optimization",
    term: "Answer Engine Optimization (AEO)",
    short: "Optimising content so that answer-style systems — AI assistants, voice assistants and featured snippets — use it to answer questions directly.",
    body: [
      "AEO predates generative AI and originally targeted featured snippets and voice search. Today the term is largely interchangeable with GEO.",
    ],
    related: ["generative-engine-optimization", "featured-snippet"],
  },
  {
    slug: "ai-visibility",
    term: "AI visibility",
    short: "How often a brand appears in AI-generated answers for a defined set of prompts, usually expressed as a percentage.",
    body: [
      "AI visibility rate = answers that mention the brand ÷ total answers analysed. It is tracked per engine and per funnel stage because results differ widely between them.",
    ],
    related: ["citation-rate", "share-of-voice", "prompt-tracking"],
    guide: "measure-ai-search-visibility",
  },
  {
    slug: "citation-rate",
    term: "Citation rate",
    short: "The percentage of AI answers that link to or cite a brand's own domain as a source.",
    body: [
      "Citation rate is usually lower than mention rate. A large gap means engines talk about you using other people's pages — a sign your own content isn't the clearest source.",
    ],
    related: ["ai-visibility", "source-mix"],
    guide: "how-to-get-cited-by-perplexity",
  },
  {
    slug: "share-of-voice",
    term: "AI share of voice",
    short: "A brand's mentions in AI answers as a share of the total mentions of that brand and its tracked competitors.",
    body: [
      "Share of voice shows competitive position independently of how many prompts you track. It is most useful broken down by engine and by prompt stage.",
    ],
    related: ["ai-visibility", "competitor-gap"],
  },
  {
    slug: "prompt-tracking",
    term: "Prompt tracking",
    short: "Running a fixed list of buyer questions through AI engines on a schedule and recording how each answer treats your brand.",
    body: [
      "Prompt tracking is to GEO what rank tracking is to SEO. Because AI answers vary between runs, it relies on many prompts and repeated scans to produce stable trends.",
    ],
    related: ["prompt-research", "ai-visibility"],
    guide: "measure-ai-search-visibility",
  },
  {
    slug: "prompt-research",
    term: "Prompt research",
    short: "Finding and prioritising the conversational questions buyers ask AI assistants, across awareness, consideration and decision stages.",
    body: ["It is the AI-era equivalent of keyword research. Prompts are longer and carry more context — budget, location, team size — than search keywords."],
    related: ["prompt-tracking", "tofu-mofu-bofu"],
    guide: "ai-search-prompt-research",
  },
  {
    slug: "tofu-mofu-bofu",
    term: "TOFU / MOFU / BOFU prompts",
    short: "Top-, middle- and bottom-of-funnel prompts: problem questions, solution comparisons and brand-specific decision questions.",
    body: ["Balancing prompts across stages prevents a misleading picture. Bottom-funnel branded prompts are easy to win; top- and middle-funnel prompts show real discovery."],
    related: ["prompt-research"],
  },
  {
    slug: "llms-txt",
    term: "llms.txt",
    short: "A proposed markdown file at a site's root that summarises the site and links to its most useful pages for language models.",
    body: [
      "Proposed in 2024, llms.txt is used by many documentation sites and developer tools. Major AI search engines have not confirmed using it for ranking.",
    ],
    related: ["robots-txt", "ai-crawler"],
    guide: "llms-txt-guide",
  },
  {
    slug: "robots-txt",
    term: "robots.txt",
    short: "A text file at a site's root that tells crawlers which paths they may access, per user agent.",
    body: ["For GEO, the key decision is to allow AI search crawlers while choosing a deliberate policy for training crawlers."],
    related: ["ai-crawler", "llms-txt"],
    guide: "ai-crawlers-robots-txt",
  },
  {
    slug: "ai-crawler",
    term: "AI crawler",
    short: "A bot operated by an AI company to fetch web pages, either to build a search index, answer a user's request, or collect training data.",
    body: ["Examples include OAI-SearchBot, GPTBot, PerplexityBot, ClaudeBot, Claude-SearchBot and Applebot-Extended. Each can be controlled separately in robots.txt."],
    related: ["robots-txt", "gptbot", "retrieval-augmented-generation"],
    guide: "ai-crawlers-robots-txt",
  },
  {
    slug: "gptbot",
    term: "GPTBot",
    short: "OpenAI's crawler that collects public web content that may be used to train its models.",
    body: ["Blocking GPTBot does not remove a site from ChatGPT search results; that is controlled by OAI-SearchBot."],
    related: ["ai-crawler", "robots-txt"],
    guide: "ai-crawlers-robots-txt",
  },
  {
    slug: "retrieval-augmented-generation",
    term: "Retrieval-augmented generation (RAG)",
    short: "A technique where an AI system retrieves relevant documents at question time and uses them to write a grounded answer.",
    body: ["Most AI search products use a form of RAG. It is why crawlable, well-structured pages can influence answers quickly, without waiting for model retraining."],
    related: ["grounding", "parametric-knowledge"],
  },
  {
    slug: "grounding",
    term: "Grounding",
    short: "Anchoring an AI model's answer in specific retrieved sources, often shown to users as citations.",
    body: ["Gemini's Google Search grounding and Perplexity's cited answers are examples. Grounded answers are where citation rate is measured."],
    related: ["retrieval-augmented-generation", "citation-rate"],
  },
  {
    slug: "parametric-knowledge",
    term: "Parametric knowledge",
    short: "What a language model knows from its training data, stored in its weights rather than retrieved at question time.",
    body: ["Influencing parametric knowledge is slow: it depends on being described widely and consistently across the web before future training runs."],
    related: ["retrieval-augmented-generation", "entity"],
  },
  {
    slug: "entity",
    term: "Entity",
    short: "A distinct, identifiable thing — a company, product, person or place — that search engines and models represent as one concept.",
    body: ["Clear entity signals (consistent name and description, Organization schema with sameAs links, authoritative profiles) help engines connect every mention to the right brand."],
    related: ["schema-markup", "parametric-knowledge"],
    guide: "schema-markup-for-ai-search",
  },
  {
    slug: "schema-markup",
    term: "Schema markup",
    short: "Structured data, usually JSON-LD using the schema.org vocabulary, that describes a page's content in machine-readable form.",
    body: ["For GEO, the most valuable types are Organization, Product or SoftwareApplication, Article, FAQPage and BreadcrumbList."],
    related: ["entity"],
    guide: "schema-markup-for-ai-search",
  },
  {
    slug: "ai-overviews",
    term: "AI Overviews",
    short: "Google's AI-generated summaries at the top of some search results, with links to supporting pages from Google's index.",
    body: ["Inclusion depends on normal Google Search eligibility via Googlebot; the Google-Extended token does not control it."],
    related: ["grounding", "featured-snippet"],
    guide: "google-ai-overviews-optimization",
  },
  {
    slug: "featured-snippet",
    term: "Featured snippet",
    short: "A highlighted excerpt Google shows above organic results to answer a query directly.",
    body: ["Pages that earn featured snippets tend to have the answer-first structure that also helps in AI answers."],
    related: ["answer-engine-optimization", "ai-overviews"],
  },
  {
    slug: "source-mix",
    term: "Source mix",
    short: "The set of domains AI engines cite when answering prompts in your category.",
    body: ["Analysing the source mix shows which publications, review sites and communities shape AI answers — and where earning a mention would have the most effect."],
    related: ["citation-rate", "competitor-gap"],
  },
  {
    slug: "competitor-gap",
    term: "Competitor gap",
    short: "A prompt where an AI engine names one or more competitors but not your brand.",
    body: ["Competitor gaps on decision-stage prompts are usually the highest-value GEO fixes."],
    related: ["share-of-voice", "source-mix"],
  },
];

export function getTerm(slug: string) {
  return GLOSSARY.find((t) => t.slug === slug) ?? null;
}
