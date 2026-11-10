import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * Hace aparecer las secciones con un fundido corto cuando entran en pantalla.
 *
 * Añade la clase `reveal` a cada sección del contenedor (menos la primera, que está
 * en pantalla al cargar) y `is-visible` cuando el observador la ve por primera vez.
 * Los estilos viven en `main.css`. Sin IntersectionObserver o con
 * `prefers-reduced-motion`, no toca nada: las secciones se ven de inmediato.
 */
export function useSectionReveal(
  container: Ref<HTMLElement | null>,
  selector = ':scope > section:not(:first-child)',
) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const root = container.value
    if (!root || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )

    for (const section of root.querySelectorAll<HTMLElement>(selector)) {
      section.classList.add('reveal')
      observer.observe(section)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())
}
