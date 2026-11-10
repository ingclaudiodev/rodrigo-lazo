import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import type { ZoneId } from '@/content/landing'
import type { FootScene } from '@/services/foot3d/FootScene'
import type { TextureMark } from '@/services/foot3d/footPaint'

export type FootSceneSupport = 'pending' | 'webgl' | 'unsupported'

export interface FootSceneBindings {
  activeZones: () => ZoneId[]
  marks: () => TextureMark[]
  selectedZone: () => ZoneId | null
  onPick?: (zone: ZoneId | null) => void
}

/**
 * Ciclo de vida del pie 3D: detecta WebGL, carga three.js y la malla del pie bajo demanda,
 * redimensiona con el contenedor, pausa fuera de pantalla y sincroniza zonas, marcas y selección.
 */
export function useFootScene(
  container: Ref<HTMLElement | null>,
  canvas: Ref<HTMLCanvasElement | null>,
  bindings: FootSceneBindings,
) {
  const support = ref<FootSceneSupport>('pending')
  let scene: FootScene | null = null
  let resizeObserver: ResizeObserver | null = null
  let intersection: IntersectionObserver | null = null

  const readPalette = (el: HTMLElement) => {
    const css = getComputedStyle(el)
    const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback
    const accent = v('--color-accent', '#1abc9c')
    return {
      skin: '#d7a98d',
      low: v('--color-primary', '#3498db'),
      high: accent,
      accent,
    }
  }

  onMounted(async () => {
    const el = container.value
    const cv = canvas.value
    if (!el || !cv) {
      support.value = 'unsupported'
      return
    }
    const probe = document.createElement('canvas')
    const gl = probe.getContext('webgl2') ?? probe.getContext('webgl')
    if (!gl) {
      support.value = 'unsupported'
      return
    }

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    try {
      const [{ FootScene }, { loadFootMesh }] = await Promise.all([
        import('@/services/foot3d/FootScene'),
        import('@/services/foot3d/footMesh'),
      ])
      const mesh = await loadFootMesh()
      if (!canvas.value) return
      scene = new FootScene(cv, mesh, {
        reducedMotion,
        palette: readPalette(el),
        onPick: bindings.onPick,
      })
      support.value = 'webgl'
      scene.resize(el.clientWidth, el.clientHeight)
      scene.setMarks(bindings.marks())
      scene.setSelectedZone(bindings.selectedZone())
      scene.setActiveZones(bindings.activeZones())
      scene.start()

      resizeObserver = new ResizeObserver(() => scene?.resize(el.clientWidth, el.clientHeight))
      resizeObserver.observe(el)
      if (typeof IntersectionObserver !== 'undefined') {
        intersection = new IntersectionObserver(
          ([entry]) => scene?.setVisible(Boolean(entry?.isIntersecting)),
          { threshold: 0.05 },
        )
        intersection.observe(el)
      }
    } catch {
      support.value = 'unsupported'
    }
  })

  watch(bindings.activeZones, (zones) => scene?.setActiveZones(zones))
  watch(bindings.marks, (marks) => scene?.setMarks(marks), { deep: true })
  watch(bindings.selectedZone, (zone) => scene?.setSelectedZone(zone))

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    intersection?.disconnect()
    scene?.dispose()
    scene = null
  })

  return { support }
}
