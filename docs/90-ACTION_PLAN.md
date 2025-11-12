# Action Plan: Single Source MVP

This document outlines the step-by-step tasks required to build, test, and complete the MVP.

**Team:**

- **Nam:** Back-end (API, Database, Auth) - Git Lead
- **John:** Front-end (React Components, UI/UX, Routing) - Scrum Lead

---

## Phase 0: Project Setup & Foundation

**Goal:** Ensure both team members have a stable, identical, and runnable local environment.
**Priority:** Highest.

### Repo Initiation :

- `[x]` Initialize Git repository on GitHub/GitLab.
- `[x]` Define and push the main branch protection rules.
- `[x]` Agree on a branching strategy (e.g., `main`, `dev`, `feat/feature-name`).
- `[x]` Clone the repository.
- `[x]` Review and confirm all documentation files.

### Backend:

- `[x]` Follow `SETTING_ENVIRONMENT.md` to set up the `/server` directory (Node, ESM, Express, etc.).
- `[x]` Install all server-side dependencies (`npm install` in `/server`).
- `[x]` Create the local PostgreSQL database (e.g., `single_source_dev`).
- `[x]` Run the SQL script from `DATABASE.md` to create `users` and `links` tables.
- `[x]` Create the `GET /api/health` test endpoint (as defined in `API_SPEC.md`).
- `[x]` Run `npm run dev` and confirm the server runs.

### Frontend:

- `[x]` Follow `SETTING_ENVIRONMENT.md` to set up the `/client` directory (Vite, React, Tailwind v4).
- `[x]` Install all client-side dependencies (`npm install` in `/client`).
- `[x]` Set up the basic Redux store (`store.js`) and `<Provider>` in `main.jsx`.
- `[x]` Set up `BrowserRouter` and create initial page components (e.S., `Home`, `Login`, `Register`, `Dashboard`, `PublicProfile`).
- `[x]` Run `npm run dev` and confirm the React app loads.

### 🏁 **Verification:**

- `[x]` Test that Tailwind is working by adding a `className="text-red-500"` to `App.jsx`.
- `[x]` Test the connection by visiting Nam's health check endpoint (`http://localhost:8080/api/health`) in the browser.

---

## Phase 1: User Authentication

**Goal:** Allow users to register and log in. Secure the application.

### Nam (Backend):

- `[x]` Implement `POST /api/auth/register` endpoint.
  - Logic: Hash password with `bcrypt`, save user to `users` table, generate JWT.
- `[x]` Implement `POST /api/auth/login` endpoint.
  - Logic: Find user, compare hash with `bcrypt`, generate JWT.
- `[x]` Create the core reusable "Auth Middleware" (to check for `Authorization: Bearer <token>` on protected routes).

### John (Frontend):

- `[x]` Build the `Register.jsx` page and form.
- `[x]` Build the `Login.jsx` page and form.
- `[x]` Create an `authSlice.js` in Redux.
  - State: `user`, `token`, `isAuthenticated`, `isLoading`, `error`.
  - Reducers: `setCredentials`, `logOut`.
- `[x]` Create an API service function to call `POST /api/auth/register` and `POST /api/auth/login`.
- `[x]` On successful login/register, dispatch `setCredentials` to save the token/user to state and `localStorage`.
- `[x]` Create a `ProtectedRoute.jsx` component that checks `isAuthenticated` from the Redux store and redirects to `/login` if false.
- `[x]` Create a `Header.jsx` component that conditionally shows "Login/Register" or "Dashboard/Logout" buttons.

### 🏁 **Key Dependency:**

- John might be **blocked** on finishing this task until Nam's `/api/auth/register` and `/api/auth/login` endpoints are live and follow the `API_SPEC.md`. If so, John can create mock data to finish your part and integrate the flow when Nam finish his API.

---

## Phase 2: Public User Page

**Goal:** Allow anyone to see a user's links by visiting `/:username`.

### Nam (Backend):

- `[x]` Implement `GET /api/users/:username` endpoint.
  - Logic: Find user by `username`, fetch all their associated links, return the `PublicProfile` object.
  - **Security:** Ensure the `password_hash` is **NOT** included in the response.

### John (Frontend):

- `[x]` Configure React Router with the dynamic route: `<Route path="/:username" element={<PublicProfile />} />`.
- `[x]` In `PublicProfile.jsx`, use the `useParams()` hook to get the `username` from the URL.
- `[x]` On page load, call Nam's `GET /api/users/:username` endpoint.
- `[x]` Build the UI to render the user's name and their list of links.
- `[x]` Add a "User not found" message or redirect if the API returns a 404.

### 🏁 **Key Dependency:**

- John is **blocked** on this task until Nam's `GET /api/users/:username` endpoint is ready.

---

## Phase 3: Link Management Dashboard

**Goal:** Logged-in users can Create, Read, Update, and Delete their _own_ links.

### Nam (Backend):

- `[x]` Apply the "Auth Middleware" to all `/api/links` routes.
- `[x]` Implement `GET /api/links` (Read).
  - Logic: Get `user_id` from the JWT, return all links for that `user_id`.
- `[x]` Implement `POST /api/links` (Create).
  - Logic: Get `user_id` from JWT, create new link associated with that user.
- `[x]` Implement `PUT /api/links/:linkId` (Update).
  - Logic: Get `user_id` from JWT, verify they own the link (`linkId`), then update.
- `[x]` Implement `DELETE /api/links/:linkId` (Delete).
  - Logic: Get `user_id` from JWT, verify they own the link (`linkId`), then delete.

### John (Frontend):

- `[x]` Secure the `/dashboard` route using the `ProtectedRoute` component.
- `[x]` Create a `linksSlice.js` in Redux to manage the array of links.
- `[x]` In `Dashboard.jsx`, on page load, call `GET /api/links` and populate the Redux store.
- `[x]` Build `AddLinkForm.jsx` component to `POST` new links.
- `[x]` Build `LinkList.jsx` to display the links from the Redux store.
- `[x]` Build `LinkItem.jsx` component with "Edit" and "Delete" buttons.
  - "Delete" button triggers `DELETE /api/links/:linkId`.
  - "Edit" button can open a modal/inline form to `PUT /api/links/:linkId`.
- `[x]` Create an API utility (e.g., `api.js`) that automatically attaches the `token` from the Redux store to the headers of all protected requests.

### 🏁 **Key Dependency:**

- This is the most complex phase. John is **blocked** until Nam has all four (`GET`, `POST`, `PUT`, `DELETE`) link endpoints functional and secured.

---

## Phase 4: Integration, Polish & MVP Completion

**Goal:** Ensure the app works end-to-end and is user-friendly.

### Both:

- `[x]` **Full End-to-End Test (Manual):**
  1.  (John) Register a new user.
  2.  (John) Log in with that user.
  3.  (John) Go to `/dashboard`.
  4.  (John) Create 3 new links.
  5.  (John) Edit 1 link.
  6.  (John) Delete 1 link.
  7.  (Nam) Check the database to confirm all changes are correct.
  8.  (John) Log out.
  9.  (John) Visit the public page (`/new-username`) and confirm the 2 remaining links are displayed.

### Nam (Backend):

- `[ ]` Add server-side validation (e.g., ensure `url` is a valid URL format, `password` is long enough).
- `[ ]` Finalize all error handling to return consistent JSON error messages (as defined in `API_SPEC.md`).
- `[ ]` Remove all `console.log`s.

### John (Frontend):

- `[ ]` Add "Loading" states (spinners) for all API calls.
- `[ ]` Add error handling (e.g., "Invalid password" on login, "Title is required" on link form).
- `[ ]` Check responsiveness: Ensure the app looks good on both desktop and mobile.
- `[ ]` Remove all `console.log`s.

## Action Plan: Single Source Iteration MVP

This document outlines the step-by-step tasks required to build, test, and complete the iteration of the Single Source MVP.

## Team:

John: Back-end (API, Database, Auth, File Uploads, QR Generation) – Git Lead
Avo: Front-end (React Components, UI/UX, Theming, Routing, Profile Customization) – Scrum Lead
Both: Integration, Testing, and Deployment

## Phase 0: Iteration Setup & Foundation

# Goal: Set up the environment for the new iteration and ensure compatibility with the existing MVP.

Priority: Highest.

## Repo Setup

- [x] Pull the latest stable main branch from the original MVP.
- [x] Create a new branch for iteration work (e.g., iteration/custom-theme, iteration/profile-upload).
- [x] Review existing backend routes and database schema for compatibility.
- [x] Update docs: `README.md`, `.env.example`, setup notes.

# Verification

- [x] Run `/server` and `/client` concurrently with npm run dev.
- [x] Confirm registration, login, and dashboard work as-is.
- [x] Verify link CRUD works before changes.

## Phase 1: Custom Theme Feature

# Goal: Allow users to select and apply custom themes (colors/presets) stored per user.

John (Backend)

- [x] Add `theme_preference` to users table (JSON or VARCHAR).
- [ ] `PUT /api/users/theme (auth)` — save theme.
- [ ] Include theme_preference in `GET /api/users/:username.`
- [ ] Validate theme payload (hex/rgb, safe ranges).

Avo (Frontend)

- [ ] Add “Customize Theme” entry in nav → `/profile/customize`.
- [ ] Build `ThemeCustomizer.jsx` with presets + live preview.
- [ ] Persist via `PUT /api/users/theme`; store in Redux user slice.
- [ ] Apply theme using CSS variables.

Key Dependency: Avo’s save/load UI depends on John’s theme endpoints.

## Phase 2: Profile Picture Upload

# Goal: Let users upload/store a profile picture and show it on profile pages.

John (Backend)
[ ] Configure multer for image uploads (size/type limits).
[ ] `POST /api/users/upload (auth)` — save file; persist profile_image_url.
[ ] Serve uploads (static or CDN) and include URL in GET /api/users/:username.

Avo (Frontend)
[ ] Build upload UI in `ProfileSettings.jsx` with preview + progress.
[ ] POST image to `/api/users/upload`.
[ ] Display current avatar on Dashboard & Public Profile.

Key Dependency: Avo needs John’s upload endpoint + returned URL.

## Phase 3: QR Code Generation

# Goal: Generate a QR code that links to `/u/:username` and expose it on the public profile.

John (Backend)
[ ] Add qrcode lib.
[ ] `GET /api/users/:username/qr?format=svg|png&size=256&ecc=Q — return QR.`
[ ] Add cache headers (immutable/max-age; ETag).

Avo (Frontend)
[ ] Show QR on Public Profile with `“Download PNG”` and `“Copy Profile URL”` buttons.
[ ] Optional: theme-aware QR (dark/light contrast).

Key Dependency: Avo’s display/download uses John’s QR endpoint.

## Phase 4: Integration & Testing

# Goal: Ensure all new features integrate smoothly and regressions are avoided.

Both
[ ] Theme persists across sessions and applies instantly on Public Profile.
[ ] Avatar upload stores and renders correctly.
[ ] QR code points to the right URL and downloads correctly.
[ ] Full regression of auth and link CRUD.

John (Backend)
[ ] Add validation + consistent error format `({ err: string })`.
[ ] Optimize queries; indexes if needed.
[ ] Remove debug logs; tighten CORS & security headers.

Avo (Frontend)
[ ] Add loading/skeleton and error states for new features.
[ ] Ensure responsive design for customize, upload, and QR sections.
[ ] Remove debug logs; accessibility pass (labels, focus).

## Phase 5: Stretch Goals

# Goal: Extend personalization and sharing with optional enhancements.

[ ] OAuth login (Google/Facebook).
[ ] Pin links (DB boolean + sort first).
[ ] Link ordering via drag-and-drop (persist position).
[ ] QR scan analytics (server-side increment + dashboard chart).
[ ] Layout styles (list/grid/card) per user theme.

## Final Deliverables

[ ] Custom theme selector with persisted settings.
[ ] Profile picture upload pipeline (client → server → storage) and display.
[ ] QR generation endpoint + UI (view + download).
[ ] Updated docs with setup, endpoints, and demo steps.

## Tech Stack

Frontend: React, Vite, Redux Toolkit, Tailwind (CSS variables for theming)
Backend: Node.js, Express, Multer (uploads), qrcode
Database: PostgreSQL
Auth: JWT (Bearer)
Runbook (Dev)
Server: cd server && npm i && npm run dev
Client: cd client && npm i && npm run dev

ENV:
Server: PORT=8080, DATABASE_URL=…, PUBLIC_BASE_URL=http://localhost:5173
