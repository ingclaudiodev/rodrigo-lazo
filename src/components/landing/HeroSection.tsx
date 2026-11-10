import { computed, defineComponent } from 'vue'
import { contentService } from '@/services'
import { useSymptomSelection } from '@/composables/useSymptomSelection'
import { usePainMapStore, painMarkService } from '@/stores/painMap'
import FootModel3D from './FootModel3D'
import SymptomChips from './SymptomChips'
import PainMarker from './PainMarker'
import Icon from '@/components/icons/Icon'
import AppLink from '@/components/AppLink'
import { describeZones } from './podograma-geometry'

export default defineComponent({
  name: 'HeroSection',
  setup() {
    const hero = contentService.getHero()
    const booking = contentService.getBooking()
    const symptoms = contentService.getSymptoms()
    const selection = useSymptomSelection(symptoms)
    const pain = usePainMapStore()

    const textureMarks = computed(() =>
      pain.marks.map((m) => ({ zone: m.zone, color: painMarkService.color(m.intensity) })),
    )

    return () => (
      <section id="inicio" class="relative bg-hero-fade">
        <div class="mx-auto grid max-w-6xl gap-12 px-5 pt-10 pb-16 md:pt-16 md:pb-24 lg:grid-cols-12 lg:items-start">
          <div class="flex flex-col gap-8 lg:col-span-7 lg:sticky lg:top-24">
            <h1 class="font-display text-[2.5rem] leading-[1] font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
              {hero.titleLines[0]}
              <br />
              {hero.titleLines[1]}
            </h1>
            <p class="max-w-[58ch] text-lg leading-relaxed text-base-content/90 md:text-xl">
              {hero.subtitle}
            </p>
            <p class="flex items-start gap-2 text-base font-medium">
              <span class="mt-0.5 shrink-0">
                <Icon name="map-pin" size={20} />
              </span>
              <span>{hero.coverage}</span>
            </p>

            {/* Por debajo de lg, chips y texto de ayuda pasan detrás del CTA (`order-1`): agendar queda en la primera pantalla del móvil. */}
            <SymptomChips
              class="order-1 lg:order-none"
              symptoms={symptoms}
              prompt={hero.prompt}
              isSelected={selection.isSelected}
              onSelect={selection.select}
              onHover={selection.hover}
            />

            <p class="order-1 min-h-[3.5rem] max-w-[58ch] text-base leading-relaxed text-base-content/90 lg:order-none">
              {selection.active.value ? (
                <>
                  <span class="font-semibold text-base-content">
                    {selection.active.value.clinical}
                    <span class="font-normal text-base-content/75">
                      {' '}
                      · zona: {describeZones(selection.active.value.zones)}.
                    </span>{' '}
                  </span>
                  {selection.active.value.context}
                </>
              ) : (
                <span class="text-base-content/75">{hero.hint}</span>
              )}
            </p>

            <div class="flex flex-wrap items-center gap-4">
              <AppLink class="btn btn-neutral btn-lg rounded-full px-7" href={booking.href}>
                <Icon name="calendar" size={20} />
                {booking.label}
              </AppLink>
              <AppLink
                class="link link-hover inline-flex items-center gap-1.5 font-medium"
                href={hero.secondaryCta.href}
              >
                {hero.secondaryCta.label}
                <Icon name="arrow-down" size={18} />
              </AppLink>
            </div>
          </div>

          <div class="flex flex-col gap-6 lg:col-span-5">
            <FootModel3D
              activeZones={selection.activeZones.value}
              marks={textureMarks.value}
              selectedZone={pain.selectedZone}
              caption={hero.figureCaption}
              legend={hero.legend}
              hint={hero.figureHint}
              onPick={(zone) => pain.select(zone)}
            />
            <PainMarker />
          </div>
        </div>
      </section>
    )
  },
})
