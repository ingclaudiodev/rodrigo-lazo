import { test, expect } from '@playwright/test'

/** Solo corre en los proyectos móviles (ver `testMatch` en playwright.config.ts). */
test('the mobile menu opens, shows the booking link and closes', async ({ page }) => {
  await page.goto('/')
  const open = page.getByRole('button', { name: /abrir menú/i })
  await expect(open).toBeVisible()
  await open.click()
  await expect(page.locator('#site-nav-mobile')).toBeVisible()
  await expect(
    page.locator('#site-nav-mobile').getByRole('link', { name: 'Agendar una hora' }),
  ).toBeVisible()
  await page.getByRole('button', { name: /cerrar menú/i }).click()
  await expect(page.locator('#site-nav-mobile')).toBeHidden()
})

test('tapping a menu link navigates to the section and closes the menu', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /abrir menú/i }).click()
  await page.locator('#site-nav-mobile').getByRole('link', { name: 'Preguntas' }).click()
  await expect(page).toHaveURL(/\/preguntas$/)
  await expect(page.locator('#site-nav-mobile')).toBeHidden()
  await expect(page.locator('#preguntas')).toBeInViewport()
})

test('the booking CTA of the hero is inside the first screen on mobile', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#inicio a[href="/agenda"]').first()).toBeInViewport()
})
