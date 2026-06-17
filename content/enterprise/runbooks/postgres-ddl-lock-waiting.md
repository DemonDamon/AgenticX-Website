# PostgreSQL `CREATE TABLE waiting` 进程堆积排查 Runbook

## 适用场景

在测试 / POC 服务上，通过 `ps`、`top` 或 `htop` 看到大量类似进程：

```text
postgres: <db_user> <database> <client_ip>(<port>) CREATE TABLE waiting
```

这不是应用自己起了一堆同名进程，而是 PostgreSQL 为客户端连接派生的后端连接进程。`CREATE TABLE waiting` 表示该连接正在执行建表或迁移类 SQL，但正在等待数据库锁。

## 快速判断

优先判断是否存在这些情况：

- 多个应用副本启动时都执行了 `db:migrate`。
- 把 `bootstrap.sh` 配成了长期服务启动命令。
- CI、部署脚本或守护进程失败后反复重试迁移。
- 上一次迁移卡在事务里，后续迁移连接排队等待锁。
- 只删除了 Docker 镜像，但 Postgres 数据卷里的旧库仍在。

## 先恢复数据库可登录

如果 `psql` 报：

```text
FATAL: sorry, too many clients already
```

先停止继续制造新连接的应用侧进程：

```bash
docker compose stop web-portal admin-console gateway-a gateway-b
# 或停止实际部署中的 systemd / Kubernetes / Docker 服务
```

测试环境如果数据库已经被连接打满，且确认可短暂中断，可重启 Postgres 后再登录：

```bash
sudo systemctl restart postgresql
# 或容器部署：
docker restart agenticx-postgres-dev
```

## 查询当前等待与阻塞

登录 PostgreSQL 后执行：

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

再看阻塞源：

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

如果第二条 SQL 返回 `0 rows`，说明当前没有锁阻塞关系；如果第一条 SQL 只看到当前 `psql` 的查询本身，说明现场已经恢复，只能做事后溯源。

## 确认客户端来源

PostgreSQL 进程名里的 `<client_ip>(<port>)` 是数据库看到的客户端来源地址，不代表供应商云端地址。它可能是应用服务器、NAT 出口、云主机 EIP、Kubernetes 节点、堡垒机或 Docker 宿主机。

查看连接分布：

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

在应用部署机上查迁移或初始化命令：

```bash
ps aux | egrep 'db:migrate|drizzle|bootstrap|start-dev|pnpm|node' | grep -v grep
```

查 PostgreSQL 日志：

```bash
grep -E 'too many clients|CREATE TABLE|connection authorized|disconnection' /var/log/postgresql/*.log
```

## 现场止血

1. 先停应用侧重复启动 / 重试源，避免继续创建连接。
2. 查询阻塞源 pid，确认是否是长事务或异常迁移。
3. 确认可中断后，由 DBA 终止阻塞源：

   ```sql
   SELECT pg_terminate_backend(<blocker_pid>);
   ```

4. 如果只是重复等待中的迁移连接，可终止等待连接：

   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE query ILIKE '%CREATE TABLE%'
     AND wait_event_type = 'Lock'
     AND pid <> pg_backend_pid();
   ```

5. 只保留一个迁移执行者，重新执行：

   ```bash
   cd enterprise
   pnpm --filter @agenticx/db-schema db:migrate
   ```

## AgenticX Enterprise 部署注意事项

- `scripts/bootstrap.sh` 是初始化脚本，会执行 `db:migrate`、`db:seed` 和 `migrate:legacy-runtime`。
- `scripts/start-dev.sh` 是本地开发脚本，本地库场景会自动跑迁移。
- 生产 / 客户测试环境应把迁移作为单独发布步骤执行一次，不要让多个应用副本启动时同时跑迁移。
- 测试环境重建时，删除镜像不等于清库；要删除本地 Postgres 数据卷，请使用：

  ```bash
  cd enterprise
  bash scripts/bootstrap.sh --reset-db
  ```

## 客户现场回传清单

请一次性回传：

1. 上述两段 `pg_stat_activity` SQL 输出。
2. `docker ps` 输出。
3. `tail -n 120 .runtime/logs/bootstrap-*.log`。
4. `tail -n 120 .runtime/logs/db-migrate-*.log`。
5. `docker logs --tail=120 agenticx-postgres-dev`。
6. 当前应用启动命令 / systemd / docker compose / Kubernetes manifest。

