# MYXTRAS frontend documentation workspace

This directory records the September 2026 review of the MYXTRAS frontend at
commit `840a91f` (the tip of `main` and `origin/main` when reviewed). It is both
an index of the historical capstone artifact and a plan for a deliberately
limited presentation pass.

No application source was changed during this review. The proposed work is
constrained to making the existing project understandable, reproducible, and
professionally presentable without adding production capabilities or inventing
features that the team did not build.

The project owner has confirmed Node.js 18 as the historical runtime, example
ports `3123`/`3124` for frontend/backend verification, and a frontend-only setup
boundary that links to the backend for continuation. The original Firebase
project, screenshots, and demo are unavailable; no license will be added.

## Documents

- [Codebase index](./CODEBASE_INDEX.md) — repository map, entry points,
  feature ownership, shared modules, and external boundaries.
- [Architecture](./ARCHITECTURE.md) — runtime structure, major flows, state,
  authentication, routing, and backend integration.
- [Technical decisions](./TECHNICAL_DECISIONS.md) — decisions visible in the
  implementation, their trade-offs, and how to document them honestly.
- [Audit findings](./AUDIT_FINDINGS.md) — reproducible baseline checks and a
  prioritized inventory of presentation issues.
- [Implementation plan](./IMPLEMENTATION_PLAN.md) — the proposed, reviewable
  sequence of revisions, acceptance criteria, and explicit non-goals.

## Scope and source of truth

The frontend repository is the primary audit target. The companion
[MYXTRAS backend](https://github.com/keefecheong/MYXTRAS-Backend) was inspected
at commit `2454ca7` only to confirm integration boundaries and local setup
requirements. Backend revisions are outside this plan.

The code and Git history remain the source of truth where older inline README
files are incomplete. Any implementation pass should start from the findings
here, re-run the checks, and keep each cleanup small enough to review against
the original behavior.
