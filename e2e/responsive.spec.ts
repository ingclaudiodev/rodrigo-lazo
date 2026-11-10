import { test, expect } from '@playwright/test'

/**
 * Responsividad: corre en escritorio y en los proyectos móviles (Pixel 7, iPhone 14).
 * Falla si la página desborda horizontalmente.
 * El menú móvil se prueba en `responsive.mobile.spec.ts`, que solo corre en los proyectos móviles.
 */
test('the page never scrolls horizontally', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#agenda')).toBeAttached()
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
})

test('the 404 page keeps the footer at the bottom and never scrolls horizontally', async ({
  page,
}) => {
  await page.goto('/no-existe')
  await expect(page.locator('footer')).toBeVisible()
  const { footerBottom, viewport, scrollWidth, clientWidth } = await page.evaluate(() => ({
    footerBottom: Math.round(
      document.querySelector('footer')!.parentElement!.getBoundingClientRect().bottom,
    ),
    viewport: window.innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(footerBottom).toBeGreaterThanOrEqual(viewport)
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
})
