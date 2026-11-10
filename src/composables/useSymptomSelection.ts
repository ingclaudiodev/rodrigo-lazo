import { computed, ref } from 'vue'
import type { Symptom, ZoneId } from '@/content/landing'

/**
 * Selección de síntoma en el hero: qué chip está activo, qué zonas del
 * podograma se encienden y qué línea de contexto se muestra.
 * El hover previsualiza sin cambiar la selección.
 */
export function useSymptomSelection(symptoms: Symptom[]) {
  const selectedId = ref<string | null>(null)
  const hoveredId = ref<string | null>(null)

  const activeId = computed(() => hoveredId.value ?? selectedId.value)
  const active = computed(() => symptoms.find((s) => s.id === activeId.value) ?? null)
  const activeZones = computed<ZoneId[]>(() => active.value?.zones ?? [])

  const select = (id: string) => {
    selectedId.value = selectedId.value === id ? null : id
  }
  const hover = (id: string | null) => {
    hoveredId.value = id
  }
  const isSelected = (id: string) => selectedId.value === id
  const isZoneActive = (zone: ZoneId) => activeZones.value.includes(zone)

  return { selectedId, activeId, active, activeZones, select, hover, isSelected, isZoneActive }
}
