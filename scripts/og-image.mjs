// Genera public/og-image.png (1200×630) para Open Graph y Twitter, con las fuentes y
// colores de la marca, renderizando HTML en el Chromium de Playwright.
//   node scripts/og-image.mjs
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const fontUrl = (file) => pathToFileURL(path.join(publicDir, 'fonts', file)).href
const footprint = fs
  .readFileSync(path.join(publicDir, 'favicon.svg'), 'utf8')
  .replace(/<rect[^>]*\/>/, '')
  .replace('fill="#ecf0f1"', 'fill="#0f2238"')

const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<style>
  @font-face { font-family: 'Bricolage Grotesque'; src: url('${fontUrl('bricolage-grotesque-latin.woff2')}') format('woff2'); font-weight: 200 800; }
  @font-face { font-family: 'Onest'; src: url('${fontUrl('onest-latin.woff2')}') format('woff2'); font-weight: 100 900; }
  html, body { margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; color: #0f2238; font-family: 'Onest', system-ui, sans-serif;
         background: linear-gradient(160deg, #3498db 0%, #9cc9ea 60%, #ecf0f1 100%); }
  .wrap { position: relative; width: 100%; height: 100%; }
  .text { position: absolute; left: 80px; top: 96px; width: 760px; display: flex; flex-direction: column; gap: 28px; }
  h1 { margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 96px; line-height: 0.98; letter-spacing: -0.03em; }
  .role { font-size: 40px; font-weight: 500; line-height: 1.2; }
  .area { display: inline-flex; align-items: center; gap: 14px; font-size: 28px; font-weight: 500; opacity: 0.85; }
  .mark { position: absolute; right: 90px; top: 80px; width: 300px; height: 470px; opacity: 0.92; }
  .mark svg { width: 100%; height: 100%; }
</style></head>
<body><div class="wrap">
  <div class="text">
    <h1>Rodrigo Lazo</h1>
    <p class="role">Podólogo clínico<br>a domicilio</p>
    <p class="area">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      Región Metropolitana · Chile
    </p>
  </div>
  <div class="mark">${footprint.replace('viewBox="0 0 64 64"', 'viewBox="12 4 40 56"')}</div>
</div></body></html>`

const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'og-')), 'og.html')
fs.writeFileSync(tmp, html)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(tmp).href)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: path.join(publicDir, 'og-image.png'), type: 'png' })
await browser.close()
fs.rmSync(path.dirname(tmp), { recursive: true, force: true })
console.log('og-image.png generado en public/')
