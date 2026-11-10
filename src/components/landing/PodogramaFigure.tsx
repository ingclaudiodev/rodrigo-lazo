import { defineComponent, ref, type PropType } from 'vue'
import type { ZoneId } from '@/content/landing'
import { usePodogramaEntrance } from '@/composables/usePodogramaEntrance'

import { SOLE, TOES, ZONES, ZONE_CENTERS } from './podograma-geometry'
import type { TextureMark } from '@/services/foot3d/footPaint'

export default defineComponent({
  name: 'PodogramaFigure',
  props: {
    activeZones: { type: Array as PropType<ZoneId[]>, default: () => [] },
    marks: { type: Array as PropType<TextureMark[]>, default: () => [] },
    caption: { type: String, required: true },
    legend: {
      type: Object as PropType<{ title: string; low: string; high: string }>,
      required: true,
    },
  },
  setup(props) {
    const root = ref<SVGSVGElement | null>(null)
    usePodogramaEntrance(root)

    const hasSelection = () => props.activeZones.length > 0
    const isOn = (id: ZoneId) => props.activeZones.includes(id)

    return () => (
      <figure class="podograma" data-zone-active={props.activeZones.join(' ') || undefined}>
        <svg
          ref={root}
          viewBox="0 0 320 640"
          role="img"
          aria-labelledby="podograma-title"
          class="podograma__svg"
        >
          <title id="podograma-title">{props.caption}</title>
          <defs>
            <pattern id="pg-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M16 0H0V16" fill="none" stroke="currentColor" stroke-width="0.6" />
            </pattern>
            <pattern id="pg-grid-major" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M80 0H0V80" fill="none" stroke="currentColor" stroke-width="1" />
            </pattern>
            <clipPath id="pg-sole-clip">
              <path d={SOLE} />
              {TOES.map(([cx, cy, rx, ry]) => (
                <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} />
              ))}
            </clipPath>
            <filter id="pg-soft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <radialGradient id="pg-fade" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0.55" stop-color="white" />
              <stop offset="1" stop-color="black" />
            </radialGradient>
            <mask id="pg-grid-mask">
              <rect width="320" height="640" fill="url(#pg-fade)" />
            </mask>
            <linearGradient id="pg-scale" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stop-color="var(--color-primary)" />
              <stop offset="1" stop-color="var(--color-accent)" />
            </linearGradient>
          </defs>

          {/* Papel milimetrado */}
          <g class="podograma__grid" mask="url(#pg-grid-mask)">
            <rect width="320" height="640" fill="url(#pg-grid)" />
            <rect width="320" height="640" fill="url(#pg-grid-major)" />
          </g>

          {/* Huella base */}
          <g class="podograma__sole">
            <path d={SOLE} />
            {TOES.map(([cx, cy, rx, ry]) => (
              <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} />
            ))}
          </g>

          {/* Zonas de presión, recortadas por la huella */}
          <g clip-path="url(#pg-sole-clip)" filter="url(#pg-soft)">
            {ZONES.map((zone) => (
              <g
                key={zone.id}
                data-zone={zone.id}
                class={[
                  'podograma__zone',
                  {
                    'podograma__zone--on': isOn(zone.id),
                    'podograma__zone--dim': hasSelection() && !isOn(zone.id),
                  },
                ]}
              >
                {zone.blobs.map(([cx, cy, rx, ry, k]) => (
                  <ellipse
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    rx={rx}
                    ry={ry}
                    fill={k > 0.7 ? 'var(--color-accent)' : 'var(--color-primary)'}
                    opacity={0.35 + k * 0.55}
                  />
                ))}
              </g>
            ))}
          </g>

          {/* Marcas de dolor/molestia del visitante */}
          <g clip-path="url(#pg-sole-clip)" filter="url(#pg-soft)" class="podograma__marks">
            {props.marks.map((mark) => {
              if (mark.zone === 'hallux' || mark.zone === 'toes') {
                return ZONES.find((z) => z.id === mark.zone)?.blobs.map(([cx, cy, rx, ry]) => (
                  <ellipse
                    key={`${mark.zone}-${cx}`}
                    cx={cx}
                    cy={cy}
                    rx={rx}
                    ry={ry}
                    fill={mark.color}
                    opacity={0.9}
                  />
                ))
              }
              const spot = ZONE_CENTERS[mark.zone]
              if (!spot) return null
              const [cx, cy, rx, ry] = spot
              return (
                <ellipse
                  key={mark.zone}
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  fill={mark.color}
                  opacity={0.9}
                />
              )
            })}
          </g>

          {/* Anillos de foco por zona activa (sin blur) */}
          <g class="podograma__rings">
            {ZONES.filter((z) => isOn(z.id)).map((zone) =>
              zone.blobs.map(([cx, cy, rx, ry]) => (
                <ellipse
                  key={`${zone.id}-${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  rx={rx + 10}
                  ry={ry + 10}
                  class="podograma__ring"
                />
              )),
            )}
          </g>

          {/* Leyenda */}
          <g data-legend class="podograma__legend" transform="translate(12 22)">
            <text x="0" y="-10" class="podograma__legend-title">
              {props.legend.title}
            </text>
            <rect x="0" y="0" width="120" height="8" rx="4" fill="url(#pg-scale)" />
            <text x="0" y="24" class="podograma__legend-label">
              {props.legend.low}
            </text>
            <text x="120" y="24" text-anchor="end" class="podograma__legend-label">
              {props.legend.high}
            </text>
          </g>
        </svg>
      </figure>
    )
  },
})
