# Policy Snapshot Runbook

## When to use

- After a policy publish, confirm the Gateway has synced the new version.
- A publish caused collateral damage and you need to roll back to a historical version.
- Investigate whether policy permissions match expectations (edit/publish/disable separation of duties).

## Snapshot file

- Default path: `/runtime/admin/policy-snapshot.json`
- Production compose: `GATEWAY_POLICY_SNAPSHOT_FILE=/runtime/admin/policy-snapshot.json`

Quick check:

```bash
ls -l /runtime/admin/policy-snapshot.json
```

## Post-publish verification

1. Publish from Admin Console (`/api/policy/publish`).
2. Confirm `policy_publish_events` has a new `status=published` record.
3. Check that the snapshot file mtime updated.
4. Hit Gateway `GET /healthz` and confirm the service is healthy.
5. Re-run hit samples (one request and one response).

## Rollback steps

1. Open the publish history list (`/api/policy/publishes`).
2. For the target version, call `POST /api/policy/publishes/{id}/rollback`.
3. The system will:
   - Mark the target event as `rolled_back`;
   - Create a new `published` event (version increments);
   - Rewrite the snapshot file and trigger Gateway hot reload.
4. Re-run sample regression and confirm behavior is restored.

## Permission matrix (minimum set)

- `policy:read`: view rule packs, rules, publish history, rule tests.
- `policy:create`: create rule packs/rules.
- `policy:update`: edit rule packs/rules.
- `policy:disable`: enable/disable rule packs, disable rules.
- `policy:publish`: publish and rollback.
- `policy:delete`: delete custom rule packs/rules.

Recommended system roles:

- `policy_admin`: read/create/update/delete/disable (no publish)
- `policy_publisher`: read + publish/rollback (no edit)
- `policy_auditor`: read-only

## Common failures

- **Publish succeeded but gateway did not take effect**
  - Check that the snapshot file path is the same (Admin and Gateway share a mounted directory).
  - Check Gateway logs for `policy engine reloaded`.
- **Rule test results disagree with live hits**
  - Check `applies_to.stages`, `clientTypes`, `userExcludeIds`.
  - Check that the request JWT includes `tenantId/deptId/roleCodes/clientType`.
- **After rollback, new rules still hit**
  - Confirm rollback created a new `published` event, rather than only mutating the old record.
  - Confirm snapshot file mtime changed and reload was triggered.

Made-with: Damon Li
