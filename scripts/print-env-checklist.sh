#!/usr/bin/env bash
# Prints which keys are set in config/env.values (values hidden).
# Usage: ./scripts/print-env-checklist.sh

set -euo pipefail
FILE="${1:-config/env.values}"

if [[ ! -f "$FILE" ]]; then
  echo "Missing $FILE"
  echo "Run: cp config/env.values.template config/env.values"
  exit 1
fi

echo "Deepchq env checklist (from $FILE)"
echo "=================================="
echo ""
echo "RENDER — copy these in Dashboard → Environment:"
echo ""

while IFS= read -r line || [[ -n "$line" ]]; do
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ -z "${line// }" ]] && continue
  [[ "$line" == *"──"* ]] && continue
  if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
    key="${BASH_REMATCH[1]}"
    val="${BASH_REMATCH[2]}"
    if [[ "$key" == "ADS_BASE_URL" || "$key" == "CAPACITOR_SERVER_URL" ]]; then
      continue
    fi
    if [[ -n "${val// }" ]]; then
      echo "  [x] $key"
    else
      echo "  [ ] $key  (empty)"
    fi
  fi
done < "$FILE"

echo ""
echo "GITHUB ACTIONS — repo → Settings → Secrets:"
echo ""

if grep -q '^ADS_BASE_URL=.\+' "$FILE" 2>/dev/null; then
  echo "  [x] ADS_BASE_URL"
else
  echo "  [ ] ADS_BASE_URL  (empty)"
fi

echo ""
echo "See docs/WHERE-TO-PUT-KEYS.md"
