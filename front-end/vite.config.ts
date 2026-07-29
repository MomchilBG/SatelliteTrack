import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        'top-level-await': true,
      },
      target: 'esnext',
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
  plugins: [react()],
  worker: {
    format: 'es',
  },
});
