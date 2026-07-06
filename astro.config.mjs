import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// Sitio estático: los datos del catálogo se leen de Supabase en BUILD time
// (vista pública quisqueya_web_products). Deploy: Netlify (quisqueya-web).
export default defineConfig({
  site: 'https://quisqueya-web.netlify.app',
  trailingSlash: 'never',
  integrations: [sitemap()],
})
