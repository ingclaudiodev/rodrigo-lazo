import { defineComponent, type PropType } from 'vue'
import type { Symptom } from '@/content/landing'

export default defineComponent({
  name: 'SymptomChips',
  props: {
    symptoms: { type: Array as PropType<Symptom[]>, required: true },
    prompt: { type: String, required: true },
    isSelected: { type: Function as PropType<(id: string) => boolean>, required: true },
    onSelect: { type: Function as PropType<(id: string) => void>, required: true },
    onHover: { type: Function as PropType<(id: string | null) => void>, required: true },
  },
  setup(props) {
    return () => (
      <div class="flex flex-col gap-3">
        <p id="symptom-prompt" class="font-medium text-base-content">
          {props.prompt}
        </p>
        <div class="flex flex-wrap gap-2" role="group" aria-labelledby="symptom-prompt">
          {props.symptoms.map((s) => {
            const on = props.isSelected(s.id)
            return (
              <button
                key={s.id}
                type="button"
                class={[
                  'btn btn-sm rounded-full px-4',
                  on
                    ? 'btn-neutral'
                    : 'btn-outline border-base-content/30 bg-base-100/35 hover:border-base-content hover:bg-base-100/70 hover:text-base-content',
                ]}
                aria-pressed={on}
                onClick={() => props.onSelect(s.id)}
                onMouseenter={() => props.onHover(s.id)}
                onMouseleave={() => props.onHover(null)}
                onFocus={() => props.onHover(s.id)}
                onBlur={() => props.onHover(null)}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  },
})
