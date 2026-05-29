export interface WebResult {
  title: string;
  url: string;
  snippet: string;
}

export async function webSearch(query: string): Promise<WebResult[]> {
  const key = process.env.SERPER_API_KEY;
  if (key) {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: 8 }),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        organic?: { title: string; link: string; snippet: string }[];
      };
      return (data.organic ?? []).map((r) => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet,
      }));
    }
  }

  return mockResults(query);
}

function mockResults(query: string): WebResult[] {
  const q = query.toLowerCase();
  if (q.includes("mrbeast") || q.includes("jimmy donaldson")) {
    return [
      {
        title: "MrBeast - Wikipedia",
        url: "https://en.wikipedia.org/wiki/MrBeast",
        snippet:
          "Jimmy Donaldson, known as MrBeast, is an American YouTuber and philanthropist known for expensive stunts and charitable giveaways.",
      },
      {
        title: "MrBeast - YouTube",
        url: "https://www.youtube.com/@MrBeast",
        snippet: "Official YouTube channel with billions of views and subscriber milestones.",
      },
      {
        title: "MrBeast (@MrBeast) / X",
        url: "https://x.com/MrBeast",
        snippet: "Posts and announcements from MrBeast on X (Twitter).",
      },
      {
        title: "MrBeast (@mrbeast) • Instagram",
        url: "https://www.instagram.com/mrbeast/",
        snippet: "Photos and reels from MrBeast on Instagram.",
      },
      {
        title: "MrBeast (@mrbeast) | TikTok",
        url: "https://www.tiktok.com/@mrbeast",
        snippet: "Short-form videos and behind-the-scenes content on TikTok.",
      },
      {
        title: "MrBeast | Facebook",
        url: "https://www.facebook.com/MrBeast",
        snippet: "Public Facebook page for MrBeast community updates.",
      },
      {
        title: "MrBeast | LinkedIn",
        url: "https://www.linkedin.com/in/mrbeast",
        snippet: "Business and philanthropy updates on LinkedIn.",
      },
    ];
  }

  const slug = encodeURIComponent(query);
  const handle = query.replace(/\s+/g, "").toLowerCase();

  return [
    {
      title: `${query} | LinkedIn`,
      url: `https://www.linkedin.com/in/${handle}`,
      snippet: `Professional profile and career history for ${query}.`,
    },
    {
      title: `${query} (@${handle}) • Instagram`,
      url: `https://www.instagram.com/${handle}/`,
      snippet: `Photos, reels, and public posts associated with ${query} on Instagram.`,
    },
    {
      title: `${query} | Facebook`,
      url: `https://www.facebook.com/${handle}`,
      snippet: `Public Facebook profile and posts for ${query}.`,
    },
    {
      title: `${query} (@${handle}) / X`,
      url: `https://x.com/${handle}`,
      snippet: `Posts and public mentions of ${query} on X.`,
    },
    {
      title: `${query} (@${handle}) | TikTok`,
      url: `https://www.tiktok.com/@${handle}`,
      snippet: `Short videos and creator content linked to ${query}.`,
    },
    {
      title: `${query} - YouTube`,
      url: `https://www.youtube.com/@${handle}`,
      snippet: `Videos and channels that may relate to ${query}.`,
    },
    {
      title: `Whitepages - ${query}`,
      url: `https://www.whitepages.com/name/${slug}`,
      snippet: `Directory listing with location and contact hints for ${query}.`,
    },
    {
      title: `${query} - Google News`,
      url: `https://news.google.com/search?q=${slug}`,
      snippet: `Recent news mentions and articles referencing ${query}.`,
    },
    {
      title: `${query} - Spokeo`,
      url: `https://www.spokeo.com/${handle}`,
      snippet: `Aggregated public records and social links for ${query}.`,
    },
    {
      title: `${query} - TruePeopleSearch`,
      url: `https://www.truepeoplesearch.com/results?name=${slug}`,
      snippet: `People-search index entries that may match ${query}.`,
    },
  ];
}
