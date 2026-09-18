# Presentation polish implementation plan

## Objective

Prepare the completed MYXTRAS frontend capstone as a clear, credible portfolio
artifact. Preserve the feature set and architecture at `840a91f`; prioritize
documentation, reproducible setup, small consistency fixes, and removal of
obvious development residue.

## Guardrails

- Do not add new product features or complete abandoned ideas.
- Do not claim production readiness, active deployment, or ongoing maintenance.
- Do not migrate frameworks, convert to TypeScript/Composition API, redesign
  the backend contract, or centralize all networking/state.
- Do not bulk-upgrade dependencies or run `npm audit fix --force`.
- Do not remove an apparent dependency/file until imports, runtime behavior,
  and a clean build support the decision.
- Do not include backend secrets or real private credentials in documentation.
- Keep source changes reviewable and behavior-preserving; separate documentation,
  tooling, naming, and debug cleanup into distinct commits.

## Phase 0 — reproducibility boundary (resolved)

The project owner confirmed the following constraints on 18 September 2026:

1. **Runtime:** use Node.js 18, matching the version used during historical
   development and declared by the existing GitHub Actions workflow.
2. **Firebase:** the historical Firebase project and its client configuration
   are no longer available. Anyone running the application must create and
   configure their own Firebase project.
3. **Setup boundary:** frontend instructions should stop after frontend
   installation, configuration, and build/start verification. Link to the
   companion backend for MongoDB, Redis, Sightengine, AWS, and other backend
   setup rather than duplicating those procedures here.
4. **Ports:** use frontend port `3123` and backend port `3124` for documented
   examples and any verification performed during this revision. Other
   available ports remain valid when configured consistently.
5. **Academic context:** Diploma in Cybersecurity & Digital Forensics, Ngee Ann
   Polytechnic; Capstone Project module, Semester 3.1, AY2023/2024.
6. **Portfolio media:** no demo link or screenshots are available. Do not add
   placeholder media or imply that a hosted demo exists.
7. **License:** no license will be added.

These decisions are the source of truth for the remaining phases. Phase 0 is
complete and no further owner direction is required for the documented setup
boundary.

## Phase 1 — restore deterministic validation

### 1.1 Resolve Setup Profile path casing (completed)

- Update `public/setupProfile.html` and the tracked source names so the
  `SetupProfile/SetupProfile.*` casing is consistent on case-sensitive systems.
- Search for every spelling before and after the change.
- Validate direct development navigation, the protected redirect, and build.

### 1.2 Establish the supported runtime (completed)

- Add an `.nvmrc` containing the confirmed Node major, or declare `engines.node`
  in `package.json` (one source is sufficient; both only if tooling benefits).
  The confirmed runtime is Node 18.
- Re-run `npm ci` and `npm run build` on Linux.
- Record npm audit output as a historical dependency limitation. Only take
  compatible patch/minor updates that are clearly low-risk and necessary for
  install/tool execution.

### 1.3 Make checks match the source (partially completed)

- Evaluate CSS lint and Vue-aware ESLint output separately.
- Keep `lint:css` separate: its historical stylesheet baseline includes vendor
  CSS and naming violations, so adding it to aggregate lint would create noisy
  formatting churn outside this revision.
- Keep JavaScript lint scoped to `.js` files; adding a Vue-aware ESLint stack
  would be a new toolchain surface and is not necessary for this presentation
  pass.
- Document the ARM64 EditorConfig checker limitation; the workflow remains the
  supported x64/Node 18 validation target.
- Update the GitHub workflow action majors and run lint/build in CI.

Acceptance criteria:

- clean `npm ci` succeeds on the documented environment;
- `npm run build` succeeds from a clean checkout;
- the documented aggregate check exits successfully in the supported CI
  environment; and
- no page/feature code has been redesigned.

## Phase 2 — replace the root README (completed)

Create a concise portfolio landing page with this order:

1. project name and one-sentence value proposition;
2. historical/archived status badge or callout, including AY2023/2024 and a
   statement that it is not deployed or actively maintained;
3. academic context: Diploma in Cybersecurity & Digital Forensics at Ngee Ann
   Polytechnic, Capstone Project, Semester 3.1;
4. implemented features (feed/posts, forums, profiles/social graph, chat,
   moderation/events, gamification);
5. technology stack;
6. architecture summary and link to `docs/ARCHITECTURE.md`;
7. prerequisites and verified local setup;
8. environment-variable table with “public client values only” warning;
9. companion backend link:
   `https://github.com/keefecheong/MYXTRAS-Backend`;
10. available scripts and validation status;
11. repository structure, linking `docs/CODEBASE_INDEX.md`;
12. technical decisions/limitations links;
13. team attribution where confirmed. Do not add a license section or imply an
    open-source license.

Use “historical capstone project” or “archived academic project” directly. Do
not frame it as a current service. Do not advertise unverified capabilities or
write marketing copy that obscures the academic context.

### Proposed local setup sequence

Use the confirmed Node version and example ports. The intended shape is:

```bash
git clone https://github.com/<owner>/MYXTRAS-Frontend.git
cd MYXTRAS-Frontend
npm ci
cp env_template .env
# Configure PORT=3123, APP_SERVER_URL=http://127.0.0.1:3124,
# and public client values from your own Firebase project.
npm run dev
```

Frontend setup stops at install, configuration, build, and local start. Link to
the [companion backend](https://github.com/keefecheong/MYXTRAS-Backend) for its
service and infrastructure requirements. State only that the configured backend
must be available at the chosen `APP_SERVER_URL` for integrated features; do not
duplicate or make support claims about its setup.

Acceptance criteria:

- a reader can explain what was built in under two minutes;
- every command has been executed from a clean checkout;
- the backend relationship and archival status are prominent; and
- the absence of screenshots and a hosted demo is represented honestly rather
  than filled with placeholders.

## Phase 3 — retain and refine durable documentation (completed)

The documents created during this audit can remain in `docs/`, but update them
after source revisions so file names, counts, and validation results stay true.

- Keep `CODEBASE_INDEX.md` as the maintainer/reader map.
- Keep `ARCHITECTURE.md` focused on implemented runtime flows.
- Keep `TECHNICAL_DECISIONS.md` as lightweight retrospective ADRs.
- Convert `AUDIT_FINDINGS.md` into either a completed-review record or remove
  resolved findings; do not leave a misleading active backlog.
- Keep this plan only if it is useful as historical maintenance context;
  otherwise replace it with a brief `LIMITATIONS.md` after completion.
- Consolidate or remove the nine one-line folder README files after ensuring
  their useful naming conventions live in the codebase index.

Optional diagram refinement should remain text/Mermaid stored in the repository
unless a polished visual materially improves the README.

## Phase 4 — behavior-preserving code cleanup (completed)

### 4.1 Console and stale-comment pass (completed)

The baseline contained 116 console calls. Classify and reduce them as follows:

- remove debugging payloads, progress traces, and redundant response dumps;
- replace user-relevant failure logs with the existing alert/prompt mechanism
  where a component already has access to it;
- retain `console.error` only for genuinely diagnostic, unexpected failures
  that are not otherwise surfaced, using concise non-sensitive messages;
- remove unused catch variables where appropriate; and
- resolve/remove the single chat TODO without implementing a new dialog system.

Review commented-out imports/router mounts and delete those with no documented
purpose. Do not delete explanatory comments that describe non-obvious state or
protocol behavior.

### 4.2 Naming consistency (completed)

In a dedicated rename commit:

- normalize Setup Profile directory/component/import casing;
- correct `AnnoucementLayout` to `AnnouncementLayout` and update imports;
- normalize the `adminmanageAccounts` Rollup input key; and
- run filename lint, import search, and build after case-only renames.

Do not rename public `.html` URLs unless all navigation references and the
historical URL contract are intentionally updated. Keeping existing public URLs
is the safer portfolio choice.

### 4.3 Dependency cleanup (completed)

For each candidate (`axios`, `bootstrap5`, `dotenv`, `jsonwebtoken`,
`v-tooltip`):

1. search code, configuration, HTML, and generated assumptions;
2. remove one logical group with `npm uninstall` so the lockfile stays in sync;
3. run clean install, lint, and build; and
4. smoke-test the owning feature families.

Review the ineffectual `createVuetify()` call in Profile Management separately;
do not remove Vuetify because Gachapon actively uses it.

Acceptance criteria:

- no stale TODO/debug trace remains;
- error handling is no worse than the baseline;
- manifest and lockfile agree;
- imports work on a case-sensitive filesystem; and
- existing user-visible features and API endpoints are unchanged.

## Phase 5 — focused manual verification

When backend dependencies are available, use a disposable test account and
record pass/fail/not-available for:

| Area | Minimal smoke path |
| --- | --- |
| Public/access | About, events, login, registration shell, protected redirect, admin rejection. |
| Onboarding | Registration verification, profile setup, authenticated redirect. |
| Posts | Feed/explore/profile lists; create, edit, delete, like, save, comment. |
| Forums | Landing/discovery, open forum, subscribe, create/edit thread, reactions/comments. |
| Profiles | Own/other profile, edit profile/image, follow/block, start chat. |
| Chat | Load history, send/edit/delete text, reply, attachment, typing/presence where available. |
| Reports/admin | Submit/view report, report queue/detail, representative account/event action. |
| Gamification | Mission/check-in, gachapon draw, enable/select pet. |
| Navigation | Both Explore routes, both Profile routes, browser refresh, error page. |

If external services are retired, label the relevant rows “not available” with
the missing dependency. A truthful matrix is more useful than modifying the
application to fake a demo.

## Phase 6 — final repository review

- Verify `git diff --check` and a clean generated-file state.
- Re-run clean install, lint, and build using documented commands.
- Check every README link from GitHub-style relative rendering.
- Confirm no placeholder screenshots, demo links, or badges imply unavailable
  portfolio media or a deployed service.
- Confirm `.env`, build output, and dependency directories remain ignored.
- Review commit history/diffs for accidental feature or formatting churn.
- Mark the repository archived on GitHub if the owner wants a visible
  read-only status; this is a repository-setting action, not a code change.

## Suggested commit sequence

1. `docs: document MYXTRAS architecture and cleanup plan` (this audit)
2. `fix: correct setup profile entry path`
3. `chore: restore build and lint validation`
4. `docs: add portfolio README and verified setup`
5. `refactor: remove debug output and stale comments`
6. `refactor: normalize historical naming inconsistencies`
7. `chore: remove verified unused dependencies`
8. `docs: record smoke-test status and known limitations`

Each commit should build on its own. Combining these phases would make it much
harder to distinguish presentation work from behavior change.

## Explicitly deferred work

The following may be sensible for a maintained product but conflict with this
revision's purpose:

- deployment, hosting rewrites, containers, infrastructure-as-code, monitoring,
  analytics, or production observability;
- a full automated test suite or API mocking platform;
- accessibility redesign, responsive redesign, or a new design system;
- TypeScript, Composition API, Pinia normalization, or an API client rewrite;
- authentication/session redesign, security-hardening claims, or backend schema
  changes;
- offline support, pagination redesign, retry queues, socket reconnection
  architecture, or other reliability expansion; and
- implementation of features implied only by TODOs or unfinished comments.

These are not recommendations for the portfolio cleanup and should not appear
as an alarming backlog in the public README.
