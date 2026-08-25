import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'
import { allowedFsRoots } from './src/lib/allowedFsRoots'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: allowedFsRoots(),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: [...configDefaults.exclude, '**/.worktrees/**'],
  },
})
