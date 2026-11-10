import { describe, it, expect } from 'vitest'
import { useSymptomSelection } from '../useSymptomSelection'
import { symptoms } from '@/content/landing'

describe('useSymptomSelection', () => {
  it('lights the zones of the selected symptom and toggles off on reselect', () => {
    const s = useSymptomSelection(symptoms)
    expect(s.activeZones.value).toEqual([])

    s.select('una-encarnada')
    expect(s.isSelected('una-encarnada')).toBe(true)
    expect(s.isZoneActive('hallux')).toBe(true)
    expect(s.isZoneActive('heel')).toBe(false)

    s.select('una-encarnada')
    expect(s.activeZones.value).toEqual([])
  })

  it('hover previews without changing the selection', () => {
    const s = useSymptomSelection(symptoms)
    s.select('talon')
    s.hover('una-encarnada')
    expect(s.activeId.value).toBe('una-encarnada')
    expect(s.selectedId.value).toBe('talon')
    s.hover(null)
    expect(s.activeId.value).toBe('talon')
  })
})
