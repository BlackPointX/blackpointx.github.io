
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Gwarantuje poprawne ładowanie assetów na GitHub Pages
});
