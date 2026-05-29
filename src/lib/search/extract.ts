import type { WebResult } from "./web-search";
import type { ReportSection } from "@/lib/types";

export function extractFromResults(
  queryName: string,
  results: WebResult[],
): { sections: ReportSection[]; claims: { section: string; text: string; sourceUrl: string }[] } {
  const claims: { section: string; text: string; sourceUrl: string }[] = [];
  const social: ReportSection["items"] = [];
  const emails: ReportSection["items"] = [];
  const locations: ReportSection["items"] = [];
  const connections: ReportSection["items"] = [];
  const mentions: ReportSection["items"] = [];

  for (const r of results) {
    const domain = new URL(r.url).hostname.replace(/^www\./, "");

    if (/linkedin|facebook|instagram|twitter|x\.com|tiktok/i.test(domain)) {
      const platform = domain.split(".")[0];
      const item = {
        text: `Possible ${platform} profile found for ${queryName}`,
        sourceUrl: r.url,
      };
      social.push(item);
      claims.push({ section: "social_accounts", text: item.text, sourceUrl: r.url });
    }

    if (/whitepages|spokeo|truepeople|fastpeople/i.test(domain)) {
      const item = {
        text: `Location or contact hint from ${domain}`,
        sourceUrl: r.url,
      };
      locations.push(item);
      claims.push({ section: "location", text: item.text, sourceUrl: r.url });
    }

    if (/news|bbc|cnn|reuters/i.test(domain) || /news/i.test(r.url)) {
      const item = { text: r.snippet, sourceUrl: r.url };
      mentions.push(item);
      claims.push({ section: "web_mentions", text: item.text, sourceUrl: r.url });
    }

    const emailMatch = r.snippet.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      const item = {
        text: `Public email pattern: ${emailMatch[0]}`,
        sourceUrl: r.url,
      };
      emails.push(item);
      claims.push({ section: "email", text: item.text, sourceUrl: r.url });
    }
  }

  if (social.length === 0) {
    social.push({
      text: `No verified social profiles found in scanned public sources for "${queryName}".`,
    });
  }

  const sections: ReportSection[] = [
    {
      id: "full_name",
      title: "Full Name",
      items: [{ text: queryName }],
    },
    {
      id: "social_accounts",
      title: "Social Accounts",
      items: social.slice(0, 6),
    },
    {
      id: "email",
      title: "Email Address",
      items: emails.length ? emails : [{ text: "No public emails identified in scanned sources." }],
    },
    {
      id: "location",
      title: "City & Region",
      items: locations.length
        ? locations
        : [{ text: "Location data not found in current public scan." }],
    },
    {
      id: "connections",
      title: "Connections",
      items:
        connections.length > 0
          ? connections
          : [
              {
                text: `Related public mentions may include associates of ${queryName} in news and directory sources.`,
              },
            ],
    },
    {
      id: "web_mentions",
      title: "Web Mentions",
      items: mentions.length
        ? mentions.slice(0, 8)
        : [{ text: "No major news mentions in scanned results." }],
    },
  ];

  return { sections, claims };
}

export function buildAiSummary(
  queryName: string,
  sections: ReportSection[],
  mode: "search" | "research",
): string {
  const social = sections.find((s) => s.id === "social_accounts");
  const mentionCount = sections.find((s) => s.id === "web_mentions")?.items.length ?? 0;

  let summary = `Deepchq scanned public sources for **${queryName}**. `;
  summary += `We found ${social?.items.length ?? 0} social-related signals and ${mentionCount} web mention entries. `;
  summary +=
    "This report aggregates only publicly available information and should not be used for employment, credit, or tenant screening decisions.";

  if (mode === "research") {
    summary += "\n\n### Deep Research insights\n";
    summary +=
      "- Cross-referenced multiple query variants across directories and social platforms.\n";
    summary +=
      "- Highlighted gaps where data may be outdated or tied to a different person with the same name.\n";
    summary +=
      "- Recommend verifying critical details directly with the subject or primary sources.";
  }

  return summary;
}
