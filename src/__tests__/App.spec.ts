import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'

import App from '../App'
import HomeView from '../views/HomeView'
import { brand, hero } from '../content/landing'

describe('App', () => {
  it('renders the landing page sections', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: HomeView }],
    })
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, { global: { plugins: [router, createPinia()] } })

    expect(wrapper.text()).toContain(brand.name)
    expect(wrapper.text()).toContain(hero.titleLines[0])
    expect(wrapper.find('#tratamientos').exists()).toBe(true)
    expect(wrapper.find('#sobre-mi').exists()).toBe(true)
    expect(wrapper.find('#agenda').exists()).toBe(true)
  })
})
