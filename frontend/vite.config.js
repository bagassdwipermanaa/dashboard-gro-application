import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3004,
    strictPort: true,
    proxy: {
      // Forward frontend requests to backend during development
      "/api": {
        target: "http://localhost:8004",
        changeOrigin: true,
        // If backend doesn't expect /api prefix, rewrite here
        // Remove the following rewrite if your backend routes already start with /api
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
