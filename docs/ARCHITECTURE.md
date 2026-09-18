# Architecture

## Overview

MYXTRAS is a browser client for a student community platform. The implemented
feature set combines a social post feed, forums and threads, profiles and social
connections, real-time chat, events, reporting/moderation, and a lightweight
check-in/gachapon system.

The frontend is not a conventional single-page application. Vite builds 18
HTML inputs. Each input loads a small JavaScript bootstrap, which creates one
Vue application and mounts a page root. Two page roots then use Vue Router for
local sub-navigation.

```text
Browser request
  │
  ├─ public/<page>.html
  │    └─ src/pages/<Page>/<Page>.js
  │         ├─ public createApp(), or
  │         └─ dynamicMount() authentication/admin gate
  │              └─ Vue page root
  │                   ├─ feature/shared components
  │                   ├─ Pinia stores + sessionStorage
  │                   ├─ Fetch API ──────> Express REST API
  │                   └─ Socket.IO ──────> /chatSocket
  │
  └─ unknown development HTML path ──────> error.html
```

## Runtime layers

### 1. HTML and build entries

The HTML files in `public/` are source entry documents. `vite.config.js`
explicitly includes them in Rollup's `input` map and disables normal public
directory copying. A custom development-server middleware provides four kinds
of rewriting:

1. `/` becomes `/feed.html`.
2. `/admin` becomes `/admin/reports.html`.
3. the Explore and Profile Page history routes resolve to their HTML shells.
4. an unknown `.html` request becomes `/error.html`.

This middleware is development-only. A static host would require equivalent
rewrite behavior if this artifact were ever served again; deployment support is
not proposed for the archival presentation pass.

### 2. Page bootstraps and access control

Public page bootstraps call `createApp()` directly. Protected pages call
`dynamicMount(App, incompleteProfileAllowed, adminRequired)`.

`dynamicMount` asks `/api/users/cookie/verify` for the current user and chooses
one of the following outcomes:

- mount the requested page;
- redirect an authenticated user toward feed or profile setup;
- redirect an unauthenticated user to login; or
- mount the unauthorized view when an admin-only page is requested by a
  non-admin.

This is user-experience access control. Backend middleware remains responsible
for authorization on protected data and actions.

### 3. Views and components

Page roots coordinate fetching and feature layout. Components often own both
their presentation and Fetch API calls. Shared components provide navigation,
search, interest badges, prompts, loading overlays, and the selected-pet UI.

The code uses the Vue Options API consistently. There is no TypeScript, schema
client, generated API layer, or centralized HTTP client. That reflects the
scope and time period of the capstone rather than a missing production layer to
be added during polish.

### 4. State and persistence

Pinia is used selectively:

- chat state is shared between socket listeners and chat components;
- alert and confirmation stores turn dialogs into awaitable interactions; and
- VueUse `useSessionStorage` persists selected chat/list and alert state per
  browser tab.

Most other page state stays local to Vue components. Cross-page selections use
named `sessionStorage` keys. Sign-out and an invalid authentication response
clear browser local/session storage.

### 5. Backend communication

Components construct URLs from `process.env.APP_SERVER_URL`, call `fetch`, and
usually include credentials so the backend's JWT cookie is sent. The backend
mounts REST families beneath `/api` and validates users in middleware.

```text
Vue page/component
  ├─ GET/POST/PATCH/DELETE + credentials
  │      └─ Express route → middleware → controller → MongoDB/Redis
  └─ Socket.IO client
         └─ chat namespace → chat handlers → store mutations
```

The frontend also initializes Firebase v8 on login and registration. Firebase
supports reCAPTCHA/phone verification; account creation and session ownership
remain backend operations.

## Principal feature flows

### Authentication and onboarding

1. Login or registration initializes Firebase with client configuration.
2. Registration verifies contact details, submits the account to the backend,
   and records `to_setup_profile` in session storage.
3. The profile-setup page retrieves schools/courses and patches the new user.
4. The backend sets/verifies an authentication cookie.
5. Protected entry bootstraps verify the cookie before mounting.

### Posts and forums

Feed/Explore/Profile fetch different post collections but reuse post display
and form components. Forum pages similarly compose discovery lists, forum
headers/forms, and thread mini/detail/form components. Likes, dislikes, saves,
subscriptions, edits, deletion, comments, and reports are direct REST actions.

### Chat

The Chat page retrieves enrolled chats and message history into `ChatStore`.
The singleton socket client handles received messages, edits, and deletions.
The interface emits message, attachment-chunk, typing, presence, edit, and
delete events. A profile-to-chat transition stores the selected conversation in
session storage before navigating to the Chat entry page.

### Reports and administration

`ReportFormLayout` submits reports for several entity types. Users can inspect
their submitted reports under the Profile Page `/support` route. Admin entry
points require the admin mount flag and expose report review, account actions,
and event management. Server-side admin middleware enforces the actual
privilege boundary.

### Gamification

Check-in retrieves missions and daily status, permits reward claims, and links
to gachapon. Gachapon retrieves gem/pet state, performs one or more draws,
enables pets, and selects a pet. The selected pet is presented through a global
component on participating pages.

## Build-time configuration

The historical configuration calls `loadEnv(mode, process.cwd(), "")` and
defines the complete result as `process.env` for client modules. Expected
frontend variables are:

| Variable | Purpose |
| --- | --- |
| `PORT` | Vite development-server port. |
| `BASE_URL` | Frontend origin used by selected-pet navigation logic. |
| `APP_SERVER_URL` | Express/Socket.IO origin, including backend port. |
| `FIREBASE_APIKEY` | Firebase web API key. |
| `FIREBASE_AUTHDOMAIN` | Firebase authentication domain. |
| `FIREBASE_PROJECTID` | Firebase project identifier. |
| `FIREBASE_APPID` | Firebase web application identifier. |

Because every environment variable is injected rather than only a public
prefix, local `.env` files must never contain secrets. The proposed polish
documents this constraint; redesigning configuration is outside scope.

## Quality boundaries

The repository has lint configuration and a push workflow, but no frontend test
suite. The backend has Mocha/Supertest tests for a subset of domain behavior.
For a historical presentation artifact, the appropriate validation target is:

- reproducible install;
- successful lint/build after narrow configuration/path corrections;
- a documented manual smoke test of implemented flows when dependencies are
  available; and
- no feature expansion, architectural migration, or deployment claim.
