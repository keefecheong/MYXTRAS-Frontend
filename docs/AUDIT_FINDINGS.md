# Audit findings

## Review method and baseline

The review used the committed `main` snapshot at `840a91f`; the worktree was
clean and matched `origin/main`. Source, HTML inputs, configuration, dependency
metadata, and Git history were inspected. The backend was shallow-cloned to a
temporary directory at `2454ca7` to confirm route families and dependencies.

Commands were tested against a temporary `git archive` of the frontend so that
install/build artifacts did not modify the working tree.

Environment used for the baseline check:

- Node.js `v24.21.0`
- npm `12.0.2`
- Linux ARM64

Node 18 is the version declared by the historical GitHub Actions workflow and
has been confirmed by the project owner as the documented compatibility target.
The Node 24/ARM64 results below remain useful diagnostics, but final acceptance
must be re-run with Node 18.

## Verification results

| Check | Result | Interpretation / proposed response |
| --- | --- | --- |
| `npm ci` | Pass | After removing five verified unused direct dependencies, a clean install added 365 packages. The old dependency graph still reports deprecation/audit risk; do not apply force upgrades blindly. |
| `npm run lint:js` | Pass as the first lint stage after local install | The earlier workspace-only attempt accidentally used a system ESLint because dependencies were absent; clean-install result is authoritative. |
| `npm run lint:ls` | Pass as the second lint stage | Historical naming rules permit intentional exceptions but do not catch the HTML path casing error. |
| `npm run lint:editorconfig` | Environment-blocked | `editorconfig-checker@5.1.1` could not download an `ec-linux-arm64` binary. Re-run on the Node 18/x64 CI target; consider a narrow checker update only if necessary. |
| `npm run lint:css` | Not part of aggregate `lint` | The script exists but `npm run lint` never invokes it. Add it only after evaluating/fixing its existing baseline; do not make undocumented mass formatting changes. |
| `npm run build` | Pass after polish correction | Setup Profile directory/component/import casing is now consistent on case-sensitive filesystems. |
| Frontend automated tests | None | No frontend test script or test files are tracked. Prefer a compact manual smoke-test record for this archival pass. |

## High-priority presentation blockers

### 1. README and setup documentation

**Resolved in this polish pass:** the root README now describes the academic
context, implemented feature set, Node 18 setup, Firebase ownership boundary,
example ports, backend continuation link, scripts, validation limitations, and
the documentation set. No unavailable screenshots or demo links are implied.

### 2. Production build path casing

**Resolved in this polish pass:** the Setup Profile directory, component,
bootstrap import, and HTML entry now consistently use `SetupProfile`. A clean
production build succeeds on a case-sensitive filesystem.

### 3. Local setup is underspecified

The frontend depends on a running backend plus MongoDB, Redis, Firebase client
configuration, and backend upload/moderation integrations for the complete
experience. The backend's historical npm scripts use Windows `set VAR=value&`
syntax, which is not portable to Linux/macOS. Neither repository explains a
working startup order or optional/unavailable third-party prerequisites.

**Confirmed documentation boundary:** use Node 18 and example ports `3123`
(frontend) and `3124` (backend). The historical Firebase project is unavailable,
so users must supply their own Firebase project and public client configuration.
Frontend setup should cover only frontend installation, configuration, build,
and local startup, then link to the companion backend for all backend services
and continuation steps. No screenshots or demo recording are available; do not
use placeholders or imply otherwise.

## Cleanup inventory

### Debug and stale markers

- The baseline contained 116 `console.log`, `console.warn`, `console.error`, or
  `console.debug` calls under `src/` despite the final commit message “remove
  console.log”. The polish pass removes debug-only output and retains 19 concise
  `console.error` calls for unexpected failures.
- The `ChatInterfaceLayout.vue` TODO was removed after reusing the existing
  alert prompt for the already-implemented “no more messages” state.
- Two commented usage examples and one commented-out router mount remain as
  explanatory source comments; stale commented imports were removed.
- Numerous console calls are actual fallback error reporting, not debug noise.
  Review by behavior: remove payload dumps and tracing; retain or replace user-
  relevant error paths rather than deleting all logging mechanically.

### Naming and consistency candidates

- Announcement and Setup Profile names were normalized to their current
  `AnnouncementLayout.vue` and `SetupProfile/SetupProfile.*` forms.
- The Rollup key `adminmanageAccounts` was normalized to `adminManageAccounts`;
  the public URL remains `manageAccounts.html`.
- `bootstrap` and `bootstrap5` are both declared; code imports `bootstrap`, not
  `bootstrap5`.
- Page bootstraps mix shared `Store.js` and newly created Pinia instances. This
  may be intentional because the chat socket needs the shared instance; avoid a
  broad normalization without behavioral evidence.

Rename-only work can create noisy diffs on case-insensitive systems. Perform
tracked case-only renames carefully and validate every import.

### Dependency candidates requiring verification

Static import searches found no frontend use of `axios`, `bootstrap5`, `dotenv`,
`jsonwebtoken`, or `v-tooltip`. These five direct dependencies were removed
from `package.json` and `package-lock.json`; Fetch, Vite's `loadEnv`, and
cookie-based auth remain the implemented alternatives. Clean installation and
production build were re-run afterward.

Other dependencies have clear owners:

- Vue, Vue Router, Pinia, VueUse — UI/routing/state;
- Bootstrap — common styles and JavaScript;
- Vuetify — gachapon (and a currently ineffectual Profile Management setup);
- Firebase — reCAPTCHA/phone auth;
- Socket.IO client — chat;
- Cropper.js — profile imagery;
- Pickr and Vue CTK Date Time Picker — admin event form;
- Vue Dragscroll — feed/check-in interaction;
- lodash, uuid, and BSON ObjectId — current feature code.

### Configuration and quality tooling

- Aggregate lint omits `lint:css`.
- ESLint targets only `src/**/*.js`, not scripts inside `.vue` files or
  `vite.config.js`, so much application logic is not checked.
- EditorConfig lacks an explicit final newline and rules for CSS/Markdown/JSON.
- GitHub Actions pins `actions/setup-node@v2` and `actions/checkout@v2`.
- There is no test workflow for the frontend and the current build is not run
  in CI.

For this artifact, the proportional improvement is a build-and-lint workflow
that validates the actual source formats. It is not necessary to introduce a
large test framework.

### Configuration exposure

Vite exposes the entire loaded environment object as `process.env`. This makes
every key in the frontend `.env` potentially client-visible. The current
frontend template contains Firebase web identifiers, which are client config,
not private server credentials. The README must warn users not to place secrets
there. Do not copy backend secrets or historical credentials into frontend
documentation.

## Lower-priority observations

- The nine one-line folder README files were removed after their useful naming
  guidance was consolidated into the codebase index.
- HTML pages have titles but no description metadata; portfolio discoverability
  matters mainly on the repository README because no deployment is planned.
- `copyPublicDir: false` is purposeful for multi-page inputs but deserves a
  comment because `public/` is being used unusually.
- The backend repository metadata refers to an older `kc-np` URL while the
  active repository inspected is under `keefecheong`; the frontend README should
  use the URL supplied by the owner.
- The application has no license file, and the project owner has confirmed that
  none should be added. Do not infer a license from the backend's package
  metadata.

## Evidence-preserving policy

Avoid “cleanup” that erases the character or scope of the capstone. Keep the
implemented multi-page architecture, API contracts, UI stack, and domain
features. Every source edit should answer one of these questions:

1. Does it make setup/build verification reliable?
2. Does it remove demonstrably unused or debugging-only material?
3. Does it make the existing implementation easier to understand?
4. Does it fix an inconsistency without changing the user-visible feature set?

If not, it belongs outside this revision.
