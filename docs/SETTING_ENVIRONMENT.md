# Setting Up the Development Environment (From Scratch)

This document guides you through setting up the entire `single-source` project from an empty directory, using a full **TypeScript** stack with **ES Modules**.

**Note:** All commands are run from the **project's root directory** unless specified otherwise.

---

## 1. Backend Setup (Express + TypeScript + ESM)

These steps will create and configure the `/server` directory.

### 1.1. Initialize Project & Dependencies

````bash
# In your project's root folder:
mkdir server
cd server

# (You are now in /server)
# Initialize a new Node.js project
npm init -y

### 1.2. Configure for ES Modules (ESM)

1.  Open `/server/package.json`.
2.  Add this line to the top level:
    ```json
    "type": "module",
    ```

### 1.3. Install Dependencies

```bash
# (Still in /server)
# Install main dependencies
npm install express pg bcryptjs jsonwebtoken cors dotenv

# (Still in /server)
# Install ALL TypeScript dev dependencies
npm install -D typescript @types/node @types/express @types/pg @types/bcryptjs @types/jsonwebtoken @types/cors tsx
````

- `typescript`: The core compiler.
- `@types/...`: Type definition files for each library.
- `tsx`: A modern, fast, zero-config tool to run TypeScript/ESM files directly (replaces `nodemon` and `ts-node`).

### 1.4. Create TypeScript Config (`tsconfig.json`)

1.  **Run this command:**

    ```bash
    # (Still in /server)
    npx tsc --init
    ```

2.  **Replace** the generated `/server/tsconfig.json` with this modern ESM configuration:

    ```json
    {
      "compilerOptions": {
        "target": "ESNext",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "outDir": "./dist",
        "rootDir": "./src"
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules"]
    }
    ```

### 1.5. Configure Run Scripts

1.  In `/server/package.json`, update the `scripts` section:
    ```json
    "scripts": {
      "dev": "tsx watch src/server.ts",
      "build": "tsc",
      "start": "node dist/server.js"
    }
    ```
    - `npm run dev`: Runs your server with hot-reload using `tsx`.
    - `npm run build`: Compiles your TypeScript to JavaScript in the `/dist` folder.
    - `npm run start`: Runs the compiled JavaScript (for production).

### 1.6. Create Source File

1.  Create a `src` folder inside `/server`:
    ```bash
    # (Still in /server)
    mkdir src
    ```
2.  Create your main file at `/server/src/server.ts`.

---

## 2\. Frontend Setup (Vite + React + TypeScript)

These steps will create and configure the `/client` directory.

### 2.1. Initialize React Project (Vite + TS)

```bash
# Go back to the project's root directory
cd ..

# (You are now in the root)
# Use create-vite with the react-ts template
npx create-vite@latest client --template react-ts

# Navigate into the new client directory
cd client

# (You are now in /client)
# Install React's base dependencies
npm install
```

_Vite automatically creates a `tsconfig.json` for the client with the correct settings._

### 2.2. Install Redux Toolkit & React Router

```bash
# (Make sure you are in /client)
npm install @reduxjs/toolkit react-redux react-router-dom
```

_Your Redux store (`store.ts`) and slices (`mySlice.ts`) will now be TypeScript files._

### 2.3. Install & Configure TailwindCSS v4

All of these commands are run **inside the `/client` directory**.

1.  **Install Tailwind & the Vite Plugin:**

    ```bash
    # (In /client)
    npm install -D tailwindcss@next @tailwindcss/vite
    ```

2.  **Initialize Tailwind:**

    ```bash
    # (In /client)
    # This creates tailwind.config.js
    npx tailwindcss init
    ```

3.  **Configure `tailwind.config.js`:**
    Update `/client/tailwind.config.js` to scan your React components (which are now `.tsx` files):

    ```javascript
    // /client/tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}', // Scans all TS/JS/TSX/JSX files
      ],
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
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

Your full-stack TypeScript environment is now configured.
