# Single Source

A web application to consolidate all your various online links onto a single, simple, public page.

- **Public Page:** `localhost:3000/:username`
- **Private Dashboard:** `localhost:3000/dashboard` (for link management)

### 🚀 Tech Stack

- **Frontend:** React, Redux Toolkit, React Router, TailwindCSS
- **Backend:** Node.js, Express (ES Modules)
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) & bcrypt

---

## 🏁 Quick Start (For Developers)

This guide assumes the project structure and dependencies are already set up.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (running locally or a remote connection string)

### 2. Installation

Install dependencies for both client and server:

```bash
# From root directory
cd server
npm install

cd ../client
npm install
```

### 3\. Environment Setup (.env)

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

1.  Make sure your PostgreSQL server is running.
2.  Create your database (e.g., `single_source_dev`).
3.  Run the database schema script found in `/docs/DATABASE.md` to create the `users` and `links` tables.

### 5\. Running the Application

You will need two terminals.

- **Run Backend Server:**

  ```bash
  cd server
  npm run dev
  # Server (ESM) running on http://localhost:8080
  ```

- **Run Frontend Client:**

  ```bash
  cd client
  npm run dev
  # Client running on http://localhost:3000
  ```

---

## 📂 Project Documentation

For detailed information on project setup from scratch, API specifications, and database design, please see the `/docs` folder.

- **`/docs/SETTING_ENVIRONMENT.md`**: Full guide to setting up the project from an empty folder.
- **`/docs/API_SPEC.md`**: The API contract between frontend and backend.
- **`/docs/DATABASE.md`**: Database schema and design.
