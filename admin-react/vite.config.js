import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'

// Plugin para crear .nojekyll para GitHub Pages
const githubPagesPlugin = () => ({
  name: 'github-pages',
  writeBundle(options, bundle) {
    const outDir = options.dir || 'dist'
    writeFileSync(join(outDir, '.nojekyll'), '')
  }
})

// Plugin vacío - sin interferencia con routing
const simplePlugin = () => ({
  name: 'simple-plugin'
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), githubPagesPlugin(), simplePlugin()],
  base: process.env.NODE_ENV === 'production' ? '/LevelUpGamer_FullStack/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        cliente: 'public/cliente/index.html'
      }
    }
  },
  server: {
    port: 5174,
    host: true,
    open: true,
    proxy: {
      // Proxy para desarrollo local con backend Spring Boot
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    },
    middlewareMode: false,
    fs: {
      allow: ['..']
    },
    // Configuración para SPA - todas las rutas van al index.html principal
    historyApiFallback: {
      // Rutas que deben servir index.html (React Router)
      rewrites: [
        { from: /^\/admin/, to: '/index.html' },
        // Rutas estáticas van a sus archivos HTML
        { from: /^\/cliente/, to: function(context) { 
          return context.parsedUrl.pathname; 
        }}
      ]
    }
  },
  // Configuración para SPA - todas las rutas van al index.html principal
  preview: {
    port: 5176,
    host: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  }
})
