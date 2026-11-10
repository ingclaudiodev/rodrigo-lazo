import { defineComponent, ref, type PropType } from 'vue'
import type { ZoneId } from '@/content/landing'
import type { TextureMark } from '@/services/foot3d/footPaint'
import { useFootScene } from '@/composables/useFootScene'
import PodogramaFigure from './PodogramaFigure'

/**
 * Pie completo en 3D (planta y dorso) con el mapa de presión en la planta y las
 * marcas del visitante. Las partes se eligen tocando el modelo. Sin WebGL cae al
 * podograma SVG.
 */
export default defineComponent({
  name: 'FootModel3D',
  props: {
    activeZones: { type: Array as PropType<ZoneId[]>, default: () => [] },
    marks: { type: Array as PropType<TextureMark[]>, default: () => [] },
    selectedZone: { type: String as PropType<ZoneId | null>, default: null },
    caption: { type: String, required: true },
    legend: {
      type: Object as PropType<{ title: string; low: string; high: string }>,
      required: true,
    },
    hint: { type: String, required: true },
    onPick: { type: Function as PropType<(zone: ZoneId | null) => void>, default: undefined },
  },
  setup(props) {
    const container = ref<HTMLElement | null>(null)
    const canvas = ref<HTMLCanvasElement | null>(null)
    const { support } = useFootScene(container, canvas, {
      activeZones: () => props.activeZones,
      marks: () => props.marks,
      selectedZone: () => props.selectedZone,
      onPick: (zone) => props.onPick?.(zone),
    })

    return () => {
      if (support.value === 'unsupported') {
        return (
          <PodogramaFigure
            activeZones={props.activeZones}
            marks={props.marks}
            caption={props.caption}
            legend={props.legend}
          />
        )
      }
      return (
        <figure
          class="podograma foot3d"
          data-mode="3d"
          data-zone-active={props.activeZones.join(' ') || undefined}
          data-zone-selected={props.selectedZone ?? undefined}
        >
          <div ref={container} class="foot3d__stage">
            <canvas ref={canvas} class="foot3d__canvas" role="img" aria-label={props.caption} />
          </div>
          <figcaption class="foot3d__caption">
            <div class="foot3d__legend" aria-hidden="true">
              <span class="foot3d__legend-title">{props.legend.title}</span>
              <span class="foot3d__legend-bar" />
              <span class="foot3d__legend-labels">
                <span>{props.legend.low}</span>
                <span>{props.legend.high}</span>
              </span>
            </div>
            <span class="foot3d__hint">{props.hint}</span>
          </figcaption>
        </figure>
      )
    }
  },
})
