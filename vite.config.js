import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
// https://vite.dev/config/
export default defineConfig({

  plugins: [
    react(),
    svgr(
      {
        svgrOptions: {
          icon: true,
          // This will transform your SVG to a React component
          exportType: "named",
          namedExport: "ReactComponent",
        },
      }
    )
  ],

  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    allowedHosts: ['iater.org'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets'
  },
  base: '/'

})
