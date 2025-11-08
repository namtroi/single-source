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
- `[ ]` Create the `GET /api/health` test endpoint (as defined in `API_SPEC.md`).
- `[x]` Run `npm run dev` and confirm the server runs.

### Frontend:

- `[x]` Follow `SETTING_ENVIRONMENT.md` to set up the `/client` directory (Vite, React, Tailwind v4).
- `[x]` Install all client-side dependencies (`npm install` in `/client`).
- `[x]` Set up the basic Redux store (`store.js`) and `<Provider>` in `main.jsx`.
- `[x]` Set up `BrowserRouter` and create initial page components (e.S., `Home`, `Login`, `Register`, `Dashboard`, `PublicProfile`).
- `[x]` Run `npm run dev` and confirm the React app loads.

### 🏁 **Verification:**

- `[x]` Test that Tailwind is working by adding a `className="text-red-500"` to `App.jsx`.
- `[ ]` Test the connection by visiting Nam's health check endpoint (`http://localhost:8080/api/health`) in the browser.

---

## Phase 1: User Authentication

**Goal:** Allow users to register and log in. Secure the application.

### Nam (Backend):

- `[ ]` Implement `POST /api/auth/register` endpoint.
  - Logic: Hash password with `bcrypt`, save user to `users` table, generate JWT.
- `[ ]` Implement `POST /api/auth/login` endpoint.
  - Logic: Find user, compare hash with `bcrypt`, generate JWT.
- `[ ]` Create the core reusable "Auth Middleware" (to check for `Authorization: Bearer <token>` on protected routes).

### John (Frontend):

- `[x]` Build the `Register.jsx` page and form.
- `[ ]` Build the `Login.jsx` page and form.
- `[ ]` Create an `authSlice.js` in Redux.
  - State: `user`, `token`, `isAuthenticated`, `isLoading`, `error`.
  - Reducers: `setCredentials`, `logOut`.
- `[ ]` Create an API service function to call `POST /api/auth/register` and `POST /api/auth/login`.
- `[ ]` On successful login/register, dispatch `setCredentials` to save the token/user to state and `localStorage`.
- `[ ]` Create a `ProtectedRoute.jsx` component that checks `isAuthenticated` from the Redux store and redirects to `/login` if false.
- `[ ]` Create a `Header.jsx` component that conditionally shows "Login/Register" or "Dashboard/Logout" buttons.

### 🏁 **Key Dependency:**

- John might be **blocked** on finishing this task until Nam's `/api/auth/register` and `/api/auth/login` endpoints are live and follow the `API_SPEC.md`. If so, John can create mock data to finish your part and integrate the flow when Nam finish his API.

---

## Phase 2: Public User Page

**Goal:** Allow anyone to see a user's links by visiting `/:username`.

### Nam (Backend):

- `[ ]` Implement `GET /api/users/:username` endpoint.
  - Logic: Find user by `username`, fetch all their associated links, return the `PublicProfile` object.
  - **Security:** Ensure the `password_hash` is **NOT** included in the response.

### John (Frontend):

- `[ ]` Configure React Router with the dynamic route: `<Route path="/:username" element={<PublicProfile />} />`.
- `[ ]` In `PublicProfile.jsx`, use the `useParams()` hook to get the `username` from the URL.
- `[ ]` On page load, call Nam's `GET /api/users/:username` endpoint.
- `[ ]` Build the UI to render the user's name and their list of links.
- `[ ]` Add a "User not found" message or redirect if the API returns a 404.

### 🏁 **Key Dependency:**

- John is **blocked** on this task until Nam's `GET /api/users/:username` endpoint is ready.

---

## Phase 3: Link Management Dashboard

**Goal:** Logged-in users can Create, Read, Update, and Delete their _own_ links.

### Nam (Backend):

- `[ ]` Apply the "Auth Middleware" to all `/api/links` routes.
- `[ ]` Implement `GET /api/links` (Read).
  - Logic: Get `user_id` from the JWT, return all links for that `user_id`.
- `[ ]` Implement `POST /api/links` (Create).
  - Logic: Get `user_id` from JWT, create new link associated with that user.
- `[ ]` Implement `PUT /api/links/:linkId` (Update).
  - Logic: Get `user_id` from JWT, verify they own the link (`linkId`), then update.
- `[ ]` Implement `DELETE /api/links/:linkId` (Delete).
  - Logic: Get `user_id` from JWT, verify they own the link (`linkId`), then delete.

### John (Frontend):

- `[ ]` Secure the `/dashboard` route using the `ProtectedRoute` component.
- `[ ]` Create a `linksSlice.js` in Redux to manage the array of links.
- `[ ]` In `Dashboard.jsx`, on page load, call `GET /api/links` and populate the Redux store.
- `[ ]` Build `AddLinkForm.jsx` component to `POST` new links.
- `[ ]` Build `LinkList.jsx` to display the links from the Redux store.
- `[ ]` Build `LinkItem.jsx` component with "Edit" and "Delete" buttons.
  - "Delete" button triggers `DELETE /api/links/:linkId`.
  - "Edit" button can open a modal/inline form to `PUT /api/links/:linkId`.
- `[ ]` Create an API utility (e.g., `api.js`) that automatically attaches the `token` from the Redux store to the headers of all protected requests.

### 🏁 **Key Dependency:**

- This is the most complex phase. John is **blocked** until Nam has all four (`GET`, `POST`, `PUT`, `DELETE`) link endpoints functional and secured.

---

## Phase 4: Integration, Polish & MVP Completion

**Goal:** Ensure the app works end-to-end and is user-friendly.

### Both:

- `[ ]` **Full End-to-End Test (Manual):**
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
