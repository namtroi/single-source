# Setting Up the Development Environment (From Scratch)

This document guides you through setting up the entire `single-source` project from an empty directory, using a full **TypeScript** stack with **ES Modules**.

**Note:** All commands are run from the **project's root directory** unless specified otherwise.

---

## 1. Backend Setup (Express + TypeScript + ESM)

These steps will create and configure the `/server` directory.

### 1.1. Initialize Project & Dependencies

```bash
# In your project's root folder:
mkdir server
cd server

# (You are now in /server)
# Initialize a new Node.js project
npm init -y
```

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
```

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

2.  **Configure `tailwind.config.js`:**
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

3.  **Configure `vite.config.js`:**
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

4.  **Add Tailwind Directives:**
    Replace the contents of `/client/src/index.css` with the Tailwind directives:

    ```css
    /* /client/src/index.css */

    @import 'tailwindcss';
    ```


 ## 3.Iteration Additions (New Requirements Added After Original Setup)

These steps cover all new tools, files, and configs introduced during the project iteration.

## 3.1. Install New Backend Dependencies (SERVER)

# Inside /server

 ```bash
npm install multer @supabase/supabase-js
npm install -D @types/multer
```

## 3.2. Add New Environment Variables (SERVER)

Create or update /server/.env:

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_AVATAR_BUCKET=avatars

## 3.3. Create Supabase Client File (SERVER)

Create /server/src/supabaseClient.ts:

```javascript
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```
## 3.4. Add Multer Upload Middleware (SERVER)

Create /server/src/middleware/upload.middleware.ts:

  ```javascript
import multer from "multer";

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Images only"));
    cb(null, true);
  },
});
```
## 3.5. Add Avatar Upload Route (SERVER)

Update your routes file:

  ```javascript
apiRouter.post(
  "/users/upload",
  authMiddleware.verifyToken,
  uploadAvatar.single("avatar"),
  userController.uploadAvatar
);
```
## 3.6. Add New DB Fields (SERVER)

In your database schema:

`ALTER TABLE users ADD COLUMN profile_image_url TEXT;`
`ALTER TABLE users ADD COLUMN theme_preference JSONB;`

## 3.7. Update GET /users/:username to Return Avatar + Theme (SERVER)

Your controller should now include:
`profile_image_url: user.profile_image_url,`
`theme_preference: user.theme_preference,`

## 4. Frontend Additions (CLIENT)

## 4.1. Tailwind Theme Variable Support (CLIENT)

Update /client/tailwind.config.js:

```javascript
extend: {
  colors: {
    bg: "var(--bg)",
    text: "var(--text)",
    accent: "var(--accent)",
  },
},
darkMode: "class",
```

## 4.2. Add Base CSS Variables (CLIENT)

Edit /client/src/index.css:

```javascript
@import "tailwindcss";

:root {
  --bg: #ffffff;
  --text: #111827;
  --accent: #2563eb;
}
```

## 4.3. Add Theme Engine (CLIENT)

Create `/client/src/app/theme.ts`:

```javascript
export const THEME_STYLES = {
  light: { "--bg": "#fdfdfd", "--text": "#1a1a1a", "--accent": "#3b82f6" },
  dark: { "--bg": "#0c0f1a", "--text": "#e2e8f0", "--accent": "#7dd3fc" },
  calm: { "--bg": "#f8fbff", "--text": "#334155", "--accent": "#6ee7b7" },
  system: { "--bg": "#ffffff", "--text": "#111827", "--accent": "#2563eb" },
};
```

And:

```javascript
export function applyTheme(theme) {
  const vars = THEME_STYLES[theme];
  Object.entries(vars).forEach(([k, v]) =>
    document.documentElement.style.setProperty(k, v)
  );
}
```

## 4.4. Update Redux Auth Slice (CLIENT)
In `/client/src/features/auth/authSlice.ts:`

Add:
`profile_image_url?: string`


Add reducers:

```javascript 
setThemePreference(...)
setProfileImageUrl(...)
```

## 4.5. Add Theme Selector Component (CLIENT)

Add `/client/src/components/changeTheme.tsx`:

```javascript
<select value={theme} onChange={handleThemeChange}>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="calm">Calm</option>
  <option value="system">System</option>
</select>
```

## 4.6. Apply Theme on App Load (CLIENT)

In `App.tsx`:

```javascript
useEffect(() => {
  applyTheme(themePref);
}, [user]);
```

## 4.7. Install Avatar Upload UI (CLIENT)

Create component:

```javascript
<input type="file" accept="image/*" onChange={handleFileChange} />

## 4.8. Add Upload Method in apiService (CLIENT)

uploadAvatar(file) {
  const form = new FormData();
  form.append("avatar", file);
  return api.post("/users/upload", form);
}
```

## 4.9. Display Avatar (CLIENT)

In Dashboard/PublicProfile:

<img src={user.profile_image_url} className="w-24 h-24 rounded-full" />

Your full-stack TypeScript environment is now configured.
