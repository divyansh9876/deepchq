#!/usr/bin/env npx tsx
/**
 * Generates ad campaigns, copy, and review queue from app brand + funnel spec.
 * Run: npm run ads:generate
 */
import fs from "fs";
import path from "path";
import {
  buildAutomationBundle,
  type AdsAutomationConfig,
} from "../../src/lib/ads/automation-spec";

const ROOT = path.join(process.cwd(), "generated", "ads");
const CONFIG_PATH = path.join(process.cwd(), "scripts", "ads", "config.json");

function loadConfig(): Partial<AdsAutomationConfig> {
  if (!fs.existsSync(CONFIG_PATH)) return {};
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) as Partial<AdsAutomationConfig>;
}

function writeJson(rel: string, data: unknown) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

function writeText(rel: string, text: string) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function renderReviewChecklist(bundle: ReturnType<typeof buildAutomationBundle>): string {
  const lines: string[] = [
    "# Ad verification queue (manual publish gate)",
    "",
    `Generated: ${bundle.generatedAt}`,
    `Base URL: ${bundle.config.baseUrl}`,
    `Mode: ${bundle.config.publishMode} — **all campaigns PAUSED until you approve**`,
    "",
    "## Instagram organic alignment",
    "",
    `Profile: ${bundle.instagramOrganic.handle} · ${bundle.instagramOrganic.profileUrl}`,
    "",
    "Before enabling Instagram/Snap spend, confirm paid ads match:",
    "- [ ] Dark hero + blue accent (`#3b82f6`)",
    "- [ ] Same headlines as `/ads/instagram/step/*`",
    "- [ ] Bio claims match public-sources-only disclaimer",
    "- [ ] Link-in-bio URL matches generated landing URL below",
    "",
    "### Organic post checklist",
    "",
  ];
  for (const t of bundle.instagramOrganic.postTemplates) {
    lines.push(`- [ ] **${t.type}**: ${"script" in t ? t.script : "slides" in t ? t.slides.join(" · ") : t.frames.join(" · ")}`);
  }

  lines.push("", "## Campaigns pending approval", "");

  for (const item of bundle.reviewQueue) {
    lines.push(`### ${item.platform.toUpperCase()} — ${item.name}`);
    lines.push(`- [ ] Landing URL tested: ${item.landingUrl}`);
    lines.push(`- [ ] Copy/legal reviewed`);
    lines.push(`- [ ] Creative assets attached in ad manager`);
    lines.push(`- [ ] Pixel firing (PageView + Lead)`);
    lines.push(`- [ ] Budget cap: $${bundle.config.dailyBudgetUsd}/day`);
    lines.push(`- [ ] **Approved to go live** (name + date): _______________`);
    lines.push("");
    for (const n of item.notes) lines.push(`  - ${n}`);
    lines.push("");
  }

  lines.push("## Publish (manual only)", "");
  lines.push("1. Google Ads → Import `google/import-sheet.csv` or recreate from JSON");
  lines.push("2. Meta Ads Manager → Use `meta/campaign-draft.json`");
  lines.push("3. Snapchat Ads Manager → Use `snapchat/campaign-draft.json`");
  lines.push("4. Never auto-enable; toggle campaign to Active only after checklist complete.");

  return lines.join("\n");
}

function renderGoogleCsv(bundle: ReturnType<typeof buildAutomationBundle>): string {
  const rows = [
    "Campaign,Ad group,Keyword,Match type,Headline 1,Headline 2,Description,Final URL,Status",
  ];
  const campaigns = bundle.platforms.google.campaigns as {
    name: string;
    finalUrl: string;
    adGroups: {
      name: string;
      keywords: { text: string; match: string }[];
      responsiveSearchAd: { headlines: string[]; descriptions: string[] };
    }[];
  }[];

  for (const c of campaigns) {
    for (const ag of c.adGroups) {
      for (const kw of ag.keywords) {
        rows.push(
          [
            c.name,
            ag.name,
            kw.text,
            kw.match,
            ag.responsiveSearchAd.headlines[0] ?? "",
            ag.responsiveSearchAd.headlines[1] ?? "",
            ag.responsiveSearchAd.descriptions[0] ?? "",
            c.finalUrl,
            "Paused",
          ]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(","),
        );
      }
    }
  }
  return rows.join("\n") + "\n";
}

function renderCreativeBriefs(bundle: ReturnType<typeof buildAutomationBundle>): string {
  const lines: string[] = ["# Creative briefs (auto-generated)", ""];
  lines.push("## Brand kit", "");
  lines.push(`- Background: ${bundle.brand.visual.background}`);
  lines.push(`- Accent: ${bundle.brand.visual.accent}`);
  lines.push(`- Support: ${bundle.brand.supportEmail}`);
  lines.push("");

  lines.push("## Screenshot capture list", "");
  for (const p of bundle.instagramOrganic.screenshotPaths) {
    lines.push(`- [ ] \`${bundle.config.baseUrl}${p}\``);
  }
  lines.push("");

  for (const platform of ["instagram", "snapchat", "google"] as const) {
    lines.push(`## ${platform}`, "");
    for (const step of bundle.platforms[platform].funnelCopy) {
      lines.push(`### Step ${step.step}`);
      lines.push(`- **Headline:** ${step.headline}`);
      lines.push(`- **Body:** ${step.body}`);
      lines.push(`- **Visual:** ${step.illustration}`);
      lines.push("");
    }
  }
  return lines.join("\n");
}

function main() {
  const userConfig = loadConfig();
  const bundle = buildAutomationBundle(userConfig);

  writeJson("manifest.json", bundle);
  writeJson("brand-reference.json", {
    visual: bundle.brand.visual,
    homepage: bundle.platforms.instagram.funnelCopy,
    instagramOrganic: bundle.instagramOrganic,
  });
  writeJson("google/campaign-draft.json", bundle.platforms.google.campaigns);
  writeText("google/import-sheet.csv", renderGoogleCsv(bundle));
  writeJson("meta/campaign-draft.json", bundle.platforms.instagram.campaigns);
  writeJson("snapchat/campaign-draft.json", bundle.platforms.snapchat.campaigns);
  writeText("review/VERIFICATION-CHECKLIST.md", renderReviewChecklist(bundle));
  writeText("creatives/CREATIVE-BRIEFS.md", renderCreativeBriefs(bundle));

  const urls = bundle.reviewQueue.map((r) => r.landingUrl).join("\n");
  writeText("review/landing-urls.txt", urls + "\n");

  console.log(`✓ Generated ad bundle → ${ROOT}`);
  console.log(`  Review: ${path.join(ROOT, "review/VERIFICATION-CHECKLIST.md")}`);
  console.log(`  Campaigns: ${bundle.reviewQueue.length} pending human approval`);
}

main();
