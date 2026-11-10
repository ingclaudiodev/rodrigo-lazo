import { onBeforeUnmount, onMounted, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

/** Frames que se espera a que las secciones aparezcan en el DOM (cubre la transición entre vistas). */
const MAX_WAIT_FRAMES = 60

/**
 * Observa qué sección está visible en pantalla y expone su id.
 * Útil para resaltar el enlace activo en la navegación.
 *
 * Si `sectionIds` cambia (p. ej. al navegar a otra ruta y volver), vuelve a
 * buscar los elementos en el DOM y reinicia el observador. Como la vista nueva
 * puede entrar con una transición, reintenta durante unos frames hasta encontrarlos.
 */
export function useActiveSection(
  sectionIds: MaybeRefOrGetter<string[]>,
  options: IntersectionObserverInit = { rootMargin: '-40% 0px -55% 0px' },
) {
  const activeId = ref<string | null>(null)
  let observer: IntersectionObserver | null = null
  let pendingFrame = 0

  const stop = () => {
    cancelAnimationFrame(pendingFrame)
    observer?.disconnect()
    observer = null
  }

  const observe = () => {
    stop()
    activeId.value = null
    if (typeof IntersectionObserver === 'undefined') return
    const ids = toValue(sectionIds)
    if (ids.length === 0) return

    let frames = 0
    const attempt = () => {
      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
      if (elements.length === 0 && frames++ < MAX_WAIT_FRAMES) {
        pendingFrame = requestAnimationFrame(attempt)
        return
      }
      observer = new IntersectionObserver((entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) activeId.value = visible.target.id
      }, options)
      for (const el of elements) observer.observe(el)
    }
    attempt()
  }

  onMounted(observe)
  // `flush: 'post'` espera a que la vista nueva esté en el DOM antes de buscar las secciones.
  watch(() => toValue(sectionIds), observe, { flush: 'post' })
  onBeforeUnmount(stop)

  const isActive = (id: string) => activeId.value === id

  return { activeId, isActive }
}
