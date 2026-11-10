import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/** Pasado este plazo, lo que siga oculto se muestra aunque el observador no haya avisado. */
const FALLBACK_MS = 2500

/**
 * Hace aparecer las secciones con un fundido corto cuando entran en pantalla.
 *
 * Añade la clase `reveal` a cada sección del contenedor (menos la primera, que está
 * en pantalla al cargar) y `is-visible` cuando el observador la ve por primera vez.
 * Los estilos viven en `main.css`. Sin IntersectionObserver o con
 * `prefers-reduced-motion`, no toca nada: las secciones se ven de inmediato.
 *
 * Red de seguridad: algunos renderizadores sin interfaz (el de Google, Chromium headless)
 * no disparan el observador con scroll programático. Tras `FALLBACK_MS` se muestra todo lo
 * pendiente, para que ninguna captura o rastreo vea secciones en blanco.
 */
export function useSectionReveal(
  container: Ref<HTMLElement | null>,
  selector = ':scope > section:not(:first-child)',
) {
  let observer: IntersectionObserver | null = null
  let fallback: ReturnType<typeof setTimeout> | undefined

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

    const sections = root.querySelectorAll<HTMLElement>(selector)
    for (const section of sections) {
      section.classList.add('reveal')
      observer.observe(section)
    }
    fallback = setTimeout(() => {
      for (const section of sections) section.classList.add('is-visible')
      observer?.disconnect()
    }, FALLBACK_MS)
  })

  onBeforeUnmount(() => {
    clearTimeout(fallback)
    observer?.disconnect()
  })
}
