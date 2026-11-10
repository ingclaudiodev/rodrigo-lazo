import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'

import App from '../App'
import { routes } from '../router'
import { brand, hero, notFound } from '../content/landing'

function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return router
    .push(path)
    .then(() => router.isReady())
    .then(() => mount(App, { global: { plugins: [router, createPinia()] } }))
}

describe('App', () => {
  it('renders the landing page sections', async () => {
    const wrapper = await mountAt('/')

    expect(wrapper.text()).toContain(brand.name)
    expect(wrapper.text()).toContain(hero.titleLines[0])
    expect(wrapper.find('#tratamientos').exists()).toBe(true)
    expect(wrapper.find('#sobre-mi').exists()).toBe(true)
    expect(wrapper.find('#agenda').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders the landing page on a section route like /tratamientos', async () => {
    const wrapper = await mountAt('/tratamientos')

    expect(wrapper.text()).toContain(hero.titleLines[0])
    expect(wrapper.find('#tratamientos').exists()).toBe(true)
    expect(wrapper.text()).not.toContain(notFound.title)
    wrapper.unmount()
  })

  it('renders the 404 view with nav and footer on an unknown route', async () => {
    const wrapper = await mountAt('/login')

    expect(wrapper.text()).toContain(brand.name)
    expect(wrapper.text()).toContain(notFound.title)
    expect(wrapper.find('#tratamientos').exists()).toBe(false)
    expect(wrapper.find(`a[href="${notFound.primaryCta.to}"]`).exists()).toBe(true)
    wrapper.unmount()
  })

  it('marks the 404 view as noindex and restores the head when leaving', async () => {
    document.title = 'Título original'
    const wrapper = await mountAt('/login')

    expect(document.title).toContain(notFound.title)
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex',
    )

    wrapper.unmount()
    expect(document.title).toBe('Título original')
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
  })
})
