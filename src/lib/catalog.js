// ─────────────────────────────────────────────────────────────────────────
//  Acceso al catálogo en BUILD time.
//  Lee SOLO la vista pública quisqueya_web_products (columnas públicas,
//  regla del showroom: active AND stock_quisqueya > 0).
//  La key es la publishable de Supabase: pública por diseño.
// ─────────────────────────────────────────────────────────────────────────

const SB_URL = 'https://kyexrnwpybkdemlesfzf.supabase.co'
const SB_KEY = 'sb_publishable_FI6tR8LxYV-ECuXm9vKIIg_-G4jaEFT'

const HEADERS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }

async function sbGet(path) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HEADERS })
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`)
  return res.json()
}

// Tasa USD viva desde app_settings (misma convención que piaroa-site).
export async function getUsdRate() {
  try {
    const rows = await sbGet('app_settings?key=eq.usd_rate&select=value')
    const v = Number(rows?.[0]?.value)
    return v > 0 ? v : 60
  } catch {
    return 60
  }
}

// Grupo de navegación de un producto: vela | cojin | pieza
export function groupOf(p) {
  if (p.type === 'Vela') return 'vela'
  if (/cojin/i.test(p.type)) return 'cojin'
  return 'pieza'
}

// Normaliza la colección: quita prefijo "COLECCION" y unifica mayúsculas.
export function cleanCollection(c) {
  if (!c) return null
  const s = c.replace(/^COLECCION\s*/i, '').trim()
  if (!s) return null
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export async function getCatalog() {
  const [products, usdRate] = await Promise.all([
    sbGet('quisqueya_web_products?select=*&order=code&limit=1000'),
    getUsdRate(),
  ])
  return { products, usdRate }
}

// Nombre para mostrar: quita el código pegado al final y normaliza
// los nombres que vienen EN MAYÚSCULAS desde el inventario.
export function displayName(p) {
  let n = (p.name || '').trim()
  // quita el código al final, con o sin guion ("CD-177" o "C 239")
  if (p.code) {
    const c = p.code.replace(/[-\s]/, '[-\\s]?')
    n = n.replace(new RegExp(`\\s*${c}\\s*$`, 'i'), '')
  }
  n = n.replace(/\s+[A-Z]{1,3}[-\s]?\d+\s*$/, '').trim()
  // quita la medida al final del nombre (ya se muestra aparte): 54"x68", 100x160…
  n = n.replace(/\s*\d+\s*["”']?\s*[xX×]\s*\d+\s*["”']?\s*$/, '').trim()
  // si viene mayormente EN MAYÚSCULAS (tolera la "x" de las medidas), pásalo a título
  const letters = n.replace(/[^\p{L}]/gu, '')
  const upper = (letters.match(/\p{Lu}/gu) || []).length
  if (letters.length && upper / letters.length > 0.8) {
    n = n.toLowerCase().replace(/(^|[\s(“"'])(\p{L})/gu, (m, a, b) => a + b.toUpperCase())
  }
  return n
}

export function fmtRD(n) {
  return 'RD$' + Number(n || 0).toLocaleString('es-DO', { maximumFractionDigits: 0 })
}

export function fmtUSD(priceSale, usdRate) {
  const v = Math.round(Number(priceSale || 0) / (usdRate || 60))
  return v > 0 ? `US$${v.toLocaleString('en-US')}` : ''
}

// ── Contacto (WhatsApp Business del showroom)
export const BIZ = {
  name: 'Quisqueya by Piaroa',
  phoneDisplay: '+1 (809) 808-3008',
  whatsapp: '18098083008',
  address: 'C. Max Henríquez Ureña 104, Plaza Cordelia, Los Prados, Santo Domingo',
  hours: 'Lunes a sábado · 9:00 am – 6:00 pm',
  instagram: 'https://www.instagram.com/quisqueya_by_piaroa/',
}

export function waLink(message) {
  const text = message || 'Hola, vengo de la página web de Quisqueya by Piaroa.'
  return `https://wa.me/${BIZ.whatsapp}?text=${encodeURIComponent(text)}`
}

export function waProductLink(p, usdRate) {
  return waLink(
    `Hola, me interesa esta pieza del catálogo web: *${p.code}* — ${p.name} (${fmtRD(p.price_sale)}). ¿Está disponible?`
  )
}
