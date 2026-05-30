import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.WEB_PORT ?? 5173),
    proxy: {
      "/api": "http://localhost:3001"
    }
  },
  build: {
    // tfjs (~1.5MB) là giới hạn tự nhiên của thư viện — chỉ load khi vào Teachable Machine
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          tfjs: ["@tensorflow/tfjs"],
          icons: ["lucide-react"]
        }
      }
    }
  }
});
