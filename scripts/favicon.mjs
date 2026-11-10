// Genera favicon.ico (16+32), apple-touch-icon.png (180) e icon-192/512.png a partir de
// public/favicon.svg, renderizándolo con el Chromium de Playwright.
//   node scripts/favicon.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const svg = fs.readFileSync(path.join(publicDir, 'favicon.svg'), 'utf8')
const browser = await chromium.launch()

async function png(size, { bleed = false } = {}) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  })
  // bleed: sin esquinas redondeadas (iOS las aplica solo) y fondo a sangre.
  const body = bleed ? svg.replace('rx="14"', 'rx="0"') : svg
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${body}`,
  )
  const buf = await page.screenshot({ omitBackground: true, type: 'png' })
  await page.close()
  return buf
}

/** Contenedor ICO con imágenes PNG dentro (lo entienden todos los navegadores actuales). */
function ico(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  const entries = []
  let offset = 6 + 16 * images.length
  for (const { size, buf } of images) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(buf.length, 8)
    e.writeUInt32LE(offset, 12)
    entries.push(e)
    offset += buf.length
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.buf)])
}

fs.writeFileSync(
  path.join(publicDir, 'favicon.ico'),
  ico([
    { size: 16, buf: await png(16) },
    { size: 32, buf: await png(32) },
  ]),
)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), await png(180, { bleed: true }))
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), await png(192))
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), await png(512))
await browser.close()
console.log('favicon.ico, apple-touch-icon.png, icon-192.png e icon-512.png generados en public/')
