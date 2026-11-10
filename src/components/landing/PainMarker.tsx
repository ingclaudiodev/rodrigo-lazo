import { computed, defineComponent } from 'vue'
import { contentService } from '@/services'
import { usePainMapStore, painMarkService } from '@/stores/painMap'
import { PAIN_MAX, PAIN_MIN, type PainKind } from '@/services/PainMarkService'
import { SELECTABLE_ZONES, ZONE_LABELS } from './podograma-geometry'
import type { ZoneId } from '@/content/landing'
import Icon from '@/components/icons/Icon'

/**
 * Panel para marcar dolor o molestia por parte del pie, con escala 1–10
 * (blanco → amarillo → rojo). El estado vive en el store `painMap` y persiste.
 */
export default defineComponent({
  name: 'PainMarker',
  setup() {
    const copy = contentService.getPainMap()
    const store = usePainMapStore()

    const draftColor = computed(() => painMarkService.color(store.draftIntensity))
    const scaleGradient = painMarkService.gradient()

    const onZoneChange = (e: Event) => {
      const value = (e.target as HTMLSelectElement).value
      store.select(value ? (value as ZoneId) : null)
    }
    const onIntensity = (e: Event) => {
      store.draftIntensity = Number((e.target as HTMLInputElement).value)
    }
    const onSave = (e: Event) => {
      e.preventDefault()
      store.saveDraft()
    }

    return () => (
      <form class="pain-marker" onSubmit={onSave} aria-labelledby="pain-marker-title">
        <h2 id="pain-marker-title" class="font-display text-xl font-semibold tracking-tight">
          {copy.title}
        </h2>
        <p class="text-sm leading-relaxed text-base-content/75">{copy.intro}</p>

        <div class="grid gap-4 sm:grid-cols-[1fr_auto]">
          <fieldset class="fieldset">
            <label class="label" for="pain-zone">
              {copy.zoneLabel}
            </label>
            <select
              id="pain-zone"
              class="select w-full"
              value={store.selectedZone ?? ''}
              onChange={onZoneChange}
            >
              <option value="">{copy.zonePlaceholder}</option>
              {SELECTABLE_ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {capitalize(ZONE_LABELS[zone])}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset class="fieldset" disabled={!store.selectedZone}>
            <legend class="fieldset-legend sr-only">Tipo</legend>
            <div class="join" role="group" aria-label="Tipo">
              {copy.kinds.map((kind) => (
                <button
                  key={kind.id}
                  type="button"
                  class={[
                    'btn join-item btn-sm',
                    store.draftKind === kind.id ? 'btn-neutral' : 'btn-outline',
                  ]}
                  aria-pressed={store.draftKind === kind.id}
                  onClick={() => (store.draftKind = kind.id as PainKind)}
                >
                  {kind.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset class="fieldset" disabled={!store.selectedZone}>
          <label class="label flex items-center justify-between" for="pain-intensity">
            <span>{copy.intensityLabel}</span>
            <output
              for="pain-intensity"
              class="pain-marker__value"
              style={{ backgroundColor: draftColor.value }}
              aria-live="polite"
            >
              {store.draftIntensity}/10
            </output>
          </label>
          <input
            id="pain-intensity"
            type="range"
            class="pain-range"
            min={PAIN_MIN}
            max={PAIN_MAX}
            step={1}
            value={store.draftIntensity}
            style={{ '--pain-scale': scaleGradient, '--pain-thumb': draftColor.value }}
            onInput={onIntensity}
            aria-valuetext={`${store.draftIntensity} de 10`}
          />
          <div class="flex justify-between text-xs text-base-content/65">
            <span>{copy.scaleLow}</span>
            <span>{copy.scaleHigh}</span>
          </div>
        </fieldset>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            class="btn btn-neutral btn-sm rounded-full px-4"
            disabled={!store.selectedZone}
          >
            <Icon name="check" size={16} />
            {copy.save}
          </button>
          {store.selectedMark && (
            <button
              type="button"
              class="btn btn-ghost btn-sm rounded-full"
              onClick={() => store.selectedZone && store.remove(store.selectedZone)}
            >
              {copy.remove}
            </button>
          )}
        </div>

        <div class="pain-marker__saved">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-sm font-semibold">{copy.savedTitle}</h3>
            {store.marks.length > 0 && (
              <button type="button" class="link link-hover text-xs" onClick={() => store.clear()}>
                {copy.clear}
              </button>
            )}
          </div>
          {store.marks.length === 0 ? (
            <p class="text-sm text-base-content/60">{copy.empty}</p>
          ) : (
            <ul class="flex flex-wrap gap-2" aria-label={copy.savedTitle}>
              {store.marks.map((mark) => (
                <li key={mark.zone}>
                  <button
                    type="button"
                    class={[
                      'pain-marker__chip',
                      { 'pain-marker__chip--selected': store.selectedZone === mark.zone },
                    ]}
                    onClick={() => store.select(mark.zone)}
                  >
                    <span
                      class="pain-marker__dot"
                      style={{ backgroundColor: painMarkService.color(mark.intensity) }}
                    />
                    <span>
                      {capitalize(ZONE_LABELS[mark.zone])} · {mark.kind} {mark.intensity}/10
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    )
  },
})

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
