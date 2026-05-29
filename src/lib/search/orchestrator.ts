import { BRAND_NAME } from "@/lib/brand";
import { dbClient } from "@/lib/db";
import { newId } from "@/lib/id";
import type { PersonReport, SearchMode } from "@/lib/types";
import { webSearch } from "./web-search";
import { extractFromResults, buildAiSummary } from "./extract";
import {
  buildBiography,
  buildPeopleAlsoAsk,
  extractSocialProfiles,
  extractSourceDomains,
  inferSubtitle,
  isLowConfidence,
} from "./synthesize";

type EmitFn = (type: string, payload: Record<string, unknown>) => Promise<void>;

export async function runPeopleSearch(
  searchId: string,
  queryName: string,
  mode: SearchMode = "search",
): Promise<void> {
  let seq = 0;
  const emit: EmitFn = async (type, payload) => {
    seq += 1;
    dbClient.searchEvents.create({
      id: newId("evt"),
      searchId,
      seq,
      type,
      payloadJson: JSON.stringify(payload),
      createdAt: new Date(),
    });
  };

  try {
    dbClient.searches.update(searchId, { status: "planning" });

    const plan = [
      `Search public web for "${queryName}"`,
      "Check social platform listings",
      "Gather location and contact hints",
      "Collect news and web mentions",
    ];
    if (mode === "research") {
      plan.push("Run critique pass and expand coverage");
    }

    await emit("plan", { message: "Building research plan", plan });

    dbClient.searches.update(searchId, { status: "searching" });

    const queries = [
      queryName,
      `${queryName} linkedin`,
      `${queryName} social media`,
      `${queryName} email`,
      `${queryName} location`,
    ];
    if (mode === "research") {
      queries.push(`${queryName} news`, `${queryName} professional background`);
    }

    const allResults = [];
    let sourcesScanned = 0;

    for (const q of queries) {
      await emit("search", { message: `Searching: ${q}`, step: q });
      const results = await webSearch(q);
      allResults.push(...results);
      sourcesScanned += results.length;

      for (const r of results) {
        const domain = (() => {
          try {
            return new URL(r.url).hostname;
          } catch {
            return "unknown";
          }
        })();
        dbClient.sources.create({
          id: newId("src"),
          searchId,
          url: r.url,
          title: r.title,
          domain,
          snippet: r.snippet,
          fetchedAt: new Date(),
        });
      }

      await emit("fetch", {
        message: `Processed ${results.length} sources`,
        sourcesScanned,
      });
      await sleep(mode === "research" ? 400 : 200);
    }

    dbClient.searches.update(searchId, { status: "extracting" });

    await emit("extract", {
      message: "Extracting profile signals",
      sourcesScanned,
    });

    const unique = dedupeByUrl(allResults);
    const { sections, claims: claimRows } = extractFromResults(queryName, unique);

    for (const c of claimRows) {
      dbClient.claims.create({
        id: newId("clm"),
        searchId,
        sourceId: null,
        section: c.section,
        text: c.text,
        confidence: 70,
      });
    }

    dbClient.searches.update(searchId, { status: "synthesizing" });

    await emit("synthesis", { message: "Building your report", sourcesScanned });

    let aiSummary = buildAiSummary(queryName, sections, mode);

    if (mode === "research") {
      await emit("critique", {
        message: "Reviewing report for gaps and clarity",
      });
      aiSummary = buildAiSummary(queryName, sections, "research");
    }

    const socialProfiles = extractSocialProfiles(queryName, unique);
    const sourceDomains = extractSourceDomains(unique);
    const snippets = unique.map((r) => r.snippet);
    const biography = buildBiography(queryName, unique, socialProfiles.length);
    const subtitle = inferSubtitle(queryName, snippets);
    const lowConfidence = isLowConfidence(unique, socialProfiles);

    dbClient.candidates.create({
      id: newId("cand"),
      searchId,
      displayName: queryName,
      avatarUrl: null,
      location: subtitle.includes("·") ? subtitle.split("·").pop()?.trim() ?? null : null,
      confidence: lowConfidence ? 42 : 94,
    });

    const report: PersonReport = {
      queryName,
      sourcesScanned,
      sections,
      aiSummary,
      generatedAt: new Date().toISOString(),
      subtitle,
      biography,
      sourceDomains,
      peopleAlsoAsk: buildPeopleAlsoAsk(queryName),
      socialProfiles,
      lowConfidence,
    };

    dbClient.artifacts.create({
      id: newId("art"),
      searchId,
      format: "json",
      body: JSON.stringify(report),
      unlocked: false,
      createdAt: new Date(),
    });

    const markdown = reportToMarkdown(report);
    dbClient.artifacts.create({
      id: newId("art"),
      searchId,
      format: "markdown",
      body: markdown,
      unlocked: false,
      createdAt: new Date(),
    });

    dbClient.searches.update(searchId, {
      status: "completed",
      completedAt: new Date(),
    });

    await emit("complete", {
      message: "Report ready",
      sourcesScanned,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    dbClient.searches.update(searchId, { status: "failed" });
    await emit("error", { error: message });
  }
}

function dedupeByUrl<T extends { url: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    if (seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function reportToMarkdown(report: PersonReport): string {
  const lines = [
    `# ${BRAND_NAME} Report: ${report.queryName}`,
    "",
    `*${report.sourcesScanned} public sources scanned · ${report.generatedAt}*`,
    "",
    report.aiSummary ?? "",
    "",
  ];
  for (const s of report.sections) {
    lines.push(`## ${s.title}`, "");
    for (const item of s.items) {
      lines.push(`- ${item.text}${item.sourceUrl ? ` ([source](${item.sourceUrl}))` : ""}`);
    }
    lines.push("");
  }
  lines.push(
    "---",
    "*Informational use only. Not a consumer reporting agency. Public sources only.*",
  );
  return lines.join("\n");
}
