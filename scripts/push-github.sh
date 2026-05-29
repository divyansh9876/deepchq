#!/usr/bin/env bash
# Create GitHub repo and push (requires GitHub CLI: brew install gh && gh auth login)
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_NAME="${1:-deepchq}"
VISIBILITY="${2:-public}" # public | private

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI: brew install gh"
  echo "Then: gh auth login"
  exit 1
fi

if ! git rev-parse HEAD >/dev/null 2>&1; then
  git add .
  git commit -m "Initial Deepchq release"
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote origin already exists:"
  git remote -v
  git push -u origin main
else
  gh repo create "$REPO_NAME" --"$VISIBILITY" --source=. --remote=origin --push
fi

echo ""
echo "Repo ready. Deploy on Render:"
echo "  https://dashboard.render.com/ → New → Blueprint → select $REPO_NAME"
