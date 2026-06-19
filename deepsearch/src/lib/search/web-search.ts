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
  const slug = encodeURIComponent(query);
  return [
    {
      title: `${query} - LinkedIn`,
      url: `https://www.linkedin.com/search/results/people/?keywords=${slug}`,
      snippet: `Professional profile and career history for ${query}.`,
    },
    {
      title: `${query} profiles | Facebook`,
      url: `https://www.facebook.com/public/${slug}`,
      snippet: `Public posts and profile information associated with ${query}.`,
    },
    {
      title: `${query} - Google News`,
      url: `https://news.google.com/search?q=${slug}`,
      snippet: `Recent news mentions and articles referencing ${query}.`,
    },
    {
      title: `Whitepages - ${query}`,
      url: `https://www.whitepages.com/name/${slug}`,
      snippet: `Directory listing with location hints for ${query}.`,
    },
    {
      title: `${query} on X`,
      url: `https://x.com/search?q=${slug}`,
      snippet: `Social posts and public mentions of ${query}.`,
    },
  ];
}
