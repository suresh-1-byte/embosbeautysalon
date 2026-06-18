import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Firebase into its own chunk
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          // Framer Motion into its own chunk
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer-motion';
          }
          // Supabase into its own chunk
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // DO NOT split React — keep it in the main vendor chunk
          // Splitting React causes forwardRef undefined errors
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
