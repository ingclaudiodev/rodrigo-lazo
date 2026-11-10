import { defineComponent, Transition, type VNode } from 'vue'
import { RouterView } from 'vue-router'
import SiteNav from '@/components/landing/SiteNav'
import SiteFooter from '@/components/landing/SiteFooter'

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <div class="flex min-h-screen flex-col">
        <SiteNav />
        {/* Fundido breve al cambiar de vista (portada ↔ 404). Entre secciones de la portada no aplica: es la misma vista. */}
        <RouterView>
          {{
            default: ({ Component }: { Component: VNode }) => (
              <Transition name="view" mode="out-in">
                {Component}
              </Transition>
            ),
          }}
        </RouterView>
        {/* mt-auto empuja el pie al final cuando la vista es corta (p. ej. la página 404). */}
        <div class="mt-auto bg-primary">
          <SiteFooter />
        </div>
      </div>
    )
  },
})
