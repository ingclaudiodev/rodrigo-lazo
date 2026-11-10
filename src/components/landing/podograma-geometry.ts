import type { ZoneId } from '@/content/landing'

/** Geometría compartida del podograma. Planta derecha vista como huella; viewBox 320×640. */
export const SOLE =
  'M62 206C56 170 92 150 132 148C192 140 250 150 272 186C288 216 284 256 272 292C256 332 216 344 206 384C198 424 216 462 236 502C252 542 242 602 190 616C150 628 106 616 92 572C80 524 86 472 86 422C86 362 70 302 62 252C58 232 58 218 62 206Z'

/** Dedos: cx, cy, rx, ry. */
export const TOES: Array<[number, number, number, number]> = [
  [226, 96, 44, 48],
  [160, 70, 24, 28],
  [116, 84, 21, 24],
  [82, 108, 19, 22],
  [56, 144, 17, 20],
]

export interface Zone {
  id: ZoneId
  /** Elipses de la zona: cx, cy, rx, ry, intensidad 0..1. */
  blobs: Array<[number, number, number, number, number]>
}

export const ZONES: Zone[] = [
  { id: 'hallux', blobs: [[226, 100, 34, 38, 0.85]] },
  {
    id: 'toes',
    blobs: [
      [160, 72, 16, 18, 0.55],
      [116, 86, 14, 15, 0.45],
      [82, 110, 12, 13, 0.4],
      [56, 146, 11, 12, 0.35],
    ],
  },
  {
    id: 'metatarsal',
    blobs: [
      [236, 214, 40, 36, 0.95],
      [160, 190, 44, 34, 0.8],
      [92, 230, 28, 30, 0.6],
    ],
  },
  { id: 'lateral', blobs: [[100, 380, 26, 70, 0.35]] },
  { id: 'heel', blobs: [[166, 548, 62, 62, 1]] },
]

export const ZONE_LABELS: Record<ZoneId, string> = {
  hallux: 'dedo mayor',
  toes: 'dedos',
  metatarsal: 'metatarso',
  lateral: 'borde externo',
  heel: 'talón',
  dorsum: 'empeine',
  ankle: 'tobillo',
}

/** Orden de presentación de las partes seleccionables. */
export const SELECTABLE_ZONES: ZoneId[] = [
  'hallux',
  'toes',
  'metatarsal',
  'lateral',
  'heel',
  'dorsum',
  'ankle',
]

/** Centro de cada parte en coordenadas de la huella (para pintar marcas en la planta). */
export const ZONE_CENTERS: Partial<Record<ZoneId, [number, number, number, number]>> = {
  metatarsal: [166, 205, 95, 50],
  lateral: [100, 380, 30, 75],
  heel: [166, 548, 60, 60],
}

export function describeZones(zones: ZoneId[]): string {
  if (zones.length >= 5) return 'todo el pie'
  if (zones.length === 0) return ''
  const labels = zones.map((z) => ZONE_LABELS[z])
  if (labels.length <= 1) return labels[0] ?? ''
  return `${labels.slice(0, -1).join(', ')} y ${labels[labels.length - 1]}`
}
