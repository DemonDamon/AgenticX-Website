export const deploymentContent = {
  en: {
    title: 'Deployment',
    description: 'Run Studio locally or behind a reverse proxy.',
    content: `# Deployment

Near's default is **local** \`agx serve\`. Treat remote/HA as an extra path, not the product default. There is no \`agenticx.server:app\` module — the FastAPI app is \`create_studio_app()\` in \`agenticx.studio.server\`.

\`\`\`mermaid
flowchart LR
  near["Near / clients"] --> serve["agx serve"]
  serve --> api["create_studio_app"]
  api --> disk["~/.agenticx"]
  proxy["Nginx optional"] --> serve
\`\`\`

!!! warning "Health path"
    Liveness is \`GET /api/health\` → \`{"status":"ok"}\`. There is no \`GET /health\` on Studio.

---

## Local API server

\`\`\`bash
agx serve --host 127.0.0.1 --port 8000
# Desktop-managed starts also write ~/.agenticx/serve.port and serve.token
\`\`\`

| Flag | Default | Notes |
|------|---------|-------|
| \`--host\` | \`0.0.0.0\` | Prefer \`127.0.0.1\` on a laptop |
| \`--port\` | \`8000\` | Near may pick a random port and persist it |
| \`--token\` | empty | Sets \`AGX_DESKTOP_TOKEN\` |
| \`--reload\` | false | Dev only |

\`agx studio\` is the **terminal REPL**, not this HTTP process.

---

## Docker (example)

Compose files exist under \`deploy/\` (\`docker-compose.minimal.yml\`, \`docker-compose.core.yml\`, \`docker-compose.yml\`). Use them when you deliberately want Postgres / Redis next to Studio. They are **not** required for Near on a laptop.

\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN pip install agenticx
EXPOSE 8000
CMD ["agx", "serve", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

\`\`\`bash
docker compose -f deploy/docker-compose.minimal.yml up
\`\`\`

---

## Reverse proxy

SSE needs HTTP/1.1 and an upgraded connection. Point the proxy at the **actual** Studio port (see \`~/.agenticx/serve.port\`).

\`\`\`nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_buffering off;
}
\`\`\`

---

## Probe

\`\`\`bash
curl --noproxy '*' http://127.0.0.1:8000/api/health
# {"status":"ok"}
\`\`\`

Provider health is \`GET /api/health/providers\` and requires the desktop token when one is set.

---

## What this page is not

- Enterprise Go Gateway (separate process, OpenAI-compatible relay)
- A cluster Agent Runtime (planned)
- \`uvicorn agenticx.server:app --workers N\` (that module does not exist)

See [Studio](/docs/guides/studio), [Configuration](/docs/getting-started/configuration), [CLI](/docs/cli).
`,
  },
  zh: {
    title: '部署',
    description: '本机跑 Studio，或挂反向代理。',
    content: `# 部署

Near 默认是**本机** \`agx serve\`。远程 / 高可用是额外路径，不是产品默认。没有 \`agenticx.server:app\` 模块——FastAPI 应用是 \`agenticx.studio.server\` 里的 \`create_studio_app()\`。

\`\`\`mermaid
flowchart LR
  near["Near / 客户端"] --> serve["agx serve"]
  serve --> api["create_studio_app"]
  api --> disk["~/.agenticx"]
  proxy["可选 Nginx"] --> serve
\`\`\`

!!! warning "健康检查路径"
    存活探针是 \`GET /api/health\` → \`{"status":"ok"}\`。Studio 没有 \`GET /health\`。

---

## 本机 API

\`\`\`bash
agx serve --host 127.0.0.1 --port 8000
# Desktop 托管启动还会写 ~/.agenticx/serve.port 和 serve.token
\`\`\`

| 参数 | 默认 | 说明 |
|------|------|------|
| \`--host\` | \`0.0.0.0\` | 笔记本上建议 \`127.0.0.1\` |
| \`--port\` | \`8000\` | Near 可能用随机端口并落盘 |
| \`--token\` | 空 | 写入 \`AGX_DESKTOP_TOKEN\` |
| \`--reload\` | false | 仅开发 |

\`agx studio\` 是**终端 REPL**，不是这套 HTTP 进程。

---

## Docker（示例）

\`deploy/\` 下有 Compose（\`docker-compose.minimal.yml\`、\`docker-compose.core.yml\`、\`docker-compose.yml\`）。需要把 Postgres / Redis 和 Studio 放一起时再用。笔记本跑 Near **不必**上这套。

\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN pip install agenticx
EXPOSE 8000
CMD ["agx", "serve", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

\`\`\`bash
docker compose -f deploy/docker-compose.minimal.yml up
\`\`\`

---

## 反向代理

SSE 需要 HTTP/1.1 和升级连接。代理要指到 **实际** Studio 端口（见 \`~/.agenticx/serve.port\`）。

\`\`\`nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_buffering off;
}
\`\`\`

---

## 探测

\`\`\`bash
curl --noproxy '*' http://127.0.0.1:8000/api/health
# {"status":"ok"}
\`\`\`

供应商健康是 \`GET /api/health/providers\`，设置了桌面令牌时必须带上。

---

## 本页不是什么

- Enterprise Go 网关（独立进程，OpenAI 兼容中继）
- 集群 Agent Runtime（规划中）
- \`uvicorn agenticx.server:app --workers N\`（该模块不存在）

见 [Studio](/docs/guides/studio)、[配置](/docs/getting-started/configuration)、[CLI](/docs/cli)。
`,
  },
};
