// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: /* '0.0.0.0' */ true,
    port: process.env.PORT || 3000, // Usa el puerto asignado por Render
    allowedHosts: ['backpwa-741q.onrender.com'],
  },
});
