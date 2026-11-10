import type { ZoneId } from '@/content/landing'
import { ZONES } from '@/components/landing/podograma-geometry'
import {
  ZONE_ORDER,
  footField,
  nailAmount,
  smoothstep,
  toFootprint,
  zoneWeights,
} from './footShape'

/**
 * Color del pie por vértice: piel (con uñas, zonas de apoyo más rosadas y sombra
 * en los pliegues), mapa de presión en la planta, marcas del visitante y la parte
 * seleccionada. Sin dependencias de three.js: se prueba sin WebGL.
 */
export interface FootPalette {
  skin: string
  low: string
  high: string
  accent: string
}

export interface TextureMark {
  zone: ZoneId
  color: string
}

export interface FootPaintState {
  activeZones: ZoneId[]
  marks: TextureMark[]
  selectedZone: ZoneId | null
}

type RGB = [number, number, number]

const ZONE_COUNT = ZONE_ORDER.length
const PRESSURE_OPACITY = 0.9
const MARK_OPACITY = 0.74
const FLUSH: RGB = toLinear('#d98c7c')
const NAIL: RGB = toLinear('#efcbbf')
const CREASE: RGB = [1, 0.72, 0.66]

export class FootPainter {
  readonly count: number
  /** Parte dominante de cada vértice (índice en ZONE_ORDER), para el picking. */
  readonly zoneIndex: Uint8Array
  private readonly weights: Float32Array
  private readonly skin: Float32Array
  private readonly sole: Float32Array
  private readonly footprint: Float32Array
  private readonly low: RGB
  private readonly high: RGB
  private readonly accent: RGB

  constructor(positions: Float32Array, normals: Float32Array, palette: FootPalette) {
    const count = positions.length / 3
    this.count = count
    this.zoneIndex = new Uint8Array(count)
    this.weights = new Float32Array(count * ZONE_COUNT)
    this.skin = new Float32Array(count * 3)
    this.sole = new Float32Array(count)
    this.footprint = new Float32Array(count * 2)
    this.low = toLinear(palette.low)
    this.high = toLinear(palette.high)
    this.accent = toLinear(palette.accent)

    const base = toLinear(palette.skin)
    const w = new Float32Array(ZONE_COUNT)
    for (let v = 0; v < count; v++) {
      const x = positions[v * 3]!
      const y = positions[v * 3 + 1]!
      const z = positions[v * 3 + 2]!
      const nx = normals[v * 3]!
      const ny = normals[v * 3 + 1]!
      const nz = normals[v * 3 + 2]!

      zoneWeights(x, y, z, ny, w)
      let best = 0
      for (let i = 0; i < ZONE_COUNT; i++) {
        this.weights[v * ZONE_COUNT + i] = w[i]!
        if (w[i]! > w[best]!) best = i
      }
      this.zoneIndex[v] = best

      const sole = (1 - smoothstep(-0.75, -0.3, ny)) * (1 - smoothstep(0.12, 0.26, y))
      this.sole[v] = sole
      const { fx, fy } = toFootprint(x, z)
      this.footprint[v * 2] = fx
      this.footprint[v * 2 + 1] = fy

      // Piel: la planta es más clara; talón, metatarso y yemas, más rosados.
      let support = 0
      for (const zone of ZONES) {
        for (const blob of zone.blobs) support = Math.max(support, blobCoverage(fx, fy, blob))
      }
      const tone = 1 + 0.07 * (valueNoise(x * 7, y * 7, z * 7) - 0.5)
      const underside = smoothstep(0.1, -0.5, ny)
      let r = base[0] * tone * (1 + 0.1 * underside)
      let g = base[1] * tone * (1 + 0.06 * underside)
      let b = base[2] * tone * (1 + 0.04 * underside)
      const toeTip = smoothstep(0.95, 1.2, z + Math.abs(x + 0.1) * 0.45) * (1 - underside)
      const flush = Math.min(1, 0.5 * sole * support + 0.22 * toeTip)
      r += (FLUSH[0] - r) * flush
      g += (FLUSH[1] - g) * flush
      b += (FLUSH[2] - b) * flush
      const nail = nailAmount(x, y, z) * smoothstep(0.1, 0.5, ny)
      r += (NAIL[0] - r) * nail * 0.75
      g += (NAIL[1] - g) * nail * 0.75
      b += (NAIL[2] - b) * nail * 0.75

      // Oclusión en pliegues (entre dedos, bajo los maléolos), con tinte cálido.
      const near = Math.min(
        1,
        Math.max(0, footField(x + nx * 0.05, y + ny * 0.05, z + nz * 0.05) / 0.05),
      )
      const wide = Math.min(
        1,
        Math.max(0, footField(x + nx * 0.14, y + ny * 0.14, z + nz * 0.14) / 0.14),
      )
      const shade = 1 - (near * 0.6 + wide * 0.4)
      this.skin[v * 3] = r * (1 - shade * (1 - CREASE[0])) * (1 - shade * 0.42)
      this.skin[v * 3 + 1] = g * (1 - shade * (1 - CREASE[1])) * (1 - shade * 0.42)
      this.skin[v * 3 + 2] = b * (1 - shade * (1 - CREASE[2])) * (1 - shade * 0.42)
    }
  }

  /** Escribe en `out` (RGB por vértice, lineal) el color para el estado dado. */
  paint(state: FootPaintState, out: Float32Array): Float32Array {
    const { activeZones, marks, selectedZone } = state
    const hasSelection = activeZones.length > 0
    const active = ZONE_ORDER.map((z) => activeZones.includes(z))
    const markColors = marks
      .map((m) => ({ index: ZONE_ORDER.indexOf(m.zone), color: toLinear(m.color) }))
      .filter((m) => m.index >= 0)
    const selected = selectedZone ? ZONE_ORDER.indexOf(selectedZone) : -1
    const { low, high, accent } = this

    for (let v = 0; v < this.count; v++) {
      let r = this.skin[v * 3]!
      let g = this.skin[v * 3 + 1]!
      let b = this.skin[v * 3 + 2]!
      const at = v * ZONE_COUNT

      // Mapa de presión, solo en la planta.
      const sole = this.sole[v]!
      if (sole > 0.01) {
        const fx = this.footprint[v * 2]!
        const fy = this.footprint[v * 2 + 1]!
        for (const zone of ZONES) {
          const dim = hasSelection && !activeZones.includes(zone.id) ? 0.18 : 1
          for (const blob of zone.blobs) {
            const cover = blobCoverage(fx, fy, blob)
            if (cover <= 0) continue
            const k = blob[4]
            const a = (0.55 + k * 0.45) * dim * cover * sole * PRESSURE_OPACITY
            const c = k > 0.7 ? high : low
            r += (c[0] - r) * a
            g += (c[1] - g) * a
            b += (c[2] - b) * a
          }
        }
      }

      // Partes activas fuera de la planta (dedos, empeine, tobillo).
      if (hasSelection) {
        for (let i = 0; i < ZONE_COUNT; i++) {
          if (!active[i]) continue
          const a = this.weights[at + i]! * (1 - sole) * 0.5
          r += (accent[0] - r) * a
          g += (accent[1] - g) * a
          b += (accent[2] - b) * a
        }
      }

      // Marcas del visitante, encima de todo.
      for (const mark of markColors) {
        const a = this.weights[at + mark.index]! * MARK_OPACITY
        r += (mark.color[0] - r) * a
        g += (mark.color[1] - g) * a
        b += (mark.color[2] - b) * a
      }

      // Parte seleccionada para editar: contorno marcado y relleno tenue.
      if (selected >= 0) {
        const w = this.weights[at + selected]!
        const edge = Math.max(0, 1 - Math.abs(w - 0.5) / 0.32)
        const a = Math.min(1, edge * 0.85 + w * 0.14)
        r += (accent[0] - r) * a
        g += (accent[1] - g) * a
        b += (accent[2] - b) * a
      }

      out[v * 3] = r
      out[v * 3 + 1] = g
      out[v * 3 + 2] = b
    }
    return out
  }
}

/** Cobertura (0..1) de una elipse de presión de la huella en un punto. */
function blobCoverage(
  fx: number,
  fy: number,
  blob: readonly [number, number, number, number, number],
): number {
  const dx = (fx - blob[0]) / blob[2]
  const dy = (fy - blob[1]) / blob[3]
  const d2 = dx * dx + dy * dy
  if (d2 > 1.7) return 0
  return 1 - smoothstep(0.3, 1.3, Math.sqrt(d2))
}

/** Color CSS (#hex o rgb()) a RGB lineal. */
export function toLinear(color: string): RGB {
  let rgb: number[]
  const fn = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (fn) {
    rgb = [Number(fn[1]), Number(fn[2]), Number(fn[3])]
  } else {
    const h = color.replace('#', '')
    const full =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h
    rgb = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
    if (rgb.some((n) => Number.isNaN(n))) rgb = [52, 152, 219]
  }
  const lin = (n: number) => {
    const c = n / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return [lin(rgb[0]!), lin(rgb[1]!), lin(rgb[2]!)]
}

function hash(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return s - Math.floor(s)
}

/** Ruido de valor suave en 3D (0..1), para que la piel no sea un color plano. */
function valueNoise(x: number, y: number, z: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = x - ix
  const fy = y - iy
  const fz = z - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const uz = fz * fz * (3 - 2 * fz)
  const mix = (a: number, b: number, t: number) => a + (b - a) * t
  const at = (dx: number, dy: number, dz: number) => hash(ix + dx, iy + dy, iz + dz)
  return mix(
    mix(mix(at(0, 0, 0), at(1, 0, 0), ux), mix(at(0, 1, 0), at(1, 1, 0), ux), uy),
    mix(mix(at(0, 0, 1), at(1, 0, 1), ux), mix(at(0, 1, 1), at(1, 1, 1), ux), uy),
    uz,
  )
}
