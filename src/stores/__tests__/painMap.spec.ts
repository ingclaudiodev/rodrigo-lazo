import { beforeEach, describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePainMapStore } from '../painMap'

describe('painMap store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  it('saves the draft for the selected zone and exposes a summary', () => {
    const store = usePainMapStore()
    store.select('heel')
    store.draftKind = 'dolor'
    store.draftIntensity = 8
    store.saveDraft()

    expect(store.marks).toHaveLength(1)
    expect(store.markFor('heel')).toMatchObject({ kind: 'dolor', intensity: 8 })
    expect(store.summary).toContain('Talón: dolor 8/10')
    expect(window.localStorage.getItem('rodrigo-lazo.pain-marks.v1')).toContain('"heel"')
  })

  it('loads the existing mark into the draft when reselecting', () => {
    const store = usePainMapStore()
    store.select('hallux')
    store.draftKind = 'molestia'
    store.draftIntensity = 4
    store.saveDraft()
    store.select(null)
    store.draftIntensity = 9
    store.select('hallux')
    expect(store.draftIntensity).toBe(4)
    expect(store.draftKind).toBe('molestia')
  })
})
