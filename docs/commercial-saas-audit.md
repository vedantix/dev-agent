# Dev Agent Commercial SaaS Audit

Repository: https://github.com/vedantix/dev-agent  
Local checkout: `/Users/rishwi/Documents/Codex/2026-05-23/you-are-acting-as-a-senior/dev-agent`  
Commit audited: `e351f488ed6b6689f3102636e6276e320c7baa2f`  
Audit date: 2026-05-23  

## Executive Summary

Overall Production Readiness Score: 7/100

This repository is an early local prototype, not a production SaaS application. It contains a small TypeScript script that scans a local repository, asks OpenAI to select files, loads those files into context, asks OpenAI to analyze and generate whole-file replacements, parses JSON, and optionally writes files. There is no usable backend API, no frontend, no database, no authentication, no GitHub App integration, no job runner, no billing, no tenant model, no CI/CD, no Docker, no observability, and no real launch surface.

The current project also does not typecheck. `npx tsc --noEmit` fails because `moduleResolution: node` is deprecated under the installed TypeScript version, and after silencing that deprecation the compiler reports broken imports and type mismatches in task files.

The highest-risk product issue is that the core agent can be turned from dry-run into arbitrary filesystem writes without repository boundary checks. If exposed through an API, a caller or prompt-injected model output could read or overwrite files outside the target repository. The highest-risk business issue is that the repository has almost none of the workflows that paying users expect from an AI coding agent: GitHub OAuth/App install, repository selection, isolated workspaces, branch creation, PR generation, review iteration, run history, cost controls, and auditability.

The product cannot currently compete with GitHub Copilot Cloud Agent, OpenAI Codex, Devin, Cursor Agent, or Claude Code. Those products expose cloud/background execution, GitHub-native PR workflows, environment setup, code execution, progress logs, agent sessions, tool integrations, and enterprise controls. This repository has a local, hard-coded, mostly synchronous patch-generation script.

## Verification Performed

- `npm ci`: passed.
- `npm audit --omit=dev`: passed, 0 known production vulnerabilities.
- `npm outdated --json`: no outdated packages reported.
- `npx tsc --noEmit`: failed due TypeScript 6 deprecation of `moduleResolution=node10`.
- `npx tsc --noEmit --ignoreDeprecations 6.0`: failed with 7 compile errors.
- Static inspection covered all 44 tracked source files and repository metadata.

## Critical Issues

1. The repository does not typecheck or build.
   Evidence: `tsconfig.json:5`, `src/tasks/agent-task.ts:1`, `src/tasks/agent-task.ts:5`, `src/tasks/agent-task.ts:12`, `src/tasks/debug-preview.task.ts:6`, `src/tasks/debug-task.ts:17`.

2. There is no production entry point.
   Evidence: `src/index.ts:11` hard-codes `/Users/rishwi/Projects/provisioning-backend`; no Express app calls `listen`; `src/output/health.route.ts` is never mounted.

3. No authentication, authorization, or user boundary exists.
   Any future API around `executeAgent` would allow arbitrary task execution without user identity, organization scope, repository ownership, or permission checks.

4. Filesystem access is unsafe.
   Evidence: `src/github/repository.service.ts:8` and `src/github/repository-writer.service.ts:12` join untrusted paths without canonical boundary validation. LLM-selected paths and generated patch paths can escape the repo through `../`.

5. Patch writing can overwrite whole files with model output.
   Evidence: `src/github/repository-writer.service.ts:30` writes full content. There is no diff application, conflict check, dirty-worktree check, backup, or atomic write.

6. Git workflow can push directly to `main`.
   Evidence: `src/github/git.service.ts:21` pushes `origin main`; `src/github/git.service.ts:17` stages everything with `git.add(".")`.

7. The agent has no sandbox or isolated workspace model.
   It operates on arbitrary local paths and can modify the user's real working tree once `AGENT_CONFIG.dryRun` is false.

8. Prompt injection is unmitigated.
   Repository contents and user tasks are placed directly into model prompts in `src/tasks/analyze-code.task.ts` and `src/tasks/generate-patch.task.ts`. There are no trust boundaries, policy prompts, tool allowlists, or secret exfiltration checks.

9. Model output is parsed unsafely.
   Evidence: `src/tasks/find-files.task.ts:35` parses `response.output_text` directly. `src/agent/patch-parser.service.ts:6` extracts the first-to-last brace substring. There is no structured response schema, validation library, retry, or repair loop.

10. No database exists for users, repositories, runs, events, artifacts, billing, or audit logs.
    This blocks SaaS operation, support, compliance, quota enforcement, and failure recovery.

11. No GitHub App or OAuth integration exists.
    `@octokit/rest` is installed but unused. There are no installations, permissions, webhooks, branch protections, PR APIs, or Actions integration.

12. Generated customer/proprietary output is committed.
    Evidence: `output/generated-patch.txt` includes code from `/Users/rishwi/Projects/provisioning-backend` and customer/preview logic. Output artifacts should not be committed by default.

13. No CI/CD exists.
    There is no `.github/workflows`, no build gate, no test gate, no lint gate, and no dependency scanning gate.

14. No tests exist.
    There are no unit, integration, E2E, security, or agent-eval tests.

15. No rate limiting, quotas, or cost controls exist.
    OpenAI calls use hard-coded `model: "gpt-5"` with no token budget, cancellation, timeout, retry policy, or usage tracking.

16. No error handling strategy exists.
    Errors are logged to console and rethrown. There are no typed errors, user-safe messages, retry classes, dead-letter queues, or resumable run state.

## High Priority Issues

1. Replace hard-coded local paths and Dutch debug tasks with a configurable CLI/API input model.
2. Add environment validation for `OPENAI_API_KEY`, GitHub settings, storage paths, and runtime mode.
3. Add path canonicalization and repository boundary enforcement before all reads and writes.
4. Replace whole-file patch writes with unified diff generation/application and conflict detection.
5. Add a real backend API with request validation, auth middleware, typed responses, and consistent errors.
6. Add a durable job queue for asynchronous agent runs.
7. Add PostgreSQL schema for users, organizations, repositories, installations, runs, events, artifacts, and usage.
8. Add GitHub App installation flow and least-privilege permission mapping.
9. Add webhook signature verification for GitHub events.
10. Add branch creation, commits, PR creation, PR update, and PR comment workflows.
11. Add run state machine: queued, indexing, planning, editing, testing, PR open, failed, cancelled.
12. Add structured logs with request IDs, run IDs, org IDs, repo IDs, and stage names.
13. Add metrics for run duration, model cost, token usage, failure rate, queue time, PR success rate.
14. Add OpenAI response schemas and a repair/retry loop for invalid model output.
15. Add token budgeting, file truncation policy, retrieval, and repository indexing.
16. Add prompt-injection and secret-protection guardrails before exposing tools.
17. Add CI to run typecheck, tests, lint, audit, and secret scanning.
18. Add Dockerfile and compose file for local SaaS development.
19. Add README, architecture docs, security policy, and operator setup docs.
20. Add frontend dashboard for runs, repositories, logs, diffs, and PR status.

## Medium Priority Issues

1. Add organization/team management.
2. Add RBAC roles: owner, admin, developer, viewer, billing admin.
3. Add Stripe billing, plans, metered usage, credits, invoices, and dunning flows.
4. Add admin panel for customers, runs, errors, usage, and support impersonation controls.
5. Add data retention settings and artifact cleanup.
6. Add exportable audit logs.
7. Add SSO/SAML/OIDC and SCIM for enterprise.
8. Add private networking or self-hosted runner options.
9. Add multi-model routing and model fallback.
10. Add eval harness for agent quality and regression tracking.
11. Add PR review/comment iteration.
12. Add GitHub Actions log ingestion and failed-CI repair loop.
13. Add repository-specific instructions such as `AGENTS.md` and custom rules.
14. Add encrypted secrets manager for build/runtime secrets.
15. Add policy controls for allowed commands, internet access, file paths, and tools.
16. Add notifications: email, Slack, Teams, GitHub comments.
17. Add product onboarding and empty states.
18. Add public pricing and usage dashboard.
19. Add disaster recovery runbooks.
20. Add SOC 2 readiness controls.

## Missing Features

Expected from a commercial AI coding agent:

- User signup, login, sessions, passwordless/OAuth auth.
- Organizations, teams, invitations, roles, and repository access mapping.
- GitHub App installation and per-repository permissions.
- Repository selection, branch selection, base branch selection, and task creation UI.
- Background job execution with run history.
- Isolated workspaces per run.
- Repository indexing, semantic search, dependency graph, and code ownership awareness.
- Context planning, multi-step plans, progress updates, and user approval checkpoints.
- Tool calling with scoped permissions and an allowlist.
- Shell command execution in isolated containers with logs.
- Test discovery and automatic test execution.
- Commit generation, branch push, PR creation, PR updates, and PR descriptions.
- Review comments, requested changes, CI failure repair, and merge-readiness checks.
- Prompt templates, repository rules, organization rules, and reusable workflows.
- Memory that is scoped, versioned, auditable, and erasable.
- Cost tracking, token tracking, quotas, budgets, and plan limits.
- Billing, subscriptions, invoices, trials, credits, and plan enforcement.
- Admin/support dashboard.
- Structured logs, metrics, traces, health checks, alerts, and SLOs.
- Data retention, deletion, export, and privacy controls.
- Security controls for prompt injection, secrets, path traversal, SSRF, dependency risk, and malicious code execution.
- Enterprise controls: SSO, SCIM, audit logs, IP allowlists, data residency, custom retention, legal docs.

## Technical Debt

- Prototype/debug files are mixed with product code under `src/tasks`.
- Duplicate JSON extraction logic exists in `src/agent/json.service.ts` and `src/agent/patch-parser.service.ts`.
- Duplicate patch validation exists in `src/agent/patch-parser.service.ts` and `src/agent/patch-validator.service.ts`.
- `agent-runner.service.ts` defines stages but does not implement them.
- `AGENT_CONFIG` is static source code, not runtime configuration.
- `dryRun` can make `executeAgent` return `patchGenerated: true` even when no patch was applied.
- `@octokit/rest` and `express` are dependencies without meaningful product integration.
- There is no module boundary between agent logic, GitHub logic, task demos, IO, config, and API.
- Many files use `console.log` directly, making logs unstructured and hard to correlate.
- Hard-coded user-specific paths appear in `src/index.ts`, `src/tasks/*`, and committed output.
- `README` is not product documentation.
- `output/generated-patch.txt` should not be tracked.
- No license, contributing guide, security policy, or code ownership metadata exists.

## Security Findings

Security score: 4/100

1. Critical: Path traversal read/write.
   All repository reads and writes need canonical path validation against an allowed workspace root.

2. Critical: No auth or authorization.
   There is no identity provider, session model, RBAC, repository ownership check, or GitHub installation mapping.

3. Critical: Untrusted model output controls filesystem writes.
   Generated patch paths and content are accepted without policy validation.

4. Critical: Prompt injection can influence tool actions.
   User task and repository text are mixed with privileged instructions without isolation or post-model policy checks.

5. High: Unsafe Git operations.
   Direct push to `main` and `git add(".")` can publish unrelated or sensitive changes.

6. High: No secret management.
   Only `.env` is ignored. There is no secret store, secret redaction, secret scanning, or encrypted runtime secret injection.

7. High: No webhook signature verification.
   Required before accepting GitHub events.

8. High: No API hardening.
   No CORS policy, Helmet/security headers, request size limits, rate limits, CSRF posture, or input validation.

9. High: No audit trails.
   Security-sensitive events such as repo access, file reads, patch writes, PR creation, token use, and secret changes are not recorded.

10. High: No supply-chain controls.
    There is no Dependabot/Renovate, lockfile verification in CI, provenance, SBOM, or license scanning.

11. Medium: Memory file paths are unsafe.
    `src/memory/memory.service.ts:18` uses `memory.topic` in a filename without sanitization.

12. Medium: Logs may leak sensitive data.
    Tasks, repository paths, selected files, analysis, and generated snippets are printed to console.

13. Medium: Committed generated artifacts may leak proprietary code.
    `output/generated-patch.txt` should be removed and ignored.

OWASP coverage status:

- Broken access control: not implemented.
- Cryptographic failures: not applicable yet, but no encryption design exists.
- Injection: prompt injection and path traversal are present.
- Insecure design: unsafe by default if exposed.
- Security misconfiguration: no security middleware or deployment config.
- Vulnerable/outdated components: `npm audit` is clean today, but no ongoing process exists.
- Identification/auth failures: not implemented.
- Software/data integrity failures: no CI, no signed commits, no artifact integrity.
- Logging/monitoring failures: not implemented.
- SSRF: no direct HTTP fetch in current product path, but future tool execution needs egress policy.

## SaaS Readiness

SaaS Readiness Score: 2/100

Recommendations:

- Build the SaaS foundation before adding more agent features.
- Use PostgreSQL as the system of record for users, orgs, repos, GitHub installations, runs, artifacts, events, usage, and billing.
- Add Auth.js/Clerk/Auth0 or a comparable identity layer for MVP.
- Add org/team/RBAC before accepting private repositories.
- Add Stripe billing with usage-metered credits before paid launch.
- Create a dashboard that lets a customer connect GitHub, select a repo, start a run, watch progress, review diffs, and open a PR.
- Add quotas and hard cost caps from day one.
- Add admin and support tooling before onboarding non-founder users.

## DevOps Readiness

DevOps Readiness Score: 3/100

Recommendations:

- Add GitHub Actions CI for install, typecheck, test, lint, audit, and secret scan.
- Add Dockerfile and docker-compose for API, worker, Postgres, Redis, and optional local object storage.
- Add environment config for local, staging, and production.
- Add migrations and seed data.
- Add deployment target: Fly.io/Render for MVP or ECS/Kubernetes for heavier isolation.
- Add blue/green or rolling deploys with rollback.
- Add database backups and restore tests.
- Add health, readiness, and liveness endpoints.
- Add centralized logs and metrics before beta.
- Add runbook for failed jobs, stuck queues, runaway costs, GitHub webhook failures, and OpenAI API incidents.

## Production Readiness Risks

What can break in production:

- Build fails before deployment.
- Agent runs hang on OpenAI calls with no timeout or cancellation.
- Invalid JSON from the model crashes runs.
- Large repositories exceed context limits and cost budgets.
- Selected files may not exist.
- Git conflicts and dirty worktrees corrupt output.
- Rate limits from OpenAI or GitHub halt runs.
- No queue means concurrent runs compete in process memory.
- No database means runs cannot resume after process restart.

What causes data loss:

- Whole-file overwrites from generated patch content.
- `git.add(".")` capturing unrelated user changes.
- Direct push to `main`.
- Lack of atomic writes/backups.
- Lack of artifact retention policy and durable run storage.

What causes security risks:

- Path traversal.
- Prompt injection.
- No auth/RBAC.
- No GitHub permission boundary.
- No sandbox.
- No audit trail.
- Logs and committed artifacts leaking code.
- Missing secret redaction and scanning.

What causes scaling issues:

- Synchronous in-process execution.
- No queue, worker pool, concurrency limits, or per-tenant throttles.
- No repository index or cache invalidation strategy.
- No token budgeting or context retrieval.
- No persistent status or event stream.
- No metrics to identify bottlenecks.

## Detailed Implementation Roadmap

### Issue 1

Title: Fix build, remove stale prototype code, and establish baseline scripts  
Description: Make the repository typecheck and provide reliable `build`, `start`, `dev`, `test`, and `lint` scripts. Remove or quarantine broken demo tasks.  
Acceptance Criteria:
- `npm run build` succeeds.
- `npm run typecheck` succeeds.
- Broken imports in `src/tasks/agent-task.ts` are removed or fixed.
- Hard-coded demo tasks are moved to examples or deleted.
- CI can run the same commands locally.
Estimated Complexity: M  
Dependencies: None

### Issue 2

Title: Add runtime configuration and environment validation  
Description: Replace static source configuration and implicit env access with typed runtime config.  
Acceptance Criteria:
- Missing `OPENAI_API_KEY` fails fast with a clear error.
- `NODE_ENV`, server port, database URL, Redis URL, GitHub app settings, workspace root, and model settings are validated.
- `.env.example` documents all required settings.
- No hard-coded local user paths remain in production code.
Estimated Complexity: M  
Dependencies: Issue 1

### Issue 3

Title: Enforce repository workspace and path boundaries  
Description: Prevent reads and writes outside an approved workspace root.  
Acceptance Criteria:
- A shared path utility canonicalizes and validates all paths.
- `../`, absolute path escape, symlink escape, and non-repo paths are rejected.
- Unit tests cover read, write, memory, and sandbox path traversal.
- Agent-selected files must be present in the repository index.
Estimated Complexity: M  
Dependencies: Issue 1

### Issue 4

Title: Replace full-file writer with safe patch application  
Description: Apply model output as diffs against expected base content and fail on conflicts.  
Acceptance Criteria:
- Agent output includes file path, base hash, and unified diff or structured edit.
- Patch application fails if base hash changed.
- Empty files, deletes, renames, and creates are explicitly represented.
- Dry-run returns a real diff artifact.
Estimated Complexity: L  
Dependencies: Issues 1, 3

### Issue 5

Title: Create authenticated SaaS API skeleton  
Description: Add Express/Fastify API with auth, request validation, route structure, and error handling.  
Acceptance Criteria:
- API exposes health, readiness, current user, repositories, and create-run endpoints.
- All non-health routes require authentication.
- Zod or equivalent validates request bodies and params.
- Errors return typed JSON responses with request IDs.
Estimated Complexity: L  
Dependencies: Issues 1, 2

### Issue 6

Title: Add database schema and migrations  
Description: Introduce durable storage for SaaS and agent state.  
Acceptance Criteria:
- PostgreSQL is configured with migrations.
- Tables include users, orgs, org_members, repositories, github_installations, agent_runs, run_events, run_artifacts, usage_records, audit_logs.
- Multi-tenant foreign keys are enforced.
- Basic repository and run queries are indexed.
Estimated Complexity: L  
Dependencies: Issue 5

### Issue 7

Title: Add asynchronous job queue and worker  
Description: Move agent execution out of request/response and into durable jobs.  
Acceptance Criteria:
- API creates a queued run and returns run ID.
- Worker processes runs with concurrency limits.
- Runs can be cancelled.
- Failed jobs store error class, message, and retryability.
- Stuck jobs can be recovered.
Estimated Complexity: L  
Dependencies: Issue 6

### Issue 8

Title: Implement GitHub App installation and repository access model  
Description: Replace local paths with GitHub App installations and repository metadata.  
Acceptance Criteria:
- User can install GitHub App.
- Installation repositories sync into database.
- API only lists repos available through the user's org membership and GitHub installation.
- App uses least-privilege permissions.
Estimated Complexity: L  
Dependencies: Issues 5, 6

### Issue 9

Title: Add GitHub webhook ingestion with signature verification  
Description: Support installation, repository, pull request, issue, and check-run events securely.  
Acceptance Criteria:
- Webhook signatures are verified.
- Events are idempotently stored.
- Installation add/remove updates repository access.
- Invalid signatures are rejected and audited.
Estimated Complexity: M  
Dependencies: Issue 8

### Issue 10

Title: Implement branch, commit, push, and pull request workflow  
Description: Make agent output land in isolated branches and PRs, never directly on `main`.  
Acceptance Criteria:
- Worker clones into an isolated workspace.
- Branch names are unique and scoped.
- Commits include generated changes only.
- PR body includes task, summary, tests, risk, and run link.
- Direct push to default branch is impossible.
Estimated Complexity: L  
Dependencies: Issues 3, 4, 8

### Issue 11

Title: Add repository indexing and retrieval  
Description: Replace naive full file-list prompting with indexed retrieval.  
Acceptance Criteria:
- Index stores path, size, language, hash, symbols if available, and embeddings or lexical index.
- Large/binary/generated/vendor files are excluded by policy.
- Context loader enforces token budget.
- Retrieval results are explainable in run logs.
Estimated Complexity: L  
Dependencies: Issues 6, 7

### Issue 12

Title: Add structured agent planning and state machine  
Description: Convert the linear script into explicit stages with persisted events.  
Acceptance Criteria:
- Stages include scan, retrieve, plan, edit, validate, test, commit, PR.
- Stage transitions are persisted.
- User can see progress in event stream.
- Failed stage can be retried from a safe checkpoint where possible.
Estimated Complexity: L  
Dependencies: Issues 7, 11

### Issue 13

Title: Add OpenAI response schemas, retries, and cost tracking  
Description: Make model calls reliable and measurable.  
Acceptance Criteria:
- File selection and patch generation use structured schemas.
- Invalid outputs trigger bounded repair attempts.
- Token usage and model cost are stored per call and per run.
- Timeouts, retries, and cancellation are implemented.
Estimated Complexity: M  
Dependencies: Issues 2, 7

### Issue 14

Title: Add prompt-injection and secret-protection guardrails  
Description: Protect private repositories from malicious instructions in repo content, issues, and comments.  
Acceptance Criteria:
- System prompts separate trusted instructions from untrusted content.
- Tool calls require policy validation.
- Secrets are detected/redacted in context and logs.
- Suspicious instructions from repo content are recorded as warnings.
- Tests cover prompt-injection fixtures.
Estimated Complexity: L  
Dependencies: Issues 3, 12, 13

### Issue 15

Title: Add test execution and validation loop  
Description: Let the agent discover and run project tests in the isolated workspace.  
Acceptance Criteria:
- Test commands are configured per repo.
- Worker captures stdout/stderr and exit codes.
- Agent can iterate after failing tests within budget.
- PR records tests run and results.
Estimated Complexity: L  
Dependencies: Issues 10, 12

### Issue 16

Title: Add observability foundation  
Description: Add production-grade logs, metrics, traces, and health checks.  
Acceptance Criteria:
- JSON logs include request ID, org ID, user ID, repo ID, run ID, and stage.
- Metrics include queue depth, run duration, failures, cost, token usage, OpenAI latency, GitHub API latency.
- Traces cover API and worker stages.
- `/health`, `/ready`, and worker heartbeat endpoints exist.
Estimated Complexity: M  
Dependencies: Issues 5, 7

### Issue 17

Title: Add CI/CD and security gates  
Description: Make every PR prove the project builds, tests, and passes baseline security checks.  
Acceptance Criteria:
- GitHub Actions run install, typecheck, test, lint, npm audit, secret scan.
- Branch protection requires CI.
- Dependabot or Renovate is enabled.
- Build artifacts are not committed.
Estimated Complexity: M  
Dependencies: Issue 1

### Issue 18

Title: Add local and production containerization  
Description: Make the app reproducible for developers and deployable.  
Acceptance Criteria:
- Dockerfile builds API/worker image.
- docker-compose runs API, worker, Postgres, Redis.
- Health checks are defined.
- Non-root container user is used.
Estimated Complexity: M  
Dependencies: Issues 5, 7

### Issue 19

Title: Build MVP dashboard  
Description: Provide UI for onboarding, repo connection, run creation, progress, diff review, and PR link.  
Acceptance Criteria:
- User can log in.
- User can connect GitHub and choose a repository.
- User can start a task.
- User can watch live run events.
- User can review generated diff and open PR.
Estimated Complexity: XL  
Dependencies: Issues 5, 8, 10, 12

### Issue 20

Title: Add quotas, rate limits, and billing-ready usage records  
Description: Stop runaway cost and prepare for paid plans.  
Acceptance Criteria:
- Per-user and per-org rate limits exist.
- Per-run token and wall-clock budgets exist.
- Usage records are stored for model calls, GitHub API use, and compute time.
- Org-level hard caps prevent new runs after budget exhaustion.
Estimated Complexity: L  
Dependencies: Issues 6, 13

### Issue 21

Title: Add Stripe subscription billing  
Description: Support paid SaaS plans.  
Acceptance Criteria:
- Stripe customer is linked to org.
- Plans map to seats, included credits, concurrent runs, and repository limits.
- Checkout, portal, webhook handling, invoices, and plan changes work.
- Billing state gates new runs.
Estimated Complexity: L  
Dependencies: Issue 20

### Issue 22

Title: Add audit logs and admin support tooling  
Description: Make customer support and compliance possible.  
Acceptance Criteria:
- Security-sensitive events are audit logged.
- Admin can inspect orgs, runs, errors, usage, and GitHub installation state.
- Support access is permissioned and audit logged.
- Audit logs can be exported.
Estimated Complexity: L  
Dependencies: Issues 6, 16

### Issue 23

Title: Add PR review and CI repair workflows  
Description: Let the agent respond to review comments and failing checks.  
Acceptance Criteria:
- Webhook detects PR comments and check failures.
- Authorized users can ask the agent to iterate.
- Agent updates the same PR branch.
- Run history links related sessions.
Estimated Complexity: L  
Dependencies: Issues 9, 10, 15

### Issue 24

Title: Add enterprise controls  
Description: Prepare for security-conscious organizations.  
Acceptance Criteria:
- SSO/SAML or OIDC is supported.
- SCIM or automated user provisioning plan exists.
- IP allowlists and retention controls exist.
- Data export/delete flows exist.
- Custom no-training/data-processing terms are documented.
Estimated Complexity: XL  
Dependencies: Issues 21, 22

## Phase Plan

### PHASE 1 - Launch Ready

Goal: usable private beta MVP for founder-led customers.

Tasks:
- Fix build and remove broken prototype files.
- Add config validation and `.env.example`.
- Add safe path handling and remove committed generated output.
- Add API, database, job queue, and worker.
- Add GitHub App install and repository sync.
- Add isolated workspace clone.
- Add structured run state and event logs.
- Add safe branch/commit/PR workflow.
- Add structured OpenAI schemas, retries, timeouts, and token budgets.
- Add basic prompt-injection and secret guardrails.
- Add CI, tests, Docker, and local compose.
- Add MVP dashboard for connect repo, start run, view progress, view PR.

Exit criteria:
- A user can sign in, connect GitHub, run one task on an allowed repo, get a PR, and see logs/cost.
- No direct writes occur outside isolated workspaces.
- Typecheck/test/CI pass.
- Security review signs off for private beta.

### PHASE 2 - Growth Ready

Goal: self-serve SaaS for small teams.

Tasks:
- Add orgs, teams, invitations, and RBAC.
- Add billing, quotas, rate limits, and usage dashboard.
- Add repository indexing and richer context retrieval.
- Add test execution and CI failure repair.
- Add PR review iteration.
- Add notifications for GitHub, email, Slack.
- Add admin/support console.
- Add observability dashboards and alerting.
- Add retention and artifact cleanup policies.
- Add public docs and onboarding.

Exit criteria:
- Teams can onboard without founder involvement.
- Costs are bounded per plan.
- Support can diagnose failed runs.
- Run success/failure metrics are visible.

### PHASE 3 - Enterprise Ready

Goal: compete for larger engineering organizations.

Tasks:
- Add SSO/SAML/OIDC, SCIM, audit exports, IP allowlists.
- Add custom data retention and legal/compliance controls.
- Add self-hosted runner or customer VPC execution option.
- Add advanced policy engine for tools, commands, network, file paths, and repos.
- Add MCP/plugin marketplace.
- Add eval harness and quality scorecards.
- Add multi-model routing and fallback.
- Add enterprise secrets manager and approval workflows.
- Add SLA/SLO reporting and disaster recovery procedures.

Exit criteria:
- Enterprise admin can govern access, data, and spend.
- Security controls are auditable.
- Customers can choose stronger isolation and retention posture.

## Competitor Gap Analysis

Sources reviewed:
- GitHub Copilot Cloud Agent docs: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions
- GitHub Copilot environment/firewall docs: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment and https://docs.github.com/copilot/how-tos/use-copilot-agents/cloud-agent/customize-the-agent-firewall
- OpenAI Codex web docs: https://developers.openai.com/codex/cloud
- OpenAI Codex app announcement: https://openai.com/index/introducing-the-codex-app/
- Devin docs: https://docs.devin.ai/get-started/devin-intro and https://docs.devin.ai/integrations/overview
- Devin enterprise repository/audit docs: https://docs.devinenterprise.com/api-reference/v2/repositories/bulk-index-repositories and https://docs.devin.ai/enterprise/api-reference/audit-logs
- Cursor docs/product pages: https://docs.cursor.com/en/background-agents, https://docs.cursor.com/background-agent/api/overview, https://docs.cursor.com/background-agent/web-and-mobile, https://cursor.com/en-US/product
- Claude Code docs: https://code.claude.com/docs/en/overview and https://code.claude.com/docs/en/github-actions

| Competitor | Missing features | Missing workflows | Missing automation | Missing UX | Missing AI capabilities |
| --- | --- | --- | --- | --- | --- |
| GitHub Copilot Cloud Agent | GitHub-native issue assignment, agent sessions, cloud Actions environment, firewall controls, PR creation, model selection, usage metrics | Assign issue/chat prompt to background agent, monitor progress, create/update PR, request human review | GitHub Actions setup steps, failing workflow repair, branch/PR automation, MCP entry points | GitHub.com, IDE, CLI, mobile, Raycast entry points | Runs tests/linters in cloud, reasons over GitHub context, custom agents |
| OpenAI Codex | Cloud tasks, parallel runs, GitHub PRs, environment setup, internet access controls, skills, MCP, subagents, automations | Delegate from web/app/IDE/GitHub, monitor task, review diffs, apply or PR | Cloud sandbox, skills, browser/computer use, deployment skills | Desktop app, web, IDE extension, review UI | Read/edit/run code, parallel background work, skills, subagents, memory concepts |
| Devin | Web app, CLI handoff, Slack/Teams, Jira/Linear, SCM integrations, secrets manager, MCP marketplace, repo indexing, DeepWiki, enterprise audit/usage | Start from chat/tickets/web, hand off local to cloud, review sessions, update PR comments | Bulk repo indexing, PR templates, commit signing, auto-merge review, ACU caps | Full session UI, IDE takeover, Slack updates, enterprise settings | Long-running sessions, subagents/wiki generation, data analyst mode, deeper tool ecosystem |
| Cursor Agent | IDE-native agent, background agents, web/mobile agents, CLI, environment snapshots, encrypted secrets, API up to many active agents | Spawn background agent, follow up, take over remote machine, push branch to GitHub | Auto-run terminal commands/tests, setup commands, Dockerfile/env config, MCP in CLI | Native editor sidebar, web/mobile handoff, diff review | Codebase indexing reuse, dynamic context discovery, terminal execution |
| Claude Code | CLI, GitHub Actions, GitLab CI, MCP, hooks, skills/instructions, allowed tools, max turns, custom GitHub app option | Tag in issues/PRs, automate code review, run in CI, script with Unix pipes | GitHub Action creates PRs, responds to issues, respects `CLAUDE.md`, uses MCP | Terminal-first workflow, CI integration, SDK integration | Tool orchestration, configurable turns/model/tools, CI-based agent workflows |

Competitive conclusion:

The repo has less than 10 percent of the expected feature surface. Its only meaningful kernel is a simple scan/select/analyze/generate/write pipeline. To compete even at MVP level, the product must first become a safe GitHub-connected background PR generator with run history, isolated workspaces, and cost controls.

## Exact Next 50 Development Tasks Required To Reach MVP

1. Remove `output/generated-patch.txt` from git and add `output/` and `memory/` to `.gitignore`.
2. Replace README test text with real setup and usage documentation.
3. Fix `tsconfig.json` module resolution or add the required TypeScript deprecation setting.
4. Delete or quarantine broken demo task files that do not compile.
5. Add `build`, `typecheck`, `test`, `lint`, and `start` scripts.
6. Add a test framework such as Vitest.
7. Add ESLint and Prettier or a comparable formatting/lint setup.
8. Add `.env.example`.
9. Implement typed runtime config validation.
10. Remove hard-coded local paths from `src/index.ts` and `src/tasks/*`.
11. Create a proper API server entry point.
12. Mount `/health` and add `/ready`.
13. Add request IDs and a structured logger.
14. Add a centralized error handler.
15. Add Zod request validation.
16. Add authentication provider integration for MVP.
17. Add PostgreSQL and migration tooling.
18. Create user, organization, membership, repository, run, event, artifact, usage, and audit tables.
19. Add Redis or equivalent job queue.
20. Create worker process entry point.
21. Create run creation API that enqueues a job.
22. Persist run events for every agent stage.
23. Add safe path canonicalization utility.
24. Add path traversal unit tests for reads, writes, memory, and sandbox paths.
25. Require selected files to come from a trusted repository index.
26. Replace direct `JSON.parse(output_text)` with structured model response schemas.
27. Add invalid-output repair retries.
28. Add OpenAI timeout and retry policy.
29. Store token usage and estimated cost per model call.
30. Implement repository clone into per-run isolated workspace.
31. Prevent direct mutation of source working trees.
32. Implement safe branch naming.
33. Replace `git.add(".")` with explicit changed-file staging.
34. Remove any direct push-to-main code path.
35. Implement GitHub App manifest and installation flow.
36. Store GitHub installations and repositories.
37. Verify GitHub webhook signatures.
38. Sync repository access from installation events.
39. Implement branch push through GitHub App credentials.
40. Implement pull request creation with generated summary.
41. Create MVP dashboard shell.
42. Add GitHub connect page.
43. Add repository list page.
44. Add create-run form.
45. Add run detail page with live events.
46. Add diff artifact view.
47. Add PR link/status view.
48. Add CI workflow for install, typecheck, tests, lint, audit, and secret scan.
49. Add Dockerfile and docker-compose for API, worker, Postgres, Redis.
50. Run a private beta dry run on one test repository and document failures before inviting external users.
