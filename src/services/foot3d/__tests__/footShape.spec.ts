import { describe, it, expect } from 'vitest'
import { FOOT_BOUNDS, classifyFootPoint, footField } from '../footShape'
import { meshField } from '../surfaceNets'
import { FootPainter } from '../footPaint'

const palette = { skin: '#d7a98d', low: '#3498db', high: '#1abc9c', accent: '#1abc9c' }

describe('footShape', () => {
  it('is solid inside the foot and empty around it', () => {
    expect(footField(0, 0.3, -0.9)).toBeLessThan(0)
    expect(footField(0.27, 0.12, 1.1)).toBeLessThan(0)
    expect(footField(0, 0.3, 1.42)).toBeGreaterThan(0)
    expect(footField(0, -0.05, 0)).toBeGreaterThan(0)
  })

  it('classifies surface points into the selectable parts', () => {
    expect(classifyFootPoint(0, 0.02, -1.0, -1)).toBe('heel')
    expect(classifyFootPoint(0.27, 0.24, 1.12, 1)).toBe('hallux')
    expect(classifyFootPoint(-0.22, 0.15, 1.1, 1)).toBe('toes')
    expect(classifyFootPoint(0.1, 0.02, 0.55, -1)).toBe('metatarsal')
    expect(classifyFootPoint(-0.3, 0.02, -0.2, -1)).toBe('lateral')
    expect(classifyFootPoint(0.05, 0.6, 0, 1)).toBe('dorsum')
    expect(classifyFootPoint(0.25, 1.0, -0.75, 0)).toBe('ankle')
  })
})

describe('foot mesh and paint', () => {
  const mesh = meshField(footField, { ...FOOT_BOUNDS, cell: 0.06 })
  const painter = new FootPainter(mesh.positions, mesh.normals, palette)

  it('builds a closed mesh that sits on the surface', () => {
    expect(mesh.indices.length % 3).toBe(0)
    expect(painter.count).toBeGreaterThan(1000)
    let worst = 0
    for (let v = 0; v < painter.count; v++) {
      const d = footField(
        mesh.positions[v * 3]!,
        mesh.positions[v * 3 + 1]!,
        mesh.positions[v * 3 + 2]!,
      )
      worst = Math.max(worst, Math.abs(d))
    }
    expect(worst).toBeLessThan(0.03)
  })

  it('paints a mark only over its part of the foot', () => {
    const plain = painter.paint(
      { activeZones: [], marks: [], selectedZone: null },
      new Float32Array(painter.count * 3),
    )
    const marked = painter.paint(
      { activeZones: [], marks: [{ zone: 'heel', color: 'rgb(224, 86, 75)' }], selectedZone: null },
      new Float32Array(painter.count * 3),
    )
    let heelChanged = 0
    let toesChanged = 0
    for (let v = 0; v < painter.count; v++) {
      const changed = Math.abs(marked[v * 3 + 1]! - plain[v * 3 + 1]!) > 0.01
      if (!changed) continue
      if (mesh.positions[v * 3 + 2]! < -0.6) heelChanged++
      if (mesh.positions[v * 3 + 2]! > 0.8) toesChanged++
    }
    expect(heelChanged).toBeGreaterThan(50)
    expect(toesChanged).toBe(0)
  })
})
