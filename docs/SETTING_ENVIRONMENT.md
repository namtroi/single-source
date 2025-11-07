# Setting Up the Development Environment (From Scratch)

This document guides you through setting up the entire `single-source` project from an empty directory, including all modern configurations for ES Modules, Vite, and Tailwind v4.

**Note:** All commands are run from the **project's root directory** unless specified otherwise.

---

## 1. Backend Setup (Express + ES Modules)

These steps will create and configure the `/server` directory.

### 1.1. Initialize Project & Dependencies

```bash
# In your project's root folder:
mkdir server

# Now, navigate into the new server directory
cd server

# (You are now in /server)
# Initialize a new Node.js project
npm init -y

# (Still in /server)
# Install main dependencies
npm install express pg bcryptjs jsonwebtoken cors dotenv

# (Still in /server)
# Install dev dependencies
npm install -D nodemon
```

### 1.2. Configure for ES Modules (ESM)

1.  In `/server`, open the newly created `package.json`.
2.  Add the following line to the top level:
    ```json
    "type": "module",
    ```
3.  This allows you to use `import/export` syntax (e.g., `import express from 'express'`).

### 1.3. Configure Run Scripts

1.  In `/server/package.json`, update the `scripts` section:
    ```json
    "scripts": {
      "start": "node server.js",
      "dev": "nodemon server.js"
    }
    ```
2.  Your main backend file (e.g., `server.js`) must be in the `/server` directory.

---

## 2\. Frontend Setup (Vite + React + Tailwind v4)

These steps will create and configure the `/client` directory.

### 2.1. Initialize React Project (Vite)

```bash
# Go back to the project's root directory
cd ..

# (You are now in the root)
# Use create-vite to build the 'client' folder
npx create-vite@latest client --template react

# Navigate into the new client directory
cd client

# (You are now in /client)
# Install React's base dependencies
npm install
```

### 2.2. Install Redux Toolkit & React Router

```bash
# (Make sure you are in /client)
npm install @reduxjs/toolkit react-redux react-router-dom
```

_Remember to configure your Redux store, set up `BrowserRouter`, and wrap your `<App />` in the `<Provider>`._

### 2.3. Install & Configure TailwindCSS v4

All of these commands are run **inside the `/client` directory**.

1.  **Install Tailwind & the Vite Plugin:**

    ```bash
    # (In /client)
    npm install -D tailwindcss@next @tailwindcss/vite
    ```

2.  **Initialize Tailwind (Optional but Recommended):**

    ```bash
    # (In /client)
    # This creates tailwind.config.js
    npx tailwindcss init
    ```

3.  **Configure `tailwind.config.js`:**
    Update `/client/tailwind.config.js` to scan your React components:

    ```javascript
    // /client/tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    export default {
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        extend: {},
      },
      plugins: [],
    };
    ```

4.  **Configure `vite.config.js`:**
    Import and use the `@tailwindcss/vite` plugin in `/client/vite.config.js`:

    ```javascript
    // /client/vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import tailwindcss from '@tailwindcss/vite'; // 1. Import the plugin

    // [https://vitejs.dev/config/](https://vitejs.dev/config/)
    export default defineConfig({
      plugins: [
        react(),
        tailwindcss(), // 2. Add the plugin
      ],
    });
    ```

5.  **Add Tailwind Directives:**
    Replace the contents of `/client/src/index.css` with the Tailwind directives:

    ```css
    /* /client/src/index.css */
    @import 'tailwindcss';
    ```
