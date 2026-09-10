# Deepchq

**AI Search Visibility & GEO Platform** — track brand mentions, citations, and competitor share of voice across ChatGPT, Perplexity, Google AI, Gemini, Claude, and Copilot.

## Features

- **Brand reports** — track visibility per brand + competitors
- **Prompt tracking** — define AI search prompts, auto-suggest from keywords
- **Multi-engine scan** — ChatGPT (real with OpenAI key), others simulated intelligently
- **GEO audit** — robots.txt, llms.txt, schema, content depth
- **Recommendations** — prioritized on-page/off-page actions

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Environment

```env
DATABASE_URL=file:./data/deepchq.json
OPENAI_API_KEY=          # optional — real ChatGPT scan answers
OPENAI_MODEL=gpt-4o-mini
```

## Deploy (Render)

This repo includes `render.yaml` (Blueprint) and a production `Dockerfile`.

1. Push to GitHub.
2. In [Render](https://dashboard.render.com), **New → Blueprint** and select `divyansh9876/deepchq`.
3. Set `OPENAI_API_KEY` in the dashboard if you want live ChatGPT scans (optional).
4. Apply the Blueprint. The service uses Docker, `DATABASE_URL=file:/app/data/deepchq.json`, and a 1 GB disk at `/app/data`.

`plan: starter` is required for the persistent disk. For Render’s free instance, remove the `disk` block in `render.yaml` (the JSON DB will be wiped when the service sleeps).

Also works on Vercel (`next start` / default Next hosting) with:

```env
DATABASE_URL=file:./data/deepchq.json
```
