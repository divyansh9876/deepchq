# Push to GitHub without Homebrew or `gh`

## Step 1 — Create an empty repo on GitHub

1. Open [https://github.com/new](https://github.com/new)
2. **Repository name:** `deepchq`
3. Leave **Public** selected (or Private if you prefer)
4. **Do not** check “Add a README”, `.gitignore`, or license
5. Click **Create repository**

GitHub shows commands — use the ones below instead (your project already has commits).

## Step 2 — Connect and push from your Mac

Replace `YOUR_USERNAME` with your GitHub username (profile URL: `github.com/YOUR_USERNAME`).

```bash
cd ~/Projects/deepsearch

git remote add origin https://github.com/YOUR_USERNAME/deepchq.git

git branch -M main
git push -u origin main
```

If you see `remote origin already exists`:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/deepchq.git
git push -u origin main
```

## Step 3 — Sign in when Git asks

GitHub no longer accepts account passwords for `git push`. Use one of these:

### A) Personal Access Token (easiest with HTTPS)

1. [Create a token](https://github.com/settings/tokens/new) — scope: **repo**
2. When `git push` asks for **password**, paste the token (username = your GitHub username)

### B) SSH (no token on each push)

```bash
# Generate key (press Enter for defaults)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key to clipboard
pbcopy < ~/.ssh/id_ed25519.pub
```

Add the key at [github.com/settings/keys](https://github.com/settings/keys), then:

```bash
cd ~/Projects/deepsearch
git remote set-url origin git@github.com:YOUR_USERNAME/deepchq.git
git push -u origin main
```

## Step 4 — Deploy on Render

1. [dashboard.render.com](https://dashboard.render.com/) → **New** → **Blueprint**
2. Connect GitHub → select **deepchq**
3. After deploy, set `NEXT_PUBLIC_APP_URL` to `https://<your-service>.onrender.com` → **Redeploy**

See [RENDER.md](./RENDER.md).
