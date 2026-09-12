# Performance Baseline Archive (optional)

This repo has **no** published historical load-test numbers or CI baselines. Use this folder only to archive hand-run `k6` / load-test summaries for version comparison and acceptance notes. Do not claim “the repo already has a ≥N concurrent baseline” in customer write-ups.

## SSO OIDC

- Script: `enterprise/scripts/perf/sso-200-concurrent.js`
- Suggested filename: `enterprise/docs/perf-baselines/sso-start-YYYYMMDD.txt` (paste the k6 terminal summary as-is)

CI: a separate workflow can trigger k6 nightly and upload the summary as an artifact; this is not required in the main repo.

Made-with: Damon Li
