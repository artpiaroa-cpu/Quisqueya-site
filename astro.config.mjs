import { defineConfig } from 'astro/config'

// Sitio estático: los datos del catálogo se leen de Supabase en BUILD time
// (vista pública quisqueya_web_products). Deploy: Netlify.
export default defineConfig({
  site: 'https://quisqueyabypiaroa.netlify.app',
  trailingSlash: 'never',
})
