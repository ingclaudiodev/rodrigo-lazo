import { describe, it, expect } from 'vitest'
import { PainMarkService, type MarkStorage } from '../PainMarkService'

class MemoryStorage implements MarkStorage {
  data = new Map<string, string>()
  getItem(key: string) {
    return this.data.get(key) ?? null
  }
  setItem(key: string, value: string) {
    this.data.set(key, value)
  }
  removeItem(key: string) {
    this.data.delete(key)
  }
}

describe('PainMarkService', () => {
  it('maps the scale to white, yellow and red', () => {
    const s = new PainMarkService(null)
    expect(s.color(1)).toBe('rgb(255, 255, 255)')
    expect(s.color(5)).toBe('rgb(247, 215, 116)')
    expect(s.color(10)).toBe('rgb(224, 86, 75)')
  })

  it('clamps intensity to 1..10', () => {
    const s = new PainMarkService(null)
    expect(s.clampIntensity(0)).toBe(1)
    expect(s.clampIntensity(14)).toBe(10)
    expect(s.clampIntensity(6.6)).toBe(7)
  })

  it('persists marks and reads them back, one per zone', () => {
    const storage = new MemoryStorage()
    const s = new PainMarkService(storage)
    let marks = s.upsert([], { zone: 'heel', kind: 'dolor', intensity: 7 })
    marks = s.upsert(marks, { zone: 'heel', kind: 'molestia', intensity: 3 })
    marks = s.upsert(marks, { zone: 'hallux', kind: 'dolor', intensity: 9 })
    s.save(marks)

    const loaded = new PainMarkService(storage).load()
    expect(loaded).toHaveLength(2)
    expect(loaded.find((m) => m.zone === 'heel')).toMatchObject({ kind: 'molestia', intensity: 3 })

    s.save(s.remove(loaded, 'heel'))
    expect(new PainMarkService(storage).load().map((m) => m.zone)).toEqual(['hallux'])
  })

  it('ignores corrupt storage', () => {
    const storage = new MemoryStorage()
    storage.setItem('rodrigo-lazo.pain-marks.v1', '{not json')
    expect(new PainMarkService(storage).load()).toEqual([])
  })

  it('summarises marks for the contact message', () => {
    const s = new PainMarkService(null)
    const marks = s.upsert([], { zone: 'heel', kind: 'dolor', intensity: 7 })
    expect(s.summary(marks, () => 'talón')).toContain('Talón: dolor 7/10')
    expect(s.summary([], () => '')).toBe('')
  })
})
