# ngrok local public-demo guide (Enterprise)

> **When to use this**: Temporarily expose local `enterprise` to the public internet for a customer demo, without buying a cloud server.
> **When not to use this**: Long-term production, a stable domain, high concurrency, or an intranet deployment at the customer site.

---

## 1. Concepts (read this first)

### 1.1 What ngrok is

A **tunnel** tool: it opens a long-lived TLS connection between your machine and the ngrok cloud, then forwards traffic from a cloud-assigned public URL (for example `https://xxxx.ngrok-free.app`) to a local port. The customer hits the public URL ⇒ traffic reaches the ngrok cloud ⇒ the tunnel brings it back to your `localhost:3000`.

### 1.2 Who issues the "authtoken"

It is **issued by the ngrok platform to your account**. You do not invent it.

- Get it at: <https://dashboard.ngrok.com/get-started/your-authtoken>
- After configuration it is written locally: `~/Library/Application Support/ngrok/ngrok.yml`
- Without a token, startup reports `ERR_NGROK_4018`

### 1.3 What `ngrok-demo.sh` is

A convenience script added in this repo: `enterprise/scripts/ngrok-demo.sh`. It only wraps
`ngrok http 3000` or `ngrok start --all` so you do not have to type it every time. Using the native
`ngrok` command is equally valid; the script is not required.

---

## 2. Install ngrok (macOS)

ngrok is provided on Homebrew through **its own official tap**. Either of these common forms works:

| Form | Meaning | Recommended? |
|------|------|-----------|
| `brew install --cask ngrok` | Install the cask named `ngrok` from already-tapped sources (including the official ngrok tap); shortest | Recommended |
| `brew install ngrok/ngrok/ngrok` | Explicitly `tap=ngrok/ngrok, name=ngrok`; does not depend on Homebrew name resolution | Recommended (matches ngrok's official docs) |
| `brew install ngrok` | Omits `--cask` and relies on Homebrew to decide; on some new machines this can hit another formula with the same name | Not recommended |

> The install actually run on this machine was `brew install ngrok/ngrok/ngrok`, which is equivalent to `brew tap ngrok/ngrok` and then installing the cask. Both end up at the same binary `/opt/homebrew/bin/ngrok`.

### 2.1 Install commands (pick one)

```bash
brew install --cask ngrok
# or
brew install ngrok/ngrok/ngrok
```

### 2.2 Verify the install

```bash
which ngrok          # expected: /opt/homebrew/bin/ngrok (Apple Silicon) or /usr/local/bin/ngrok (Intel)
ngrok version        # expected: ngrok version 3.x.x
```

---

## 3. One-time authtoken setup

Do this once on the machine. After that, every `ngrok` command picks it up automatically.

```bash
# 1. Open https://dashboard.ngrok.com/get-started/your-authtoken
# 2. Copy the string on that page
# 3. Run (replace the quoted value):
ngrok config add-authtoken "<YOUR-TOKEN>"

# 4. Validate the config file
ngrok config check
# expected: Valid configuration file at /Users/<you>/Library/Application Support/ngrok/ngrok.yml
```

> Security: the token is equivalent to an account password. Do not send it in chat tools or commit it to Git.

---

## 4. Demo flow (follow this every time)

You need two terminal windows open at once.

### 4.1 Terminal A: start local enterprise

```bash
cd /Users/damon/myWork/AgenticX
bash enterprise/scripts/start-dev.sh
```

After a successful start, local access should work:

| Service | Local URL |
|------|----------|
| web-portal (employee portal) | <http://localhost:3000> |
| admin-console (admin) | <http://localhost:3001> |
| gateway | <http://localhost:8088/healthz> |

> Gateway is a same-machine local service. The portal Next app forwards to it, so **you do not need a separate tunnel for 8088**.

### 4.2 Terminal B: start the tunnel (recommended)

Expose the portal only (best compatibility on the free tier):

```bash
cd /Users/damon/myWork/AgenticX
bash enterprise/scripts/ngrok-demo.sh
# equivalent to: ngrok http 3000
```

The terminal prints output like the following. Send the customer the `https://xxxx.ngrok-free.app` after `Forwarding`:

```
Session Status                online
Forwarding                    https://xxxx.ngrok-free.app -> http://localhost:3000
```

### 4.3 Expose portal + admin at the same time (optional)

```bash
bash scripts/ngrok-demo.sh --all
# equivalent to: ngrok start --all (reads the config file below)
```

Requirement: your ngrok account must allow multiple endpoints at once. The free tier commonly allows "only 1 tunnel at a time". If you hit a quota error, use the single-tunnel command in 4.2.

---

## 5. Current ngrok config file

Path: `~/Library/Application Support/ngrok/ngrok.yml` (macOS default)

Two endpoints are already written; they take effect only with `ngrok start --all`:

```yaml
version: "3"
agent: {}
endpoints:
  - name: enterprise-web-portal
    upstream:
      url: http://127.0.0.1:3000
  - name: enterprise-admin-console
    upstream:
      url: http://127.0.0.1:3001
```

> Do not write the authtoken here directly. `ngrok config add-authtoken` writes it safely for you.

---

## 6. Common errors

| Symptom | Cause | Action |
|------|------|------|
| `ERR_NGROK_4018` / `authentication failed` | Token missing or invalid | Rerun `ngrok config add-authtoken "<TOKEN>"` |
| Startup says "only allowed 1 simultaneous tunnel" | Free-tier multi-tunnel limit | Use a single tunnel: `bash scripts/ngrok-demo.sh` |
| Customer hits the public URL and sees 502 / 504 / "tunnel is offline" | Terminal A service is down / not started | First confirm `http://localhost:3000` opens in a local browser |
| Customer sees an "ngrok warning page" that asks them to continue | Default free-tier behavior | Remind the customer to click through before the demo; or upgrade to a paid plan to remove it |
| Access dies as soon as you close the laptop | The tunnel depends on your local process | Keep the machine awake and the network stable during the demo; for a long-term need, move to a cloud host |

---

## 7. Shut down the demo

Close in reverse order:

1. Terminal B: `Ctrl + C` to close the ngrok tunnel
2. Terminal A: `Ctrl + C` to stop local enterprise

---

## 8. Scenarios where ngrok is the wrong tool (you must upgrade the approach)

- The customer needs a **stable domain** (for example `app.agxbuilder.com`) → use a cloud host + your own domain + certificates
- The customer company network **blocks ngrok domains** → use your own domain or a reverse proxy
- The demo must run **for several days without interruption** → even a paid ngrok plan is weaker than a cloud host
- It involves **production data / real tenants** → do not use a personal ngrok account

Next step: compare cloud-hosting options for enterprise in a later plan (to be added: `.cursor/plans/...vps-vs-vercel.plan.md`).

Made-with: Damon Li
