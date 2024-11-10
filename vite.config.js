import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  base: '/Vite_1/',
  build: {
      outDir: 'docs',
      emptyOutDir: true
  }
})
