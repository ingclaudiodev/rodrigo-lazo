import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ZoneId } from '@/content/landing'
import { PainMarkService, type PainKind, type PainMark } from '@/services/PainMarkService'
import { ZONE_LABELS } from '@/components/landing/podograma-geometry'

const storage = typeof window !== 'undefined' ? window.localStorage : null
export const painMarkService = new PainMarkService(storage)

/**
 * Mapa de dolor/molestia del visitante: qué parte del pie, de qué tipo y con qué
 * intensidad. Persiste en localStorage y se adjunta al mensaje de contacto.
 */
export const usePainMapStore = defineStore('painMap', () => {
  const marks = ref<PainMark[]>(painMarkService.load().filter((m) => m.zone in ZONE_LABELS))
  const selectedZone = ref<ZoneId | null>(null)
  const draftKind = ref<PainKind>('molestia')
  const draftIntensity = ref(3)

  const persist = () => painMarkService.save(marks.value)

  const markFor = (zone: ZoneId) => marks.value.find((m) => m.zone === zone) ?? null
  const selectedMark = computed(() => (selectedZone.value ? markFor(selectedZone.value) : null))
  const summary = computed(() => painMarkService.summary(marks.value, (z) => ZONE_LABELS[z]))

  const select = (zone: ZoneId | null) => {
    selectedZone.value = zone
    const existing = zone ? markFor(zone) : null
    if (existing) {
      draftKind.value = existing.kind
      draftIntensity.value = existing.intensity
    }
  }

  const saveDraft = () => {
    if (!selectedZone.value) return
    marks.value = painMarkService.upsert(marks.value, {
      zone: selectedZone.value,
      kind: draftKind.value,
      intensity: draftIntensity.value,
    })
    persist()
  }

  const remove = (zone: ZoneId) => {
    marks.value = painMarkService.remove(marks.value, zone)
    if (selectedZone.value === zone) selectedZone.value = null
    persist()
  }

  const clear = () => {
    marks.value = []
    selectedZone.value = null
    persist()
  }

  return {
    marks,
    selectedZone,
    selectedMark,
    draftKind,
    draftIntensity,
    summary,
    markFor,
    select,
    saveDraft,
    remove,
    clear,
  }
})
