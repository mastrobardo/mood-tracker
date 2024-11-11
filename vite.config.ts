import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    strictPort: true,
    //browserstack
    host: "0.0.0.0",
    port: 5173,
    middlewareMode: false,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        prependPath: true,
        followRedirects: true,
        toProxy: true,
      },
    },
  },
});
