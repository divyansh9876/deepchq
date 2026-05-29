# Docker deployment

## Quick start

```bash
cp .env.docker.example .env
# Edit .env — set NEXT_PUBLIC_APP_URL to your public URL (https://...)

docker compose build
docker compose up -d
```

App: [http://localhost:3000](http://localhost:3000)

Data persists in Docker volume `deepchq-data` (JSON database at `/app/data/deepchq.json`).

## Commands

| Command | Description |
|---------|-------------|
| `docker compose build` | Build image `deepchq:latest` |
| `docker compose up -d` | Start in background |
| `docker compose logs -f deepchq` | Follow logs |
| `docker compose down` | Stop containers |
| `docker compose down -v` | Stop and **delete** database volume |

## Production notes

1. Put **HTTPS** in front (Caddy, nginx, Traefik, or a cloud load balancer).
2. Set `NEXT_PUBLIC_APP_URL` to your public origin (required for Stripe redirects and mobile app).
3. Set `ALLOW_DEV_UNLOCK=false` in production.
4. Configure `SERPER_API_KEY`, `STRIPE_*` in `.env`.
5. For Google Play, use the same public URL as `CAPACITOR_SERVER_URL` in `mobile/.env`.

## Image details

- Multi-stage build with Next.js `output: "standalone"`.
- Runs as non-root user `nextjs` (uid 1001).
- Health check: `GET /` on port 3000.

## Example: reverse proxy (Caddy)

```
your-domain.com {
  reverse_proxy deepchq:3000
}
```

Run Deepchq on an internal Docker network; only expose 443 on the proxy.
