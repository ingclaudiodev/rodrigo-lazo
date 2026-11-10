import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TreatmentsSection from '../TreatmentsSection'
import { treatments } from '@/content/landing'

describe('TreatmentsSection (TSX)', () => {
  it('renders one row per treatment with its clinical name', () => {
    const wrapper = mount(() => <TreatmentsSection />)
    const rows = wrapper.findAll('#tratamientos > div > ul > li')
    expect(rows).toHaveLength(treatments.length)
    expect(wrapper.text()).toContain(treatments[0]!.clinical)
  })
})
