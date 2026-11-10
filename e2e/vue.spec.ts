import { test, expect } from '@playwright/test'

test('renders the landing page with its sections and no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.goto('/')

  await expect(page.locator('h1')).toBeVisible()
  for (const id of ['#tratamientos', '#primera-sesion', '#sobre-mi', '#preguntas', '#agenda']) {
    await expect(page.locator(id)).toBeVisible()
  }
  expect(errors).toEqual([])
})

test('selecting a symptom lights its zone on the podograma', async ({ page }) => {
  await page.goto('/')
  const chip = page.getByRole('button', { name: 'Uña encarnada' })
  await chip.click()
  await expect(chip).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.podograma')).toHaveAttribute('data-zone-active', 'hallux')
  await expect(page.getByText('Onicocriptosis', { exact: false }).first()).toBeVisible()
})

test('contact form is disabled while the recipient is pending', async ({ page }) => {
  await page.goto('/')
  const submit = page.getByRole('button', { name: /enviar/i })
  await expect(submit).toBeDisabled()
  await expect(page.locator('#contact-pending')).toContainText('por confirmar')
})

test('desktop nav shows the section links and the booking button without a menu', async ({
  page,
}) => {
  await page.goto('/')
  const nav = page.locator('header nav[aria-label="Principal"]')
  await expect(nav.getByRole('link', { name: 'Tratamientos' })).toBeVisible()
  await expect(nav.locator('a[href="/agenda"]')).toBeInViewport()
  await expect(page.getByRole('button', { name: /abrir menú/i })).toBeHidden()
})

test('nav highlights the section in view', async ({ page }) => {
  await page.goto('/')
  await page.locator('#primera-sesion').scrollIntoViewIfNeeded()
  await expect(page.locator('header nav a[aria-current="true"]')).toHaveText('Primera sesión')
})

// El modo depende de si el navegador expone WebGL: la rama es el objeto del test.
/* eslint-disable playwright/no-conditional-in-test, playwright/no-conditional-expect */
test('the foot figure reacts to the selected symptom', async ({ page }) => {
  await page.goto('/')
  const figure = page.locator('figure.podograma')
  await expect(figure).toBeVisible()
  const mode = await figure.getAttribute('data-mode')
  await page.getByRole('button', { name: 'Uña encarnada' }).click()
  await expect(figure).toHaveAttribute('data-zone-active', 'hallux')

  if (mode === '3d') {
    // Con WebGL el pie es un canvas three.js: comprobamos que renderiza.
    await expect(figure.locator('canvas')).toBeVisible()
    return
  }
  // Sin WebGL, el podograma SVG debe atenuar las zonas no seleccionadas.
  const opacityOf = (zone: string) =>
    page.locator(`[data-zone="${zone}"]`).evaluate((el) => Number(getComputedStyle(el).opacity))
  await expect.poll(() => opacityOf('heel'), { timeout: 2000 }).toBeLessThan(0.3)
})

test('pain marks are saved, painted and restored after reload', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Parte del pie').selectOption('heel')
  await page.getByRole('button', { name: 'Dolor' }).click()
  await page.getByLabel('Intensidad').fill('8')
  await page.getByRole('button', { name: 'Guardar' }).click()

  const saved = page.getByRole('list', { name: 'Tus marcas' })
  await expect(saved).toContainText('Talón · dolor 8/10')
  await expect(page.locator('#agenda')).toContainText('Tu mapa de molestias se adjuntará')

  await page.reload()
  await expect(page.getByRole('list', { name: 'Tus marcas' })).toContainText('Talón · dolor 8/10')
})
/* eslint-enable playwright/no-conditional-in-test, playwright/no-conditional-expect */
