#!/usr/bin/env bash
# Push to github.com/divyansh9876/deepchq (no brew/gh required)
set -euo pipefail
cd "$(dirname "$0")/.."

GITHUB_USER="divyansh9876"
REPO="deepchq"

git remote set-url origin "https://github.com/${GITHUB_USER}/${REPO}.git"

echo "Remote:"
git remote -v
echo ""
echo "Pushing main to https://github.com/${GITHUB_USER}/${REPO}.git"
echo "If prompted: username = ${GITHUB_USER}, password = Personal Access Token (not account password)"
echo "Create token: https://github.com/settings/tokens/new (scope: repo)"
echo ""

git push -u origin main

echo ""
echo "Done. Open Render → New → Blueprint → connect ${REPO}"
