# Quisqueya-site — web editorial de Quisqueya by Piaroa

Landing de presencia + catálogo SIN carrito (CTA por WhatsApp). Es más **tienda que revista**:
el peso va al catálogo; el taller/diseñadora es solo una franja breve.

## Stack
- **Astro 5 estático** (sin adapter). `npm run dev` (puerto 4321) · `npm run build`.
- Deploy: Netlify. Los datos se leen en **BUILD time** — el visitante nunca toca Supabase.
- Repo hermano: el admin es "Piaroa ADM" (React CRA) en `../Piaroa ADM`.

## Datos (regla de oro)
- Leer SOLO la vista `quisqueya_web_products` (Supabase, key publishable en `src/lib/catalog.js` — pública por diseño). NUNCA la tabla `products` directa.
- Regla del catálogo: **la web es un espejo del showroom** (`active AND stock_quisqueya > 0`). Al venderse una pieza, sale sola en el siguiente rebuild.
- Fotos: usar `web_image_url` / `web_image_url_2` (bucket público `web-images`, ya migradas). NUNCA `image_url` de Google Drive.
- Si un producto nuevo aparece sin `web_image_url`: correr `node scripts/web-images/migrate-images.mjs` y luego `recompress-pngs.mjs` en el repo del ADM.
- USD = `price_sale / tasa` con la tasa viva de `app_settings` (fallback 60). Nunca usar `price_usd` de la DB.
- Grupos de navegación: `groupOf()` en `src/lib/catalog.js` → vela / cojin / pieza (muebles y alfombras van dentro de /piezas).

## Diseño (receta congelada — no inventar otra)
- Tokens en `src/styles/global.css`: pergamino `#f6f3ec`, marfil `#fdfcf8`, terracota `#8a4c2a` (ÚNICO acento — un elemento acentuado por pantalla), oliva `#454f39` (secciones oscuras), neutros SIEMPRE cálidos (nunca grises azulados).
- Tipografía: **Fraunces** peso 500 para todo titular (nunca bold 700 en serif), **Manrope** para UI. Labels uppercase 11-12px con letter-spacing.
- Cards 3:4 foto-primero con hover a la 2ª foto; sombra 3 capas; grid 4→3→2.
- Referencias clave: Pampa, The Citizenry, Casa Cubista (modelo sin carrito), Angela Maria Home (tiles con manos, nombres = materiales+medida), Otherland (velas por familia olfativa).

## Contacto (una sola fuente)
- WhatsApp: **18098083008** — solo vía `BIZ`/`waLink()` en `src/lib/catalog.js`. Nunca hardcodear otro número.
- Showroom: C. Max Henríquez Ureña 104, Plaza Cordelia, Los Prados, Santo Domingo.

## Pendiente (fases 3-5)
Fichas por producto con JSON-LD, /velas por familias olfativas (3 notas + frase-lugar), webhook Supabase → Netlify build hook, artes con Gemini (componer fotos reales, nunca producto inventado), renombrado editorial de piezas, dominio propio.

El plan completo vive en la memoria del proyecto Piaroa ADM (`project_quisqueya_web_editorial.md`).
