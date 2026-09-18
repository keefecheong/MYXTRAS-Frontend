# Codebase index

## Snapshot

| Item | Reviewed value |
| --- | --- |
| Frontend baseline | `main` / `origin/main` at `840a91f` |
| Frontend period represented | May–August 2023 |
| Application model | Vite multi-page application with Vue 3 page roots |
| Frontend source size | approximately 23,783 lines across Vue, JS, CSS, HTML, and JSON |
| HTML entry points | 18 (15 user-facing, 3 administrator-facing) |
| Vue component files | 40 under `src/components` |
| Companion backend | `keefecheong/MYXTRAS-Backend`, inspected at `2454ca7` |

Generated dependencies (`node_modules`) and build output (`dist`) are not part
of this index.

## Top-level map

| Path | Purpose | Notes |
| --- | --- | --- |
| `public/` | HTML shells for every page | Each shell mounts one module into `#app`; this is source input, not merely copied static content. |
| `src/pages/` | Page roots and per-page bootstraps | Most folders contain `<Page>.vue` and `<Page>.js`. Authentication is selected in the bootstrap. |
| `src/components/` | Reusable and feature-specific Vue components | Organized by admin, announcement, blog, chat, comment, forum, gamification, general, and report. |
| `src/views/` | Components rendered by Vue Router | Used only by Explore and Profile Page routing, plus an unauthorized fallback. |
| `src/router/` | The two client routers | History bases are `/explore.html` and `/profilePage.html`. |
| `src/stores/` | Pinia state | Alert, confirmation, and chat state; some state persists in session storage. |
| `src/utils/` | Authentication, socket, navigation, formatting, and UI helpers | These are shared directly rather than exposed through a service layer. |
| `src/styles/` | Shared CSS | Includes page-family styles and a vendored `w3.css`. Most components also contain scoped or local styles. |
| `src/assets/` | Images, SVGs, and JSON UI configuration | Fonts are in the adjacent `src/fonts/` directory. |
| `vite.config.js` | Development redirects and production entry map | Explicitly lists all 18 HTML inputs. |
| `env_template` | Historical environment-variable example | Uses unprefixed variables exposed through `process.env` by Vite configuration. |
| `.github/workflows/lint.yaml` | Push-to-`main` lint and build workflow | Uses Node 18 with current checkout/setup actions. |

## Page and entry-point index

All page roots use Vue's Options API. `Protected` means the bootstrap invokes
`dynamicMount`; `admin` adds its administrator check. Public events and about
pages still consume shared components or backend data but do not require the
authentication gate at mount time.

| Browser entry | Bootstrap / root | Access | Existing feature responsibility |
| --- | --- | --- | --- |
| `/` → `/feed.html` | `pages/Feed/Feed.js` / `Feed.vue` | Protected | Followed-user post feed and post rendering. |
| `/about.html` | `pages/About/About.js` / `About.vue` | Public | Project/about content. |
| `/chat.html` | `pages/Chat/Chat.js` / `Chat.vue` | Protected | Chat list, message history, and real-time chat interface. |
| `/checkin.html` | `pages/Checkin/Checkin.js` / `Checkin.vue` | Protected | Daily check-in, missions, rewards, and link to gachapon. |
| `/error.html` | `pages/Error/ErrorPage.js` / `ErrorPage.vue` | Public | Unknown-page fallback in the development middleware. |
| `/events.html` | `pages/Events/Events.js` / `Events.vue` | Public | Event/announcement listing. |
| `/explore.html/blogs` | `Explore.js` → `ExploreBlogView.vue` | Protected | Popular post discovery. |
| `/explore.html/threads` | `Explore.js` → `ExploreThreadView.vue` | Protected | Thread and categorized-forum discovery. |
| `/forum.html` | `pages/Forum/Forum.js` / `Forum.vue` | Protected | Forum landing page, recent/popular threads, and forum creation. |
| `/forumGroup.html` | `pages/ForumGroup/ForumGroup.js` / `ForumGroup.vue` | Protected | One forum's details, subscription, and threads. |
| `/gachapon.html` | `pages/Gachapon/Gachapon.js` / `Gachapon.vue` | Protected | Pet/reward draws and pet selection. |
| `/login.html` | `pages/Login/Login.js` / `Login.vue` | Public/redirecting | Firebase reCAPTCHA initialization and backend login. |
| `/profileManagement.html` | `ProfileManagement.js` / `ProfileManagement.vue` | Protected | Profile details, interests, and image cropping/upload. |
| `/profilePage.html` | `ProfilePage.js` → `ProfilePageView.vue` | Protected | Own/other profile, posts, forums, social actions, and messaging entry. |
| `/profilePage.html/support` | `ProfilePage.js` → `ProfilePageSupportView.vue` | Protected | User-submitted report/support history and detail. |
| `/registration.html` | `Registration.js` / `Registration.vue` | Public | Firebase OTP/reCAPTCHA flow and backend registration. |
| `/setupProfile.html` | `SetupProfile/SetupProfile.js` / `SetupProfile.vue` | Protected, incomplete-profile mode | School/course/profile completion after registration. |
| `/admin/events.html` | `Admin/Events/Events.js` / `Events.vue` | Admin | Event creation and editing. |
| `/admin/manageAccounts.html` | `Admin/ManageAccounts/ManageAccounts.js` / `ManageAccounts.vue` | Admin | Account discovery and administration. |
| `/admin/reports.html` | `Admin/Reports/Reports.js` / `Reports.vue` | Admin | Pending/reviewed reports and moderation actions. |

Note: there are 18 HTML shells but 20 rows above because the Explore and
Profile Page shells each expose two client-side routes.

## Component index

### Shared shell and interaction components

| Component | Responsibility |
| --- | --- |
| `general/NavSidebar.vue` | Primary navigation and socket-aware shell behavior. |
| `general/SearchBar.vue`, `SearchResults.vue` | Debounced user/forum search and result navigation. |
| `general/AlertPrompt.vue`, `ConfirmPrompt.vue` | Store-driven asynchronous dialogs. |
| `general/DynamicTextarea.vue` | Reusable bounded/auto-sizing text entry. |
| `general/AddInterestButton.vue`, `InterestBadgeList.vue` | Interest selection and display. |
| `general/LoadingOverlay.vue` | Blocking operation feedback. |
| `gamification/pets.vue`, `pet.vue` | Global selected-pet display and individual pet presentation. |

`utils/general/globalComponent.js` globally registers the sidebar and pets
components on the page roots that opt into it.

### Content, community, and moderation components

| Area | Components | Responsibility |
| --- | --- | --- |
| Posts | `BlogLayout`, `BlogFormLayout`, `BlogExploreLayout`, `ExploreSingleBlogLayout` | Post display, create/edit, interactions, comments, and explore cards/detail. |
| Comments | `CommentLayout` | Post comment display and lifecycle actions. |
| Forums/threads | `CreatedForums`, `SubscribedForums`, `RecommendedForums`, `PopularThreads`, `ForumViewHeader`, `ForumFormLayout`, `ThreadMiniLayout`, `ThreadDetailedLayout`, `ThreadFormLayout`, `ThreadCommentLayout` | Forum discovery/subscription plus thread creation, reading, reactions, and comments. |
| Chat | `ChatListLayout`, `ChatInterfaceLayout`, `ChatMessageLayout`, `ChatReplyMessageLayout`, `ChatFileLayout` | Conversation selection, real-time messaging, replies, attachments, edit/delete, and reports. |
| Reports | `ReportFormLayout` | Submission UI reused by posts, forums, threads, chat, and profiles. |
| Events | `announcement/AnnouncementLayout` | Event card/list behavior. |
| Admin events | `AdminBanner`, `EventsFormLayout` | Admin navigation and event form. |
| Admin accounts | `UserLayout`, `UserDetailsLayout`, `WarningLayout` | User list/detail, warning, suspension, role, and termination presentation. |
| Admin reports | `ReportLayout`, `ReportDetailsLayout` | Moderation queue and evidence/detail handling. |

## State, routing, and utilities

| Module | Contract |
| --- | --- |
| `stores/AlertStore.js` | Persists alert visibility/message/resolve ID in session storage. |
| `stores/ConfirmStore.js` | Holds an in-memory confirmation callback. |
| `stores/ChatStore.js` | Persists selected chat and chat list per tab; keeps fetched messages in memory. |
| `stores/Store.js` | Shared Pinia instance required by the socket module and Chat page. |
| `router/ExploreRouter.js` | `/blogs` and `/threads` beneath `/explore.html`. |
| `router/ProfileRouter.js` | profile root and `/support` beneath `/profilePage.html`. |
| `utils/authentication/*` | Cookie verification, mount-time access selection, redirects, and sign-out. |
| `utils/chat/chatSocket.js` | Singleton Socket.IO client for `/chatSocket`; updates the chat store. |
| `utils/alert/resolveHandler.js` | Maps persisted alert IDs to Promise resolver functions. |
| `utils/general/viewUser.js`, `viewForum.js` | Cross-page navigation using session-storage handoff. |
| Other `utils/general/*` | Date/time, file-size, highlighting, interest selection, and component registration helpers. |

## Data and service boundaries

The frontend sends credentialed Fetch API requests directly from pages and
components to `APP_SERVER_URL`. Confirmed backend route families are:

- `/api/users`: registration, login, cookie verification/removal, profile,
  validation, follow, and block.
- `/api/posts`: followed/explore/saved/user posts, CRUD, likes, saves, and
  comments.
- `/api/forums`: created/subscribed/categorized/recommended forums, CRUD, and
  subscription.
- `/api/threads`: explore/popular/recent/forum threads, CRUD, reactions, and
  comments.
- `/api/search`: combined, user-only, and forum-only search.
- `/api/chats`: enrolled chats, latest/history messages, and chat lookup.
- `/api/report`: submitted reports and reporting of supported entity types.
- `/api/admin`: report moderation and account administration.
- `/api/gamification`: missions, daily check-in, gachapon, and pets.
- `/api/events`: event listing and administrator-managed event lifecycle.
- `/api/schools`: school/course reference data.

Real-time chat uses Socket.IO at `${APP_SERVER_URL}/chatSocket`. Authentication
is backend-issued HTTP-only JWT cookie based, inferred from credentialed
requests and the backend middleware. Firebase v8 is used on login/registration
for reCAPTCHA/phone verification. The backend also depends on MongoDB, Redis,
AWS-backed uploads, and Sightengine moderation; those services are not frontend
concerns but affect end-to-end local setup.

## Navigation handoffs

The multi-page design uses `sessionStorage` where route parameters would
otherwise be used:

- `user` / `tempUser` select a profile on `profilePage.html`.
- `forum_id` selects a forum on `forumGroup.html`.
- `selectedChat` opens a conversation on `chat.html`.
- `to_setup_profile` permits the incomplete-profile setup path.
- Pinia's VueUse-backed `currentChat`, `chats`, and alert keys survive refresh
  within a browser tab.

Documenting these keys is important because they are part of the actual page
contract even though they are not formal API types.

## Assets and configuration

- `src/assets/interest-badge-config.json` defines interest badge appearance.
- `src/assets/sidebar-link-config.json` defines sidebar destinations/icons.
- `src/fonts/` contains five Quicksand font weights.
- Gamification art and animations are stored locally in `src/assets/`.
- Firebase client identifiers are supplied through the environment template.
  Firebase web client configuration is not a server secret, but the intended
  demo/local-only status should be stated and no private server credentials
  should be added.
