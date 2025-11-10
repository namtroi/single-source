# Single Source

A web application to consolidate all your various online links onto a single, simple, public page.

- **Public Page:** `localhost:3000/:username`
- **Private Dashboard:** `localhost:3000/dashboard` (for link management)

### 🚀 Tech Stack

- **Frontend:** React (**TypeScript**), Redux Toolkit, React Router, TailwindCSS
- **Backend:** Node.js, Express (**TypeScript**, ES Modules)
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) & bcrypt
- **Validation:** Zod

---

## 🏁 Quick Start Guide

This guide is for developers who have cloned the project and want to run it locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (a running local instance)

### 2. Installation

1.  **Clone the repository:**

    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd single-source
    ```

2.  **Install all dependencies:**
    You must install dependencies in all 3 locations: root, server, and client.

    ```bash
    # (In root)
    npm install

    # (In server)
    cd server
    npm install

    # (In client)
    cd ../client
    npm install
    ```

### 3. Environment Setup (.env)

You must create `.env` files in both `/client` and `/server` directories. Use the `.env.example` files as a template.

**Server (`/server/.env`)**

```.env
PORT=8080
DATABASE_URL="postgresql://[DB_USER]:[DB_PASSWORD]@[DB_HOST]:[DB_PORT]/[DB_NAME]"
JWT_SECRET="YOUR_SUPER_SECRET_KEY_FOR_JWT"
```

**Client (`/client/.env`)**

```.env
# (assuming Vite)
VITE_API_BASE_URL="http://localhost:8080/api"
```

### 4\. Database Setup

1.  Ensure your PostgreSQL server is running.
2.  Create your database (e.g., `single_source_dev`).
3.  Run the full SQL script located in `/docs/03-DATABASE.md` to create the `users` and `links` tables.

### 5\. Running the Application

Go back to the **root** directory and run one command:

```bash
# (In root)
npm run dev
```

_(This will use `concurrently` to start both the backend server (on port 8080) and the frontend client (on port 3000) simultaneously.)_

---

## 📂 Project Documentation

For detailed project information, see the `/docs` folder, ordered by priority:

- **`/docs/01-GIT_WORKFLOW.md`**: How to branch, commit, and create Pull Requests.
- **`/docs/02-API_SPEC.md`**: The API "contract" between frontend and backend.
- **`/docs/03-DATABASE.md`**: Database schema and SQL setup script.
- **`/docs/90-ACTION_PLAN.md`**: Step-by-step tasks for the project.
- **`/docs/99-SETTING_ENVIRONMENT.md`**: (Reference only) The full guide to setting up this project from scratch.
