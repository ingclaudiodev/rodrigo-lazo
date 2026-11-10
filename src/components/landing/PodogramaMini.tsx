import { defineComponent, type PropType } from 'vue'
import type { ZoneId } from '@/content/landing'
import { SOLE, TOES, ZONES } from './podograma-geometry'

/** Huella compacta que marca las zonas de un tratamiento. Sin blur ni retícula. */
export default defineComponent({
  name: 'PodogramaMini',
  props: {
    zones: { type: Array as PropType<ZoneId[]>, required: true },
    label: { type: String, required: true },
  },
  setup(props) {
    return () => (
      <svg viewBox="0 0 320 640" role="img" aria-label={props.label} class="podograma-mini">
        <title>{props.label}</title>
        <g class="podograma-mini__sole">
          <path d={SOLE} />
          {TOES.map(([cx, cy, rx, ry]) => (
            <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} />
          ))}
        </g>
        <g class="podograma-mini__zones">
          {ZONES.filter((z) => props.zones.includes(z.id)).map((zone) =>
            zone.blobs.map(([cx, cy, rx, ry]) => (
              <ellipse key={`${zone.id}-${cx}-${cy}`} cx={cx} cy={cy} rx={rx * 0.9} ry={ry * 0.9} />
            )),
          )}
        </g>
      </svg>
    )
  },
})
