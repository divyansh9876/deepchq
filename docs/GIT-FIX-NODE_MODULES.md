# Fix: “Files Too Large” / 20,000 files in GitHub Desktop

GitHub blocks files over **100MB**. `node_modules/@next/swc-darwin-arm64/next-swc.darwin-arm64.node` is a build dependency and must **not** be committed.

## In GitHub Desktop right now

1. Click **Cancel** on the dialog (do **not** use “Commit Anyway”).
2. Open **Repository → Repository Settings** (or Preferences) and ensure you are in the project root that contains `.gitignore`.
3. In the **Changes** tab, **uncheck all** `node_modules` paths (or discard those changes).
4. You should only see app source, `docs/`, `scripts/`, etc. — typically dozens of files, not thousands.

## If `node_modules` was already staged

In Terminal, from the repo root:

```bash
git reset HEAD node_modules
git rm -r --cached node_modules 2>/dev/null || true
```

Then commit again. Only source files should appear.

## After clone / before first push

```bash
npm install
```

Dependencies are recreated locally; they are listed in `package.json` / `package-lock.json`, not stored in Git.

## Verify ignore works

```bash
git check-ignore -v node_modules/@next/swc-darwin-arm64/next-swc.darwin-arm64.node
```

Expected output mentions `.gitignore` and `node_modules`.
