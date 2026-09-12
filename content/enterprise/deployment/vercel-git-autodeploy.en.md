# Vercel Git autodeploy and Ignored Build Step

> Applies to the two independent projects `agxbuilder-admin-console` and `agxbuilder-web-portal`. Repository root: `DemonDamon/AgenticX`.

## 1. Connect Git (required)

In each Vercel Project → **Settings → Git**:

1. **Connect Git Repository** → select `DemonDamon/AgenticX`
2. **Production Branch** = `main`
3. Confirm **Pause Deployments** is not enabled

After a successful connection, a push to `main` should show a **Vercel** check/deployment on the GitHub commit (if that is missing, Git is not connected).

## 2. Root Directory / Build (same as the checklist)

| Project | Root Directory | Build Command |
| --- | --- | --- |
| admin-console | `enterprise/apps/admin-console` | `cd ../.. && pnpm exec turbo run build --filter=@agenticx/app-admin-console` |
| web-portal | `enterprise/apps/web-portal` | `cd ../.. && pnpm exec turbo run build --filter=@agenticx/app-web-portal` |

Install / Build (both apps, **must** use `npx pnpm@9.12.0`; Vercel's default `pnpm` is 6.x and will override `npm i -g`):

```bash
# install
cd ../.. && npx --yes pnpm@9.12.0 install --no-frozen-lockfile

# build
cd ../.. && npx --yes pnpm@9.12.0 exec turbo run build --filter=@agenticx/app-admin-console
```

Why `--no-frozen-lockfile`: `enterprise/pnpm-lock.yaml` is listed in `enterprise/.gitignore`, so a Git clone has no lockfile.

Each app directory already pins the commands above in `vercel.json`. Commit and push them so the Dashboard does not keep showing the old `cd ../.. && pnpm install` that triggers the pnpm 6 error.

## 3. Ignored Build Step (recommended for the monorepo)

In **Settings → Git → Ignored Build Step**, paste the script below.  
Use the matching line for **admin-console** and **web-portal** (set `APP_ROOT` to that app's root).

```bash
# Build only when this commit touches this app or a shared package; skip this Project for other directories (e.g. desktop/).
APP_ROOT="enterprise/apps/admin-console"   # for web-portal, use enterprise/apps/web-portal

if [ "$VERCEL_GIT_COMMIT_REF" != "main" ] && [ "$VERCEL_ENV" = "production" ]; then
  # Preview: still build (change to exit 0 if you want to skip non-main preview)
  :
fi

git diff --name-only "${VERCEL_GIT_PREVIOUS_SHA:-HEAD~1}" "$VERCEL_GIT_COMMIT_SHA" 2>/dev/null | while read -r f; do
  case "$f" in
    ${APP_ROOT}/*|enterprise/packages/*|enterprise/features/*|enterprise/pnpm-lock.yaml|enterprise/package.json|enterprise/turbo.json)
      exit 1
      ;;
  esac
done
exit 0
```

Notes:

- Script **exit 1** = build required, **exit 0** = skip.
- Changes under `enterprise/packages/*` or `enterprise/features/*` trigger both apps (correct for workspace dependencies).
- Channel-related changes live under `enterprise/apps/admin-console/` and **must** trigger an admin-console build.

## 4. Manually publish the latest main (fallback when Git is not connected)

**Deployments → Create Deployment** → Branch `main` → pick the latest commit (for example `e652e91`).

Do not click **Redeploy** on an old deployment (it will keep an old SHA such as `95e2add`).

## 5. Acceptance

| Check | Expected |
| --- | --- |
| Production `gitCommitSha` | ≥ `27166b0` (includes Channel) |
| Trigger source | Git push, not only a `cursor-cli` redeploy |
| Admin sidebar | "Channel management" is visible |
| URL | `/admin/channels` is not 404 |

Made-with: Damon Li
