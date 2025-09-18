import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3004,
    strictPort: true,
    proxy: {
      // Forward /api requests that need /api prefix (jabatan, dashboard)
      "/api/jabatan": {
        target: "http://localhost:8004",
        changeOrigin: true,
      },
      "/api/dashboard": {
        target: "http://localhost:8004",
        changeOrigin: true,
      },
      // Forward other /api requests without /api prefix
      "/api": {
        target: "http://localhost:8004",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
