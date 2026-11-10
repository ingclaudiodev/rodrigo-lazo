import { onBeforeUnmount, onMounted, ref, toValue, type MaybeRefOrGetter } from 'vue'

/**
 * Observa qué sección está visible en pantalla y expone su id.
 * Útil para resaltar el enlace activo en la navegación.
 */
export function useActiveSection(
  sectionIds: MaybeRefOrGetter<string[]>,
  options: IntersectionObserverInit = { rootMargin: '-40% 0px -55% 0px' },
) {
  const activeId = ref<string | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') return

    observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting)
      if (visible) activeId.value = visible.target.id
    }, options)

    for (const id of toValue(sectionIds)) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  const isActive = (id: string) => activeId.value === id

  return { activeId, isActive }
}
