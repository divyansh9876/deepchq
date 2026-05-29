#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -z "${CAPACITOR_SERVER_URL:-}" ]]; then
  echo "Set CAPACITOR_SERVER_URL in mobile/.env (HTTPS production URL)"
  exit 1
fi

echo "Syncing Android with server: $CAPACITOR_SERVER_URL"
npm install
if [[ ! -d android ]]; then
  npx cap add android
fi
npx cap sync android
echo "Done. Open Android Studio: npm run cap:open"
