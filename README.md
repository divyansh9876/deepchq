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

## Deploy

Works on Render, Vercel, or Docker (`output: standalone`).

```env
DATABASE_URL=file:/app/data/deepchq.json
```

Mount a persistent disk at `/app/data` for production data.
