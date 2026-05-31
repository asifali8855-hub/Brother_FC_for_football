import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        strategies: 'injectManifest',
        includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml'],
        manifest: {
          name: 'Brother FC - Football Mastery',
          short_name: 'Brother FC',
          description: 'Master football skills with AI-powered training',
          theme_color: '#00FF41',
          background_color: '#000000',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
          categories: ['sports', 'education'],
          screenshots: [
            {
              src: '/screenshot1.png',
              sizes: '540x720',
              type: 'image/png',
              form_factor: 'narrow',
            },
            {
              src: '/screenshot2.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide',
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
