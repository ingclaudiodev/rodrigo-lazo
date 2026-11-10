import type { ZoneId } from '@/content/landing'

export type PainKind = 'dolor' | 'molestia'

export interface PainMark {
  zone: ZoneId
  kind: PainKind
  /** 1 (apenas perceptible) a 10 (máximo). */
  intensity: number
  updatedAt: string
}

export interface MarkStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export const PAIN_MIN = 1
export const PAIN_MAX = 10
const STORAGE_KEY = 'rodrigo-lazo.pain-marks.v1'

/** Escala de color: 1 blanco → 5 amarillo suave → 10 rojo suave. */
const SCALE: Array<[number, [number, number, number]]> = [
  [1, [255, 255, 255]],
  [5, [247, 215, 116]],
  [10, [224, 86, 75]],
]

/**
 * Guarda y recupera el mapa de dolor/molestia del visitante, y define la escala
 * de color. Sin dependencias de Vue: se prueba sin montar nada.
 */
export class PainMarkService {
  constructor(private readonly storage: MarkStorage | null) {}

  clampIntensity(value: number): number {
    if (!Number.isFinite(value)) return PAIN_MIN
    return Math.min(PAIN_MAX, Math.max(PAIN_MIN, Math.round(value)))
  }

  /** Color CSS para una intensidad de la escala. */
  color(intensity: number): string {
    const v = this.clampIntensity(intensity)
    for (let i = 0; i < SCALE.length - 1; i++) {
      const [a, ca] = SCALE[i]!
      const [b, cb] = SCALE[i + 1]!
      if (v >= a && v <= b) {
        const t = (v - a) / (b - a)
        const mix = ca.map((c, k) => Math.round(c + (cb[k]! - c) * t))
        return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`
      }
    }
    return 'rgb(255, 255, 255)'
  }

  /** Gradiente completo de la escala, para pistas de slider y leyendas. */
  gradient(): string {
    const stops = SCALE.map(
      ([v, c]) => `rgb(${c.join(', ')}) ${((v - PAIN_MIN) / (PAIN_MAX - PAIN_MIN)) * 100}%`,
    )
    return `linear-gradient(to right, ${stops.join(', ')})`
  }

  load(): PainMark[] {
    if (!this.storage) return []
    try {
      const raw = this.storage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed
        .filter(isPainMark)
        .map((m) => ({ ...m, intensity: this.clampIntensity(m.intensity) }))
    } catch {
      return []
    }
  }

  save(marks: PainMark[]): void {
    if (!this.storage) return
    try {
      if (marks.length === 0) this.storage.removeItem(STORAGE_KEY)
      else this.storage.setItem(STORAGE_KEY, JSON.stringify(marks))
    } catch {
      /* almacenamiento no disponible: la sesión sigue funcionando en memoria */
    }
  }

  upsert(marks: PainMark[], mark: Omit<PainMark, 'updatedAt'>): PainMark[] {
    const next = marks.filter((m) => m.zone !== mark.zone)
    next.push({
      ...mark,
      intensity: this.clampIntensity(mark.intensity),
      updatedAt: new Date().toISOString(),
    })
    return next
  }

  remove(marks: PainMark[], zone: ZoneId): PainMark[] {
    return marks.filter((m) => m.zone !== zone)
  }

  /** Resumen legible para adjuntar al mensaje de contacto. */
  summary(marks: PainMark[], zoneLabel: (zone: ZoneId) => string): string {
    if (marks.length === 0) return ''
    const lines = marks.map(
      (m) => `- ${capitalize(zoneLabel(m.zone))}: ${m.kind} ${m.intensity}/10`,
    )
    return `Mapa de molestias marcado en la web:\n${lines.join('\n')}`
  }
}

function isPainMark(value: unknown): value is PainMark {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.zone === 'string' &&
    (v.kind === 'dolor' || v.kind === 'molestia') &&
    typeof v.intensity === 'number' &&
    typeof v.updatedAt === 'string'
  )
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
