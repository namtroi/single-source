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
  server: {
    port: 3000, // your frontend port
    proxy: {
      '/api': 'http://localhost:8080', // 👈 proxy all /api requests to backend
    },
  },
});
