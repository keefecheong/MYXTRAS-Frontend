# Technical decisions

This document describes decisions observable in the code. They are historical
architecture records, not claims that the same choices would be selected for a
new production system.

## TD-01: Multi-page Vue application

**Decision.** Use a separate HTML shell and Vue root for each major feature,
with Vue Router only where a page needs closely related subviews.

**Evidence.** `public/` contains 18 HTML inputs, each paired with a page
bootstrap; Explore and Profile Page define the only routers.

**Why it fit.** Team members could work on relatively independent pages while
still reusing Vue components. Direct `.html` navigation also kept the mental
model close to a traditional multi-page website.

**Trade-offs.** Bootstrap and plugin setup are repeated. Cross-page state uses
session storage, and production hosting would need explicit history rewrites.
The polish pass should document these characteristics, not migrate the project
to a single SPA.

## TD-02: Page-gated authentication with server authorization

**Decision.** Verify the backend cookie before mounting protected pages, while
also retaining backend authorization middleware.

**Evidence.** Protected bootstraps call `dynamicMount`; API requests send
credentials; backend route families mount authentication/admin middleware.

**Why it fit.** Users avoid seeing protected interfaces before redirect, while
the server remains the security boundary.

**Trade-offs.** Every full-page transition performs verification and frontend
route access is represented by positional booleans. Renaming those booleans or
redesigning access control would affect behavior and is not required for a
presentation cleanup.

## TD-03: Native Fetch API close to feature components

**Decision.** Perform REST calls in the page or component that owns the
interaction.

**Evidence.** Fetch calls appear throughout pages and feature components;
`axios` is declared but not imported by the frontend.

**Why it fit.** This minimized abstraction overhead and made individual
features self-contained during capstone development.

**Trade-offs.** URL creation, credential options, loading behavior, and error
handling are repeated. Introducing an API-client layer now would be a broad
refactor and would misrepresent the intended preservation scope. Removing the
unused `axios` declaration is a reasonable cleanup after verification.

## TD-04: Selective Pinia plus browser storage

**Decision.** Use Pinia for truly shared interactive state and local component
state elsewhere; use session storage for cross-page handoffs.

**Evidence.** Three domain stores exist, while `user`, `forum_id`,
`selectedChat`, and onboarding state are passed through session storage.

**Why it fit.** A multi-page client cannot rely on in-memory state across page
loads. Per-tab storage preserves a target without requiring new backend or URL
contracts.

**Trade-offs.** Navigation contracts are implicit and harder to deep-link or
test. The appropriate revision is to document the keys and clear obsolete data,
not replace the navigation model.

## TD-05: Socket.IO for chat, REST for initial/history data

**Decision.** Retrieve chats/history over REST and use Socket.IO for live
updates and presence-oriented interactions.

**Evidence.** `Chat.vue` fetches chat/message collections; `chatSocket.js` and
`ChatInterfaceLayout.vue` subscribe/emit chat socket events.

**Why it fit.** REST supplies deterministic initialization while sockets avoid
polling for real-time interaction.

**Trade-offs.** Socket lifecycle and store initialization must stay aligned,
and attachment chunking adds UI/error complexity. Cleanup should remove debug
prints and document the flow without expanding reliability semantics.

## TD-06: Firebase client verification alongside backend accounts

**Decision.** Initialize Firebase on login/registration for reCAPTCHA and phone
verification, while the Express backend owns application accounts and cookies.

**Evidence.** Firebase v8 is initialized in both public entry bootstraps; user
registration/login endpoints remain on the companion backend.

**Why it fit.** It provided managed verification UI without moving the entire
domain identity model out of the capstone backend.

**Trade-offs.** Local setup requires a valid Firebase project/configuration and
the older namespaced SDK. An SDK migration would add risk without improving the
historical presentation.

## TD-07: Environment compatibility over configuration modernization

**Decision.** Preserve the original unprefixed variable names by loading all
variables into a `process.env` definition.

**Evidence.** `vite.config.js` calls `loadEnv` with an empty prefix, then maps
the result to `process.env`.

**Why it fit.** Browser modules could retain familiar Node-style reads while
the project moved to Vite.

**Trade-offs.** Any value in `.env` can be embedded in the client bundle. The
README must explicitly say the frontend environment contains public client
configuration only. Adopting `VITE_` names would be cleaner for a maintained
application, but is not necessary for this artifact.

## TD-08: Presentation-preserving maintenance policy

**Decision.** Limit the revision to documentation, build/lint restoration,
dead/debug cleanup, and demonstrably behavior-preserving consistency fixes.

**Rationale.** This repository records a completed polytechnic capstone. Its
value is the implemented feature breadth and team engineering decisions, not a
claim of current production readiness.

**Consequences.** The revision will not add tests solely to inflate coverage,
rewrite to TypeScript/Composition API, centralize all services, upgrade every
dependency, add deployment infrastructure, or implement unbuilt TODO features.
Known operational dependencies and limitations should be stated plainly.
