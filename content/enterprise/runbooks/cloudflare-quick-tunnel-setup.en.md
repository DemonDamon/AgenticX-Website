# Cloudflare Tunnel temporary demo guide (Enterprise)

> Goal: Temporarily expose local `enterprise` portal/admin to the public internet so a customer or colleague can try it, without buying a cloud server.
>
> Fits: 2–3 day demos, temporary reviews, cross-network collaboration tests.  
> Does not fit: production, a stable SLA, a fixed domain.

---

## 1. Approach (read first)

This guide uses **Cloudflare Quick Tunnel** (account optional, temporary random domain):

- Each tunnel gets an address like `https://xxxx.trycloudflare.com`.
- The address dies when the process exits; restarting gets a new address.
- For a fixed domain (for example `demo.xxx.com`), use a Named Tunnel (out of scope here).

---

## 2. Install cloudflared (macOS)

If you do not have Homebrew, install it first (skip if you already have it):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install cloudflared:

```bash
brew install cloudflared
cloudflared --version
```

Expected output looks like: `cloudflared version 2026.3.0`

---

## 3. Start local enterprise first

In the first terminal:

```bash
cd /Users/damon/myWork/AgenticX/enterprise
bash scripts/start-dev.sh
```

Local access should work:

- Portal: `http://127.0.0.1:3000`
- Admin: `http://127.0.0.1:3001/login`

Verify locally first (bypass the proxy):

```bash
curl --noproxy '*' -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000
curl --noproxy '*' -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3001/login
```

---

## 4. Start Cloudflare tunnels (important)

> A Quick Tunnel command can map only one `--url`. You cannot put two `--url` flags in one command.

### 4.1 Portal tunnel (terminal B)

```bash
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY \
  cloudflared tunnel --url http://127.0.0.1:3000
```

### 4.2 Admin tunnel (terminal C)

```bash
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY \
  cloudflared tunnel --url http://127.0.0.1:3001
```

> Why `env -u ...`: avoid the system proxy/VPN hijacking cloudflared requests and causing 500/timeouts.

---

## 5. How to get the public URLs

After each tunnel starts, the terminal shows:

```text
Your quick Tunnel has been created! Visit it at:
https://xxxxx.trycloudflare.com
```

Send the two addresses separately:

- Portal address (3000): for regular trial users
- Admin address (3001): for administrators; attach `/login` directly

Example:

- `https://aaa.trycloudflare.com` (portal)
- `https://bbb.trycloudflare.com/login` (admin)

---

## 6. Reading logs: normal vs broken

### 6.1 Safe to ignore (non-fatal)

These logs are common and usually do not affect use:

- `Cannot determine default configuration path...`
  - Quick Tunnel has no local `config.yml`.
- `Failed to fetch features, default to disable ...`
  - Feature-flag fetch failed; cloudflared continues with defaults.
- `Unable to lookup protocol percentage.`
  - Stats/policy fetch failed; usually does not affect an already-built tunnel.

### 6.2 Must handle (fatal)

- `failed to unmarshal quick Tunnel ... 500 Internal Server Error`
  - Requesting a tunnel from `trycloudflare.com` failed; this tunnel was not created.
- No `Your quick Tunnel has been created!`
  - The tunnel did not succeed.
- No `Registered tunnel connection`
  - The connection was not registered.

---

## 7. Common troubleshooting

### Q1. It opens on my machine, but other networks cannot open it

Common causes: a poor path from the other side to `trycloudflare.com`, proxy/VPN interference, or a company gateway policy.

Order of actions:

1. The other person retries after turning off proxy/VPN;
2. Switch browsers;
3. Switch to a phone hotspot;
4. You restart the tunnel, get a new address, and send it again.

### Q2. `stream canceled by remote with error code 0`

Usually the remote browser/network dropped. It does not necessarily mean your service is down.  
If the public URL still opens on your machine, the problem is usually on the visitor's network.

### Q3. `curl` gets 502, but the browser opens fine

Almost always `curl` went through the system proxy. Use:

```bash
curl --noproxy '*' -I http://127.0.0.1:3001/login
```

---

## 8. Demo tips (from real use)

1. Ten minutes before the meeting, restart these three:
   - `start-dev.sh`
   - the 3000 tunnel
   - the 3001 tunnel
2. Click both public URLs once on your own machine first.
3. When sending to a colleague, send links with the path:
   - Portal: `https://xxx.trycloudflare.com/`
   - Admin: `https://yyy.trycloudflare.com/login`
4. If the other network cannot reach it, switch to the backup immediately:
   - Use a single ngrok tunnel for the portal, and share the admin screen from your machine.

---

## 9. How to shut down

Press `Ctrl + C` in the terminal to close that tunnel.  
Once the tunnel is closed, the public URL is immediately invalid.

---

## 10. Security and boundaries

- Quick Tunnel is a temporary capability. Do not put production-sensitive data on it.
- Do not expose the admin URL to the public internet for a long time.
- For formal delivery, switch to: customer-environment deploy / cloud host + fixed domain + TLS + identity controls.

Made-with: Damon Li
