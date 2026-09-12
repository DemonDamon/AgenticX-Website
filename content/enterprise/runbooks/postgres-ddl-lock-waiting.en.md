# PostgreSQL `CREATE TABLE waiting` process pile-up runbook

## When this applies

On a test / POC host, `ps`, `top`, or `htop` shows many processes like:

```text
postgres: <db_user> <database> <client_ip>(<port>) CREATE TABLE waiting
```

The application did not spawn a pile of processes with that name. These are backend connection processes PostgreSQL forks for client connections. `CREATE TABLE waiting` means that connection is running table-creation or migration SQL and is waiting on a database lock.

## Quick judgment

Check these first:

- Multiple application replicas all ran `db:migrate` on startup.
- `bootstrap.sh` was configured as a long-running service start command.
- CI, deploy scripts, or a supervisor retried migration after a failure.
- A previous migration is stuck in a transaction, so later migration connections queue for the lock.
- Only the Docker image was deleted; the old database is still in the Postgres data volume.

## Restore the ability to log in first

If `psql` reports:

```text
FATAL: sorry, too many clients already
```

stop the application-side processes that keep opening new connections:

```bash
docker compose stop web-portal admin-console gateway-a gateway-b
# or stop the systemd / Kubernetes / Docker services in the actual deployment
```

In a test environment, if the database is already saturated and a short outage is acceptable, restart Postgres and then log in:

```bash
sudo systemctl restart postgresql
# or, for a container deploy:
docker restart agenticx-postgres-dev
```

## Query current waits and blockers

After logging into PostgreSQL, run:

```sql
SELECT
  pid,
  usename,
  datname,
  client_addr,
  application_name,
  state,
  wait_event_type,
  wait_event,
  now() - backend_start AS backend_age,
  now() - query_start AS query_age,
  pg_blocking_pids(pid) AS blocking_pids,
  left(query, 500) AS query
FROM pg_stat_activity
WHERE query ILIKE '%CREATE TABLE%'
   OR wait_event_type = 'Lock'
ORDER BY query_start NULLS LAST;
```

Then inspect the blocking source:

```sql
WITH blocked AS (
  SELECT
    pid AS blocked_pid,
    unnest(pg_blocking_pids(pid)) AS blocker_pid
  FROM pg_stat_activity
  WHERE cardinality(pg_blocking_pids(pid)) > 0
)
SELECT
  blocked.blocked_pid,
  blocker.pid AS blocker_pid,
  blocker.usename,
  blocker.datname,
  blocker.client_addr,
  blocker.application_name,
  blocker.state,
  blocker.wait_event_type,
  blocker.wait_event,
  now() - blocker.query_start AS blocker_query_age,
  left(blocker.query, 800) AS blocker_query
FROM blocked
JOIN pg_stat_activity blocker ON blocker.pid = blocked.blocker_pid
ORDER BY blocker.query_start NULLS LAST;
```

If the second SQL returns `0 rows`, there is currently no lock-blocking relationship. If the first SQL only shows the current `psql` query itself, the incident has already recovered and you can only do after-the-fact tracing.

## Confirm the client origin

The `<client_ip>(<port>)` in the PostgreSQL process name is the client source address as the database sees it. It is not a vendor cloud address. It may be an application server, a NAT egress, a cloud-host EIP, a Kubernetes node, a bastion, or the Docker host.

See the connection distribution:

```sql
SELECT
  client_addr,
  usename,
  datname,
  application_name,
  state,
  count(*) AS connections
FROM pg_stat_activity
GROUP BY client_addr, usename, datname, application_name, state
ORDER BY connections DESC;
```

On the application host, look for migration or init commands:

```bash
ps aux | egrep 'db:migrate|drizzle|bootstrap|start-dev|pnpm|node' | grep -v grep
```

Check PostgreSQL logs:

```bash
grep -E 'too many clients|CREATE TABLE|connection authorized|disconnection' /var/log/postgresql/*.log
```

## Stop the bleeding on site

1. Stop the application-side restart / retry source first so it does not keep opening connections.
2. Query the blocker pid and confirm whether it is a long transaction or a stuck migration.
3. After confirming it is safe to interrupt, have a DBA terminate the blocker:

   ```sql
   SELECT pg_terminate_backend(<blocker_pid>);
   ```

4. If they are only duplicate migration connections waiting on the lock, terminate the waiters:

   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE query ILIKE '%CREATE TABLE%'
     AND wait_event_type = 'Lock'
     AND pid <> pg_backend_pid();
   ```

5. Keep a single migration runner and rerun:

   ```bash
   cd enterprise
   pnpm --filter @agenticx/db-schema db:migrate
   ```

## AgenticX Enterprise deployment notes

- `scripts/bootstrap.sh` is an initialization script. It runs `db:migrate`, `db:seed`, and `migrate:legacy-runtime`.
- `scripts/start-dev.sh` is a local development script. On a local database it also runs migrations automatically.
- In production / Enterprise delivery test environments, run migration once as a separate release step. Do not let multiple application replicas migrate at the same time on startup.
- When rebuilding a test environment, deleting the image is not wiping the database. To delete the local Postgres data volume, use:

  ```bash
  cd enterprise
  bash scripts/bootstrap.sh --reset-db
  ```

## Customer-site report-back checklist

Please send all of the following in one batch:

1. Output of the two `pg_stat_activity` SQL statements above.
2. `docker ps` output.
3. `tail -n 120 .runtime/logs/bootstrap-*.log`.
4. `tail -n 120 .runtime/logs/db-migrate-*.log`.
5. `docker logs --tail=120 agenticx-postgres-dev`.
6. The current application start command / systemd / docker compose / Kubernetes manifest.

Made-with: Damon Li
