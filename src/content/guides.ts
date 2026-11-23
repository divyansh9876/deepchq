export type Section = { h: string; p?: string[]; list?: string[]; code?: string };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: "Fundamentals" | "Engines" | "Technical" | "Measurement";
  keywords: string[];
  published: string;
  updated: string;
  /** Direct 40–70 word answer shown first. This is the passage engines lift. */
  answer: string;
  keyTakeaways: string[];
  sections: Section[];
  faqs: { q: string; a: string }[];
  related: string[];
};

const D = "2026-11-24";

export const GUIDES: Guide[] = [
  {
    slug: "what-is-generative-engine-optimization",
    title: "What is Generative Engine Optimization (GEO)?",
    description:
      "GEO is the practice of getting your brand mentioned and cited inside AI answers from ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude and Copilot. Definition, how it works, and where to start.",
    category: "Fundamentals",
    keywords: ["generative engine optimization", "what is GEO", "GEO marketing", "AI search optimization", "answer engine optimization"],
    published: D,
    updated: D,
    answer:
      "Generative Engine Optimization (GEO) is the practice of making a brand more likely to be named, recommended and cited inside answers written by AI systems such as ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude and Microsoft Copilot. It combines crawl access, clear entity data, quotable content and third-party mentions, and it is measured by how often you appear across a fixed set of buyer prompts.",
    keyTakeaways: [
      "GEO targets mentions and citations inside generated answers, not positions in a list of links.",
      "Engines answer from two sources: what the model learned in training and what it retrieves live from the web.",
      "The levers are crawlability, entity clarity, passage-level content quality and off-site corroboration.",
      "You measure GEO with prompt tracking: visibility rate, citation rate and share of voice versus competitors.",
    ],
    sections: [
      {
        h: "Where the term comes from",
        p: [
          "The phrase was popularised by a 2023 research paper from Princeton, Georgia Tech, the Allen Institute and IIT Delhi titled “GEO: Generative Engine Optimization”. The authors built a benchmark of queries, rewrote source pages in different ways, and measured how often each page was used in the generated answer. Adding citations, quotations from credible sources and concrete statistics improved a source's visibility by up to roughly 40% in their tests, while keyword stuffing did little.",
          "The industry now uses GEO, AEO (answer engine optimization) and “AI SEO” almost interchangeably. They describe the same goal: be part of the answer.",
        ],
      },
      {
        h: "How generative engines choose what to say",
        p: [
          "Every AI answer is assembled from two inputs. The first is parametric memory — what the model absorbed about your brand during training. The second is retrieval — pages the engine fetches or looks up in its own search index at question time, which it then summarises and often links.",
          "Training data changes slowly and you influence it indirectly, through being widely and consistently described across the web. Retrieval changes daily and is where most practical GEO work pays off: if an engine's crawler can read your page, and your page contains a clean, self-contained answer to the question, it has a good chance of being used and cited.",
        ],
      },
      {
        h: "The four levers of GEO",
        list: [
          "Access — allow AI search crawlers (OAI-SearchBot, PerplexityBot, Claude-SearchBot, Googlebot, Bingbot) and serve text in the HTML rather than only through JavaScript.",
          "Entity clarity — say exactly what you are, who it is for and how you differ, consistently across your site, schema markup and profiles such as LinkedIn, G2, Crunchbase and Wikipedia.",
          "Quotable content — question-led headings, a direct answer in the first two sentences, specific numbers, dated facts, comparisons and FAQs.",
          "Corroboration — independent sources (reviews, listicles, Reddit threads, news, partner pages) that mention you for the same topics. Engines trust consensus.",
        ],
      },
      {
        h: "How to start in one afternoon",
        list: [
          "Write down 15–30 prompts a buyer would actually ask, from “what is X” to “best X for Y” to “X vs competitor”.",
          "Run those prompts across the engines your buyers use and record whether you are mentioned, cited, and who is named instead.",
          "Audit your site for crawler access, structured data and thin pages.",
          "Fix the highest-impact gaps, publish one strong answer page per lost prompt, then re-scan weekly.",
        ],
        p: ["Deepchq automates each of these steps: prompt research, multi-engine scans, the GEO audit, a ranked action list and scheduled re-scans with a weekly email."],
      },
    ],
    faqs: [
      {
        q: "Is GEO replacing SEO?",
        a: "No. Most AI answers that cite sources pull from pages that are already crawlable and reasonably well ranked, so SEO fundamentals still matter. GEO adds a layer focused on being quoted and named inside answers.",
      },
      {
        q: "How long does GEO take to work?",
        a: "Retrieval-based engines such as Perplexity, ChatGPT search and Google AI Overviews can reflect a new or improved page within days to weeks once it is crawled. Changing what a model says from memory takes much longer because it depends on future training runs.",
      },
      {
        q: "What is a good AI visibility rate?",
        a: "It depends on the category and how branded your prompts are. For unbranded category prompts, appearing in 20–30% of answers is solid for a challenger brand; category leaders often exceed 60%. Track the trend against named competitors rather than an absolute target.",
      },
    ],
    related: ["geo-vs-seo", "measure-ai-search-visibility", "content-structure-for-ai-citations", "how-to-rank-in-chatgpt"],
  },
  {
    slug: "geo-vs-seo",
    title: "GEO vs SEO: What's the Difference and Do You Need Both?",
    description:
      "A side-by-side comparison of generative engine optimization and search engine optimization: goals, ranking signals, metrics, and how to run both without doubling your workload.",
    category: "Fundamentals",
    keywords: ["GEO vs SEO", "AI SEO vs traditional SEO", "answer engine optimization vs SEO", "is SEO dead"],
    published: D,
    updated: D,
    answer:
      "SEO aims to rank a page in a list of links; GEO aims to get a brand named and cited inside an AI-written answer. They share foundations — crawlable pages, useful content, authority — but GEO puts more weight on passage-level clarity, entity consistency and third-party corroboration, and it is measured by mention and citation rates across prompts rather than keyword positions and clicks.",
    keyTakeaways: [
      "Same foundation, different unit of competition: SEO competes for a page position, GEO for a sentence in an answer.",
      "GEO rewards self-contained passages, specific facts and consistent entity descriptions.",
      "GEO metrics are visibility rate, citation rate and share of voice — not rank and CTR.",
      "Run them as one program: every SEO page should also be written to be quoted.",
    ],
    sections: [
      {
        h: "Side-by-side comparison",
        list: [
          "Goal — SEO: a top-10 blue link. GEO: a mention, recommendation or citation in the answer.",
          "Unit — SEO: the page. GEO: the passage and the brand entity.",
          "Main signals — SEO: relevance, links, page experience. GEO: retrievability, answer clarity, factual density, corroboration across sources.",
          "Measurement — SEO: rankings, impressions, clicks. GEO: visibility rate, citation rate, position in answer, sentiment, share of voice.",
          "Volatility — SEO: rankings move gradually. GEO: answers vary by run, by engine and by phrasing, so you measure across many prompts and repeat scans.",
        ],
      },
      {
        h: "What carries over from SEO",
        p: [
          "Crawlability, indexation, fast server-rendered HTML, descriptive titles and a sensible internal link structure all still matter. Engines with live retrieval — Google AI Overviews, Copilot and ChatGPT search among them — lean heavily on conventional web indexes. A page that cannot be found there rarely gets cited.",
        ],
      },
      {
        h: "What is new in GEO",
        list: [
          "Write for extraction: put a direct, complete answer right under each question-style heading.",
          "Use numbers, dates, named sources and comparisons. Generic copy is rarely quoted.",
          "Describe your brand the same way everywhere so models build one coherent entity.",
          "Earn mentions on the pages engines already cite for your category: review sites, communities, roundups and comparison articles.",
          "Track prompts, not keywords. A single keyword maps to dozens of conversational questions.",
        ],
      },
      {
        h: "How to run both without doubling the work",
        p: [
          "Keep one content calendar. For each SEO page, add a 40–70 word answer block at the top, an FAQ section with real buyer questions, and FAQPage or Article schema. Then add those questions to your prompt tracker so you can see whether the page actually changes what AI engines say.",
        ],
      },
    ],
    faqs: [
      { q: "Is SEO dead because of AI search?", a: "No. AI answers with sources still depend on crawlable, indexed pages, and traditional search still drives most referral traffic. What is changing is that more decisions happen inside the answer, so being named there matters too." },
      { q: "Do backlinks matter for GEO?", a: "Indirectly. Links help pages get indexed and ranked, which makes them more likely to be retrieved. Unlinked brand mentions on trusted pages also matter for GEO because engines summarise what those pages say." },
    ],
    related: ["what-is-generative-engine-optimization", "content-structure-for-ai-citations", "measure-ai-search-visibility"],
  },
  {
    slug: "how-to-rank-in-chatgpt",
    title: "How to Get Your Brand Recommended by ChatGPT",
    description:
      "A practical playbook for appearing in ChatGPT answers and ChatGPT search citations: crawler access, content that gets quoted, third-party mentions, and how to track results.",
    category: "Engines",
    keywords: ["how to rank in ChatGPT", "get recommended by ChatGPT", "ChatGPT SEO", "ChatGPT search citations", "OAI-SearchBot"],
    published: D,
    updated: D,
    answer:
      "To get recommended by ChatGPT, let OAI-SearchBot and ChatGPT-User crawl your site, publish pages that answer buyer questions directly with specific facts, make sure your brand is described consistently on the third-party pages ChatGPT tends to cite (reviews, comparisons, communities), and track a fixed set of prompts weekly to see whether you are mentioned and linked.",
    keyTakeaways: [
      "ChatGPT answers from training memory and, when it searches, from pages its search crawler has indexed.",
      "Blocking GPTBot (training) does not remove you from ChatGPT search; blocking OAI-SearchBot does.",
      "Comparison pages, pricing pages and clear category pages are the most frequently cited formats.",
      "Measure across many prompts and repeat runs — single answers vary.",
    ],
    sections: [
      {
        h: "1. Check crawler access first",
        p: [
          "OpenAI documents three crawlers. GPTBot collects public pages that may be used for training. OAI-SearchBot builds the index ChatGPT search uses to show and link results. ChatGPT-User fetches a page when a user's conversation needs it. You can block training and still allow search — but if OAI-SearchBot is disallowed, your pages cannot be shown as ChatGPT search results.",
        ],
        code: "User-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\n# Optional: opt out of training only\nUser-agent: GPTBot\nDisallow: /",
      },
      {
        h: "2. Publish the pages ChatGPT likes to cite",
        list: [
          "A category page that states plainly what you are: “Acme is invoicing software for freelancers in India.”",
          "Honest comparison pages (“Acme vs Competitor”) with a table and a clear “best for” verdict.",
          "A pricing page in HTML text, not only in images or a JavaScript widget.",
          "Use-case pages for each audience you serve, each with a direct answer block and FAQs.",
          "Original data: a benchmark, survey or index that other sites will reference.",
        ],
      },
      {
        h: "3. Be present where ChatGPT looks",
        p: [
          "When ChatGPT searches for “best X for Y”, it frequently draws on roundup articles, review platforms and community discussions. If you are missing from those pages, you are likely missing from the answer. List your product on the review sites in your category, contribute genuinely to relevant communities, and pitch inclusion in the roundups that already rank.",
        ],
      },
      {
        h: "4. Track and iterate",
        p: [
          "Pick 20–50 prompts across awareness, consideration and decision stages. Run them on a schedule, record mentions, citations, position and which competitors appear, and tie each content change to the prompts it targets. Deepchq runs this loop automatically and emails you when visibility moves.",
        ],
      },
    ],
    faqs: [
      { q: "Can I pay to appear in ChatGPT answers?", a: "Organic answers cannot be bought. Visibility comes from crawl access, useful content and third-party mentions. Any separately labelled ads are a different product from the organic answer." },
      { q: "Why does ChatGPT give different answers each time?", a: "Generation is probabilistic and search results change, so wording and the brands named vary between runs. That is why visibility should be measured as a rate across many prompts and repeated scans." },
      { q: "Does ChatGPT use Bing?", a: "OpenAI runs its own search crawler (OAI-SearchBot) and has also partnered with search providers. In practice, being well indexed in both your own sitemap and major search engines improves your odds." },
    ],
    related: ["ai-crawlers-robots-txt", "content-structure-for-ai-citations", "how-to-get-cited-by-perplexity", "measure-ai-search-visibility"],
  },
  {
    slug: "how-to-get-cited-by-perplexity",
    title: "How to Get Cited by Perplexity",
    description:
      "Perplexity shows numbered citations in every answer. Learn how PerplexityBot finds sources, which pages it prefers, and how to earn more citations for your brand.",
    category: "Engines",
    keywords: ["Perplexity SEO", "get cited by Perplexity", "PerplexityBot", "Perplexity citations", "rank in Perplexity"],
    published: D,
    updated: D,
    answer:
      "Perplexity searches the web for every question and cites the pages it used. To earn citations, allow PerplexityBot in robots.txt, keep key pages fast and server-rendered, lead each section with a precise answer backed by numbers and dates, update important pages regularly, and get mentioned on the high-authority pages Perplexity already cites for your topic.",
    keyTakeaways: [
      "Perplexity is retrieval-first: nearly every answer is built from freshly fetched sources.",
      "Its own crawler is PerplexityBot; user-triggered fetches use Perplexity-User.",
      "Fresh, specific, well-structured pages are cited more than long generic ones.",
      "Citation rate is the key metric — being mentioned without a link is a missed opportunity.",
    ],
    sections: [
      {
        h: "How Perplexity picks sources",
        p: [
          "For each question Perplexity runs searches, reads a handful of pages, and writes an answer with numbered footnotes. Pages win citations when they contain a passage that answers the sub-question cleanly. Because it re-retrieves every time, improvements to your pages can show up quickly once they are recrawled.",
        ],
      },
      {
        h: "Checklist for more Perplexity citations",
        list: [
          "Allow PerplexityBot and Perplexity-User in robots.txt and make sure your CDN or WAF isn't silently blocking them.",
          "Put a 1–3 sentence answer directly under each H2, then expand.",
          "Include concrete figures (prices, limits, dates, benchmarks) and say where they come from.",
          "Show a visible “Updated” date and keep high-value pages current.",
          "Use descriptive, unique titles — Perplexity displays them in the source list.",
          "Earn mentions on sources it already cites for your category: industry publications, review sites, documentation hubs and well-moderated communities.",
        ],
      },
      {
        h: "What to track",
        p: [
          "Track citation rate (how often your domain appears in the sources) separately from mention rate (how often your brand is named). A high mention rate with a low citation rate usually means others are writing about you more clearly than you are — fix your own pages first.",
        ],
      },
    ],
    faqs: [
      { q: "Does Perplexity respect robots.txt?", a: "Perplexity states that PerplexityBot follows robots.txt. User-initiated fetches (Perplexity-User) may behave differently because they act on behalf of a person, similar to a browser." },
      { q: "How quickly do changes show up in Perplexity?", a: "Because Perplexity retrieves live, updates can appear within days of being recrawled, much faster than changes to a model's training data." },
    ],
    related: ["ai-crawlers-robots-txt", "how-to-rank-in-chatgpt", "content-structure-for-ai-citations"],
  },
  {
    slug: "google-ai-overviews-optimization",
    title: "How to Appear in Google AI Overviews and AI Mode",
    description:
      "Google AI Overviews and AI Mode cite pages from Google's index. What controls inclusion, what Google-Extended does and doesn't do, and the content patterns that get linked.",
    category: "Engines",
    keywords: ["Google AI Overviews optimization", "rank in AI Overviews", "Google AI Mode SEO", "Google-Extended", "SGE optimization"],
    published: D,
    updated: D,
    answer:
      "Google AI Overviews and AI Mode build answers from pages in Google Search's index, so the basics are the same as Google SEO: be indexable by Googlebot, eligible for snippets, and genuinely helpful. Pages that answer a specific sub-question clearly, with supporting detail and structured data, are the ones most often shown as links inside the overview.",
    keyTakeaways: [
      "Inclusion depends on Googlebot and normal Search eligibility — there is no separate AI Overviews crawler.",
      "Google-Extended does not control AI Overviews; it governs use for Gemini models and related products.",
      "nosnippet and max-snippet limit how much of your page can be shown, including in AI features.",
      "Overviews often link to pages beyond the top 10 when they answer a narrow sub-question well.",
    ],
    sections: [
      {
        h: "What controls whether you can appear",
        p: [
          "Google has said AI Overviews and AI Mode use the same Search systems and index. If a page is indexed and eligible to show a snippet, it can be used. Blocking Google-Extended does not remove you from AI Overviews — that token controls whether content is used to improve Gemini models and some grounding features. To limit what Search features can display, use the nosnippet or max-snippet controls.",
        ],
      },
      {
        h: "Content patterns that get linked",
        list: [
          "Question-shaped H2s that mirror follow-up questions (“How long does X take?”, “Is X safe for Y?”).",
          "Short definitional paragraphs followed by steps, tables or lists.",
          "Specific, verifiable facts with dates, which overviews like to attribute.",
          "First-hand experience: original photos, testing notes and named authors with credentials.",
          "Structured data (Article, Product, FAQPage, Organization) that matches the visible content.",
        ],
      },
      {
        h: "Measuring it",
        p: [
          "Search Console reports AI feature traffic inside overall Search performance, not as its own line. To see whether you are cited for specific questions, track a prompt list and check which domains the overview links to. Deepchq records citations by engine so you can see Google separately from ChatGPT or Perplexity.",
        ],
      },
    ],
    faqs: [
      { q: "Should I block Google-Extended?", a: "Only if you don't want your content used to train or ground Gemini models. Blocking it does not affect ranking or inclusion in Google Search or AI Overviews." },
      { q: "Do AI Overviews reduce clicks?", a: "For simple informational queries they often do. Being the linked source keeps you visible and still earns the clicks from users who want depth, which is why citation rate matters." },
    ],
    related: ["schema-markup-for-ai-search", "content-structure-for-ai-citations", "ai-crawlers-robots-txt"],
  },
  {
    slug: "ai-crawlers-robots-txt",
    title: "AI Crawlers and robots.txt: GPTBot, ClaudeBot, PerplexityBot and More",
    description:
      "A reference for every major AI crawler user agent, what each one is used for, and copy-paste robots.txt rules to allow AI search while choosing your training policy.",
    category: "Technical",
    keywords: ["AI crawlers list", "GPTBot robots.txt", "ClaudeBot", "PerplexityBot", "block AI crawlers", "OAI-SearchBot", "Google-Extended"],
    published: D,
    updated: D,
    answer:
      "AI crawlers fall into two groups: search and user-fetch bots that let assistants find and cite your pages (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User, Googlebot, Bingbot) and training bots that collect data for future models (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot). Allow the first group if you want AI visibility; the second is a separate policy choice.",
    keyTakeaways: [
      "Blocking a training bot does not remove you from that company's AI search results.",
      "Blocking a search bot does — and it is the most common accidental GEO mistake.",
      "Check your CDN, WAF and bot-protection rules too; many block AI bots by default.",
      "robots.txt is advisory; compliant crawlers follow it.",
    ],
    sections: [
      {
        h: "AI crawler reference",
        list: [
          "OAI-SearchBot (OpenAI) — indexes pages for ChatGPT search results. Allow for visibility.",
          "ChatGPT-User (OpenAI) — fetches a page when a user's chat needs it.",
          "GPTBot (OpenAI) — collects data that may be used to train models.",
          "PerplexityBot (Perplexity) — indexes pages for Perplexity answers.",
          "Perplexity-User (Perplexity) — user-triggered fetches.",
          "Claude-SearchBot (Anthropic) — indexes pages to improve Claude's search results.",
          "Claude-User (Anthropic) — fetches pages when a Claude user asks.",
          "ClaudeBot (Anthropic) — collects data that may be used for training.",
          "Googlebot (Google) — powers Google Search, including AI Overviews and AI Mode.",
          "Google-Extended (Google) — a control token for use in Gemini models; not a separate crawler and not used for Search ranking.",
          "Bingbot (Microsoft) — powers Bing and Microsoft Copilot answers.",
          "Applebot-Extended (Apple) — controls use of content for Apple's generative models.",
          "CCBot (Common Crawl) — open web archive widely used in model training.",
        ],
      },
      {
        h: "Recommended robots.txt for AI visibility",
        p: ["This allows every search and user-fetch bot, keeps private areas closed, and leaves training as an explicit choice:"],
        code:
          "User-agent: *\nDisallow: /admin/\nDisallow: /account/\n\nUser-agent: OAI-SearchBot\nUser-agent: ChatGPT-User\nUser-agent: PerplexityBot\nUser-agent: Perplexity-User\nUser-agent: Claude-SearchBot\nUser-agent: Claude-User\nAllow: /\n\n# Training crawlers — choose Allow or Disallow deliberately\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: https://www.example.com/sitemap.xml",
      },
      {
        h: "Don't forget the firewall",
        p: [
          "Many CDNs and bot-management products now ship rules that challenge or block AI user agents. A robots.txt that says Allow means nothing if the request never reaches your server. Check your bot settings and server logs for 403 responses to these user agents.",
        ],
      },
    ],
    faqs: [
      { q: "Should I block GPTBot?", a: "It depends on your goals. Blocking GPTBot keeps your content out of future OpenAI training data but does not stop ChatGPT search from citing you, as long as OAI-SearchBot is allowed. Brands that want models to know them well usually allow it on marketing pages." },
      { q: "How do I test which AI bots my site blocks?", a: "Run the free Deepchq GEO audit. It parses your robots.txt per user agent and reports which AI search and training crawlers are blocked at the site root." },
    ],
    related: ["llms-txt-guide", "how-to-rank-in-chatgpt", "how-to-get-cited-by-perplexity"],
  },
  {
    slug: "llms-txt-guide",
    title: "llms.txt: What It Is, Whether It Matters, and How to Write One",
    description:
      "The llms.txt proposal gives language models a curated markdown map of your site. Format, examples, honest expectations, and a free generator.",
    category: "Technical",
    keywords: ["llms.txt", "what is llms.txt", "llms.txt example", "llms.txt generator", "llms-full.txt"],
    published: D,
    updated: D,
    answer:
      "llms.txt is a proposed standard — a markdown file at /llms.txt that gives language models a short summary of your site and a curated list of links to your most useful pages. It was proposed in September 2024 and is used by many documentation sites and AI coding tools. Major AI search engines have not confirmed using it for ranking, so treat it as cheap, low-risk hygiene rather than a ranking factor.",
    keyTakeaways: [
      "It lives at the site root: https://yoursite.com/llms.txt.",
      "Format: an H1 name, a blockquote summary, then H2 sections of markdown links with short notes.",
      "An optional llms-full.txt contains the full text of key pages in one file.",
      "Most useful today for documentation, developer tools and agents that browse on a user's behalf.",
    ],
    sections: [
      {
        h: "The format",
        p: ["Only the H1 is required. A typical file looks like this:"],
        code:
          "# Acme\n\n> Acme is invoicing software for freelancers and small agencies. Plans start free; paid plans are $12/month.\n\n## Product\n- [Features](https://acme.com/features): Invoicing, reminders, multi-currency\n- [Pricing](https://acme.com/pricing): Plans, limits and annual discounts\n\n## Guides\n- [How to invoice international clients](https://acme.com/guides/international-invoicing)\n\n## Optional\n- [Changelog](https://acme.com/changelog)",
      },
      {
        h: "Should you bother?",
        p: [
          "It takes about fifteen minutes and has no downside, so for most sites the answer is yes. Just set expectations: the evidence that ChatGPT, Perplexity or Google use llms.txt to choose citations is thin. What it reliably helps with is agents and developer tools that look for it, and with forcing you to articulate your most important pages — which is useful GEO work in itself.",
        ],
      },
      {
        h: "Tips for a good llms.txt",
        list: [
          "Lead with one factual sentence about what you are and who it is for.",
          "Link to canonical, server-rendered pages — not to pages behind login.",
          "Add a short note after each link so a model knows why it matters.",
          "Keep it current; regenerate when you add key pages.",
        ],
      },
    ],
    faqs: [
      { q: "Is llms.txt the same as robots.txt?", a: "No. robots.txt tells crawlers what they may access. llms.txt suggests what is most worth reading and summarises the site. They complement each other." },
      { q: "Does Google use llms.txt?", a: "Google has not said it uses llms.txt for Search or AI Overviews. Treat it as optional and focus first on crawl access, content quality and structured data." },
    ],
    related: ["ai-crawlers-robots-txt", "schema-markup-for-ai-search"],
  },
  {
    slug: "schema-markup-for-ai-search",
    title: "Schema Markup for AI Search: Which Types Matter for GEO",
    description:
      "How structured data helps AI engines understand your brand as an entity. The schema types worth adding, a copy-paste Organization example, and common mistakes.",
    category: "Technical",
    keywords: ["schema markup for AI", "structured data GEO", "Organization schema", "FAQPage schema", "JSON-LD for AI search"],
    published: D,
    updated: D,
    answer:
      "Structured data won't make an AI engine cite you on its own, but it removes ambiguity about who you are and what each page contains. For GEO, prioritise Organization (with sameAs links to your official profiles), then Product or SoftwareApplication, Article with dates and authors, FAQPage for real Q&A, and BreadcrumbList — always matching what is visible on the page.",
    keyTakeaways: [
      "Organization + sameAs is the single most valuable schema for brand entity clarity.",
      "Dates (datePublished, dateModified) reinforce freshness signals.",
      "Markup must match visible content; mismatches can be ignored or penalised.",
      "Use JSON-LD in the server-rendered HTML.",
    ],
    sections: [
      {
        h: "Priority schema types",
        list: [
          "Organization — name, url, logo, description and sameAs links (LinkedIn, Crunchbase, G2, Wikipedia, GitHub).",
          "Product or SoftwareApplication — category, offers and price where public.",
          "Article / BlogPosting — headline, author, datePublished, dateModified.",
          "FAQPage — only for questions and answers that appear on the page.",
          "BreadcrumbList — clarifies site hierarchy and topical grouping.",
          "LocalBusiness — address, hours and area served for location-based brands.",
        ],
      },
      {
        h: "Copy-paste Organization example",
        code:
          '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Acme",\n  "url": "https://acme.com",\n  "logo": "https://acme.com/logo.png",\n  "description": "Invoicing software for freelancers and small agencies.",\n  "sameAs": [\n    "https://www.linkedin.com/company/acme",\n    "https://www.crunchbase.com/organization/acme",\n    "https://www.g2.com/products/acme"\n  ]\n}\n</script>',
      },
      {
        h: "Common mistakes",
        list: [
          "Injecting schema only with client-side JavaScript that some crawlers never execute.",
          "FAQ schema for questions that aren't on the page.",
          "Different company descriptions in schema, homepage and profiles.",
          "Invalid JSON — one trailing comma breaks the whole block. Deepchq's audit flags this.",
        ],
      },
    ],
    faqs: [
      { q: "Does ChatGPT read schema markup?", a: "OpenAI hasn't published how its systems weight structured data. Schema is still widely used by search indexes that AI answers draw on, and it costs little to add, so it is a sensible default." },
      { q: "Is FAQ schema still worth it?", a: "Google shows FAQ rich results only for a limited set of sites now, but FAQPage markup still describes Q&A content clearly for any system that parses it." },
    ],
    related: ["content-structure-for-ai-citations", "google-ai-overviews-optimization", "llms-txt-guide"],
  },
  {
    slug: "content-structure-for-ai-citations",
    title: "How to Write Content AI Engines Quote and Cite",
    description:
      "The page structure, writing patterns and evidence that make a passage easy for ChatGPT, Perplexity and Google AI Overviews to lift and attribute. With a template.",
    category: "Fundamentals",
    keywords: ["write for AI search", "content for AI citations", "AI-friendly content", "answer-first content", "GEO content strategy"],
    published: D,
    updated: D,
    answer:
      "AI engines quote passages that stand on their own. Use a question-style heading, answer it completely in the first one to three sentences, then support it with specifics — numbers, dates, named sources, examples and comparisons. Keep one idea per section, add an FAQ block, show an updated date, and make sure the text is present in the server-rendered HTML.",
    keyTakeaways: [
      "Answer first, elaborate second.",
      "Specific beats generic: statistics, prices, timelines and named sources get quoted.",
      "Each section should make sense when read alone.",
      "Freshness and authorship signals help engines trust a source.",
    ],
    sections: [
      {
        h: "A page template that gets cited",
        list: [
          "H1 that matches the question or task.",
          "A 40–70 word direct answer (the snippet you want quoted).",
          "Three to five key takeaways as bullets.",
          "H2 sections phrased as follow-up questions, each opening with a one-sentence answer.",
          "At least one table, list or step sequence.",
          "Sources and evidence: data, quotes, links to primary references.",
          "FAQ with 3–8 real buyer questions.",
          "Author, published date and last-updated date.",
        ],
      },
      {
        h: "Writing patterns that help",
        list: [
          "Define terms explicitly: “X is a Y that does Z.”",
          "Name the audience: “best for teams under 20 people.”",
          "State trade-offs honestly; engines are more likely to repeat balanced claims.",
          "Avoid pronouns that depend on earlier paragraphs — say the brand name.",
          "Cite primary sources; the GEO research found citations, quotes and statistics improved visibility.",
        ],
      },
      {
        h: "Technical must-haves",
        p: [
          "If your page renders entirely in the browser, many AI crawlers see an empty shell. Server-render or pre-render important pages, keep them fast, and include structured data that matches the visible text.",
        ],
      },
    ],
    faqs: [
      { q: "How long should a GEO-optimized article be?", a: "Long enough to answer the question and its natural follow-ups — often 800–1,500 words. Length on its own isn't the goal; complete, specific, well-structured answers are." },
      { q: "Should I write for AI or for people?", a: "For people. The patterns that help AI extraction — clear answers, structure and evidence — are the same ones that make pages easier for humans to scan." },
    ],
    related: ["what-is-generative-engine-optimization", "schema-markup-for-ai-search", "how-to-get-cited-by-perplexity"],
  },
  {
    slug: "measure-ai-search-visibility",
    title: "How to Measure AI Search Visibility: Metrics That Matter",
    description:
      "Visibility rate, citation rate, share of voice, position and sentiment: how to define, calculate and report AI search metrics across ChatGPT, Perplexity, Gemini and more.",
    category: "Measurement",
    keywords: ["AI search visibility", "measure GEO", "AI share of voice", "LLM brand monitoring", "AI visibility tracking"],
    published: D,
    updated: D,
    answer:
      "Measure AI search visibility by running a fixed set of buyer prompts across each AI engine on a schedule and recording, for every answer, whether your brand is mentioned, whether your domain is cited, your position relative to competitors and the sentiment. Report visibility rate, citation rate and share of voice over time, by engine and by funnel stage.",
    keyTakeaways: [
      "Visibility rate = answers that mention you ÷ total answers.",
      "Citation rate = answers that link your domain ÷ total answers.",
      "Share of voice = your mentions ÷ mentions of you plus tracked competitors.",
      "Report trends weekly; single answers are noisy.",
    ],
    sections: [
      {
        h: "Core metrics",
        list: [
          "Visibility rate — the share of prompt × engine answers that name your brand.",
          "Citation rate — the share that link or cite your domain as a source.",
          "Average position — where you appear relative to competitors named in the same answer (1 = first).",
          "Share of voice — your mentions as a share of all tracked brands' mentions.",
          "Sentiment — whether the language around your brand is positive, neutral or negative.",
          "Source mix — which third-party domains engines rely on for your category.",
        ],
      },
      {
        h: "Building a prompt set",
        p: [
          "Start with 20–50 prompts split across stages. Awareness: “what is X”, “how to solve Y”. Consideration: “best X for Y”, “X alternatives”. Decision: “Brand vs Competitor”, “Brand pricing”. Keep most prompts unbranded — branded prompts inflate visibility without showing discovery.",
        ],
      },
      {
        h: "Reporting cadence",
        p: [
          "Scan weekly for most brands and daily for competitive or fast-moving categories. Annotate content launches and PR wins on the trend line so you can connect actions to movement. Deepchq does this automatically and emails a weekly digest with the change in visibility and the next recommended action.",
        ],
      },
    ],
    faqs: [
      { q: "How many prompts should I track?", a: "Twenty is enough to see a signal for one product line. Agencies and multi-product brands typically track 50–200 prompts per brand." },
      { q: "Can Google Analytics measure AI search?", a: "Analytics can show referral visits from chatgpt.com, perplexity.ai and similar domains, but it can't show answers where you were mentioned and nobody clicked. Prompt tracking fills that gap." },
    ],
    related: ["ai-search-prompt-research", "what-is-generative-engine-optimization", "geo-vs-seo"],
  },
  {
    slug: "ai-search-prompt-research",
    title: "AI Prompt Research: How to Find the Questions Buyers Ask AI",
    description:
      "Keyword research for the AI era: how to build a prompt list across TOFU, MOFU and BOFU, where to find real questions, and how to prioritise them.",
    category: "Measurement",
    keywords: ["prompt research", "AI keyword research", "prompts to track", "LLM prompt tracking", "conversational search queries"],
    published: D,
    updated: D,
    answer:
      "Prompt research is keyword research for AI assistants: list the conversational questions buyers ask at each funnel stage, phrase them the way people type into ChatGPT (longer and more specific than search keywords), and prioritise the ones closest to a purchase decision where competitors currently appear and you don't.",
    keyTakeaways: [
      "AI prompts are longer and include context: role, budget, location, constraints.",
      "Mine sales calls, support tickets, Reddit, People Also Ask and site search for real phrasing.",
      "Balance stages: about 40% awareness, 40% consideration, 20% decision.",
      "Prioritise prompts where competitors win today.",
    ],
    sections: [
      {
        h: "Where to find real prompts",
        list: [
          "Sales and support transcripts — the exact words prospects use.",
          "Google's People Also Ask and autocomplete for your category.",
          "Reddit, Quora and niche communities — questions with context.",
          "Your own site search and chatbot logs.",
          "Competitor comparison pages — the alternatives buyers weigh.",
        ],
      },
      {
        h: "Turn keywords into prompts",
        list: [
          "Keyword “CRM” → “What's the best CRM for a 10-person real-estate team under $50 a month?”",
          "Keyword “invoice software India” → “Which invoicing app handles GST for freelancers in India?”",
          "Keyword “Acme alternatives” → “Is there something cheaper than Acme with the same reporting?”",
        ],
      },
      {
        h: "Prioritise",
        p: [
          "Run your first scan, then sort prompts by stage and by whether competitors appear without you. Decision-stage prompts where a competitor is recommended are your highest-value fixes. Deepchq suggests starter prompts from your keywords and flags these gaps in its action list.",
        ],
      },
    ],
    faqs: [
      { q: "Should I track branded prompts?", a: "Yes, a few — they show how engines describe you. But keep most prompts unbranded so the data reflects discovery, not recall." },
      { q: "How often should I refresh my prompt list?", a: "Review it quarterly, and add prompts whenever you launch a product, enter a market or notice new questions in sales calls." },
    ],
    related: ["measure-ai-search-visibility", "how-to-rank-in-chatgpt"],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}

export function readMinutes(g: Guide) {
  const words = [g.answer, ...g.keyTakeaways, ...g.sections.flatMap((s) => [s.h, ...(s.p ?? []), ...(s.list ?? []), s.code ?? ""]), ...g.faqs.flatMap((f) => [f.q, f.a])]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(3, Math.round(words / 220));
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
