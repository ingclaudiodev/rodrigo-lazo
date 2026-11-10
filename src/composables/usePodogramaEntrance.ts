import { onMounted, type Ref } from 'vue'
import { animate, stagger } from 'animejs'

/**
 * Entrada única del podograma: las zonas de presión florecen de talón a dedos.
 * Con `prefers-reduced-motion` no anima nada; el SVG ya es visible por defecto.
 */
export function usePodogramaEntrance(root: Ref<SVGSVGElement | null>) {
  onMounted(() => {
    const svg = root.value
    if (!svg) return
    if (typeof window.matchMedia !== 'function') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const zones = Array.from(svg.querySelectorAll<SVGElement>('[data-zone]'))
    const legend = svg.querySelector<SVGElement>('[data-legend]')
    if (zones.length === 0) return

    // Orden: talón → lateral → metatarso → dedos → hallux (como una pisada).
    const order: Record<string, number> = { heel: 0, lateral: 1, metatarsal: 2, toes: 3, hallux: 4 }
    zones.sort((a, b) => (order[a.dataset.zone ?? ''] ?? 9) - (order[b.dataset.zone ?? ''] ?? 9))

    animate(zones, {
      opacity: [0, 1],
      scale: [0.7, 1],
      duration: 700,
      delay: stagger(110),
      ease: 'outExpo',
      // Al terminar, devolver el control a las clases CSS (--dim / --on):
      // un `opacity` inline ganaría a la hoja de estilos para siempre.
      onComplete: () => {
        for (const zone of zones) {
          zone.style.removeProperty('opacity')
          zone.style.removeProperty('transform')
        }
      },
    })

    if (legend) {
      animate(legend, { opacity: [0, 1], duration: 500, delay: 500, ease: 'outQuad' })
    }
  })
}
