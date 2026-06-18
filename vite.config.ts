import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    // Raise chunk warning threshold slightly — large vendor libs are expected
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split large vendor libraries into separate cacheable chunks
        manualChunks(id) {
          // Firebase into its own chunk (heavy, rarely changes)
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
          // React core into its own chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          // Everything else from node_modules into a general vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
