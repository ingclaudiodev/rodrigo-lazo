import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { contentService } from '@/services'
import Icon from '@/components/icons/Icon'

export default defineComponent({
  name: 'NotFoundView',
  setup() {
    const content = contentService.getNotFound()

    return () => (
      <main>
        <section class="bg-hero-fade">
          <div class="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-start justify-center gap-6 px-5 py-16 md:py-24">
            <p class="font-display text-7xl font-bold tracking-[-0.03em] text-base-content/20 md:text-8xl">
              {content.code}
            </p>
            <h1 class="font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl md:text-5xl">
              {content.title}
            </h1>
            <p class="max-w-[52ch] text-lg leading-relaxed text-base-content/90">
              {content.description}
            </p>
            <div class="flex flex-wrap gap-3 pt-2">
              <RouterLink class="btn btn-neutral rounded-full px-5" to={content.primaryCta.to}>
                {content.primaryCta.label}
              </RouterLink>
              <RouterLink class="btn btn-ghost rounded-full px-5" to={content.secondaryCta.to}>
                {content.secondaryCta.label}
                <Icon name="arrow-right" size={18} />
              </RouterLink>
            </div>
          </div>
        </section>
      </main>
    )
  },
})
