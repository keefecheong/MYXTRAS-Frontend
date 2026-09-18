# MYXTRAS Frontend

MYXTRAS is a historical academic community-platform project with social posts,
forums, profiles, real-time chat, moderation, events, and gamification.

> Archived capstone project — Diploma in Cybersecurity & Digital Forensics,
> Ngee Ann Polytechnic, Capstone Project (Semester 3.1, AY2023/2024).
>
> This repository is presented as a past project. It is not deployed or
> actively maintained.

## What was built

- Feed, post creation/editing, reactions, saves, comments, and Explore views
- Forum discovery, forum subscriptions, threads, reactions, and comments
- Profile setup/management, interests, following, blocking, and messaging entry
- Real-time chat with message history, replies, edits, deletion, and files
- User reports, support history, administrator moderation, and event management
- Daily check-in, missions, gachapon draws, and selectable pets

## Technology

The frontend uses Vue 3 with Vite's multi-page build, Vue Router, Pinia,
Bootstrap, Vuetify, Firebase web authentication helpers, Socket.IO client,
Cropper.js, and native Fetch API requests. It communicates with the companion
[MYXTRAS backend](https://github.com/keefecheong/MYXTRAS-Backend), which owns the
REST API, authentication cookie, database, cache, uploads, and backend service
integrations.

The application keeps separate HTML entry points for major pages. Explore and
Profile Page use Vue Router for their related subviews. See the [architecture
overview](docs/ARCHITECTURE.md) and [codebase index](docs/CODEBASE_INDEX.md) for
the complete map.

## Frontend setup

The frontend can be installed and built independently. Integrated features also
require the companion backend and its services; backend setup is documented in
that repository rather than duplicated here.

Prerequisites:

- Node.js 18 (the runtime used during development)
- npm
- a Firebase project that you own, if you need login or registration

```bash
git clone https://github.com/keefecheong/MYXTRAS-Frontend.git
cd MYXTRAS-Frontend
npm ci
cp env_template .env
```

Edit `.env` before starting the application:

```dotenv
PORT=3123
BASE_URL=http://127.0.0.1:3123
APP_SERVER_URL=http://127.0.0.1:3124
FIREBASE_APIKEY=<your_firebase_api_key>
FIREBASE_AUTHDOMAIN=<your_firebase_auth_domain>
FIREBASE_PROJECTID=<your_firebase_project_id>
FIREBASE_APPID=<your_firebase_app_id>
```

The historical Firebase project is no longer available. The Firebase values in
`.env` must come from your own project; treat them as public client
configuration and never place private server credentials in this file.

Run the frontend:

```bash
npm run dev
```

The documented example frontend port is `3123`; any available port can be used
if `PORT` and related URLs are changed consistently. Set `APP_SERVER_URL` to
the running backend (the documented example is `http://127.0.0.1:3124`). For
backend prerequisites and continuation steps, see the [backend
repository](https://github.com/keefecheong/MYXTRAS-Backend).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build all HTML entry points for production output. |
| `npm run preview` | Preview the built output locally. |
| `npm run lint` | Run JavaScript, filename, and EditorConfig checks. |
| `npm run lint:css` | Run the historical Stylelint configuration separately. |

The frontend has no automated test suite. Manual integrated verification depends
on the backend and third-party services being available.

## Repository guide

| Document | Contents |
| --- | --- |
| [Architecture](docs/ARCHITECTURE.md) | Runtime layers, data flows, routing, state, and service boundaries. |
| [Codebase index](docs/CODEBASE_INDEX.md) | Page, component, store, utility, asset, and API map. |
| [Technical decisions](docs/TECHNICAL_DECISIONS.md) | Retrospective decisions and trade-offs visible in the implementation. |
| [Audit findings](docs/AUDIT_FINDINGS.md) | Validation results, known limitations, and cleanup record. |
| [Polish implementation plan](docs/IMPLEMENTATION_PLAN.md) | Scope and acceptance criteria for the presentation revision. |

No demo link or screenshots are available for this archived project. No license
is provided.
