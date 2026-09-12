# Local Development Guide

Daily Enterprise development is three commands:

```bash
cd enterprise
bash scripts/bootstrap.sh      # 首次 / 环境变更
bash scripts/start-dev.sh      # 每天开工（需已有 PG）
# 或
bash scripts/start-dev-with-infra.sh  # 连同 Docker PG/Redis
```

---

## Service URLs

| Service | URL |
|---|---|
| Portal | http://localhost:3000 |
| Admin | http://localhost:3001 |
| Gateway | http://localhost:8088/healthz |

---

## Default login

| Side | Account | Password env |
|---|---|---|
| Admin | `owner@agenticx.local` | `ADMIN_CONSOLE_LOGIN_PASSWORD` |
| Portal | `owner@agenticx.local` | `AUTH_DEV_OWNER_PASSWORD` |

`staff@agenticx.local` is **not** in the default seed; create it from the admin console.

---

## bootstrap.sh options

```bash
bash scripts/bootstrap.sh                  # local（推荐）
bash scripts/bootstrap.sh --mode=server    # 非交互，env 必须齐全
bash scripts/bootstrap.sh --reset-db       # 销毁 PG 卷重建
bash scripts/bootstrap.sh --skip-docker    # 使用外部 PG
```

What it does: preflight → `.env.local` → docker PG/Redis → migrate + seed → legacy runtime import → JWT PEM.

---

## start-dev.sh options

```bash
bash scripts/start-dev.sh
bash scripts/start-dev.sh --all          # 含 customers/*
bash scripts/start-dev.sh --ui=stream    # 纯日志，Ctrl+C 一次退出
```

- Auto-expands `AUTH_JWT_*_KEY_FILE` PEM
- `AGX_AUTO_DB_MIGRATE=1`: auto-migrate only against a localhost DB
- Ctrl+C cleans up gateway + Next child processes

---

## Connect real models

**Recommended**: Admin → Platform config → Model services → Add Provider → Probe → Save → Assign user-visible models.

**Alternative**: append `DEEPSEEK_API_KEY=sk-...` to `.env.local`

---

## OIDC SSO

1. Set `NEXT_PUBLIC_SSO_PROVIDERS` and the `SSO_*` env vars
2. See [runbooks/sso-oidc-setup.md](../runbooks/sso-oidc-setup.md)
3. Self-check: `pnpm sso:oidc-smoke`

---

## Run pnpm without the scripts

```bash
cd enterprise
set -a; source .env.local; set +a
export AUTH_JWT_PRIVATE_KEY="$(cat "$AUTH_JWT_PRIVATE_KEY_FILE")"
export AUTH_JWT_PUBLIC_KEY="$(cat "$AUTH_JWT_PUBLIC_KEY_FILE")"
pnpm install
pnpm exec turbo run dev \
  --filter=@agenticx/app-web-portal \
  --filter=@agenticx/app-admin-console
# gateway 需另开终端 go run ./apps/gateway/cmd/gateway
```

---

## Common maintenance

```bash
pnpm migrate:legacy-runtime     # JSON → PG
bash scripts/reset-dev-data.sh  # 清聊天/用量（见 scripts/README）
pnpm typecheck                  # 全 monorepo 类型检查
pnpm --filter @agenticx/app-admin-console test  # 单 app 测试
```

---

## Script details

[../scripts/README.md](../scripts/README.md)

---

## Related docs

- [troubleshooting.md](./troubleshooting.md)
- [../README.md](../README.md)
- [testing/README.md](../testing/README.md)

Made-with: Damon Li
