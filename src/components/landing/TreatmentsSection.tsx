import { defineComponent } from 'vue'
import { contentService } from '@/services'
import Icon from '@/components/icons/Icon'
import PodogramaMini from './PodogramaMini'
import { describeZones } from './podograma-geometry'

export default defineComponent({
  name: 'TreatmentsSection',
  setup() {
    const treatments = contentService.getTreatments()

    return () => (
      <section id="tratamientos" class="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div class="grid gap-10 lg:grid-cols-12">
          <div class="lg:col-span-4">
            <h2 class="font-display text-4xl font-bold tracking-tight text-balance md:text-5xl lg:sticky lg:top-28">
              Tratamientos
            </h2>
          </div>
          <ul class="divide-y divide-base-content/10 lg:col-span-8">
            {treatments.map((t) => (
              <li key={t.id} class="grid gap-4 py-8 first:pt-0 md:grid-cols-12 md:gap-8">
                <div class="flex items-start gap-4 md:col-span-5">
                  <PodogramaMini zones={t.zones} label={`Zona: ${describeZones(t.zones)}`} />
                  <div>
                    <h3 class="font-display text-2xl font-semibold tracking-tight">{t.title}</h3>
                    <p class="mt-1 text-sm font-medium text-primary-ink">{t.clinical}</p>
                  </div>
                </div>
                <div class="md:col-span-7">
                  <p class="leading-relaxed text-base-content/80">{t.description}</p>
                  <ul class="mt-4 flex flex-col gap-2">
                    {t.includes.map((item) => (
                      <li key={item} class="flex items-start gap-2 text-sm">
                        <span class="mt-0.5 text-accent">
                          <Icon name="check" size={16} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  },
})
