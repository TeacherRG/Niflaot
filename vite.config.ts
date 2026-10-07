import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — so the build works from any sub-path (GitHub Pages, mychitas.app/niflaot/…)
export default defineConfig({
  base: './',
  plugins: [react()],
});
