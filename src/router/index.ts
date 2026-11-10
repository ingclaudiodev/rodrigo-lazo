import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { sectionIds } from '@/content/landing'
import HomeView from '@/views/HomeView'
import NotFoundView from '@/views/NotFoundView'

/** Altura del header fijo: la sección queda justo debajo. Coincide con `scroll-padding-top`. */
const HEADER_OFFSET = 80

/**
 * Tabla de rutas. Todas son públicas.
 * La portada responde en `/` y en `/<sección>` (`/tratamientos`, `/agenda`…): misma vista,
 * desplazada a la sección. La última ruta captura cualquier URL desconocida.
 */
export const routes: RouteRecordRaw[] = [
  { path: `/:section(${sectionIds.join('|')})?`, name: 'home', component: HomeView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

/** Espera (unos frames) a que la sección exista en el DOM: en la carga inicial la vista aún no está montada. */
async function waitForElement(id: string, frames = 30): Promise<boolean> {
  for (let i = 0; i < frames; i++) {
    if (document.getElementById(id)) return true
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }
  return false
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  async scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    const section = to.params.section
    if (typeof section === 'string' && section && (await waitForElement(section))) {
      return { el: `#${section}`, top: HEADER_OFFSET, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
