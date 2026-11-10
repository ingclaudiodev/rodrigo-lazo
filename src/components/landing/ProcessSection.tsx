import { defineComponent } from 'vue'
import { contentService } from '@/services'

export default defineComponent({
  name: 'ProcessSection',
  setup() {
    const process = contentService.getProcess()

    return () => (
      <section id="primera-sesion" class="bg-primary-tint">
        <div class="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <h2 class="font-display text-4xl font-bold tracking-tight text-balance md:text-5xl">
            {process.title}
          </h2>
          <ol class="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {process.steps.map((step, i) => (
              <li
                key={step.title}
                class="relative flex flex-col gap-4 border-t border-base-content/25 pt-6"
              >
                <h3 class="font-display text-2xl font-semibold tracking-tight text-balance">
                  <span class="text-primary-ink tabular-nums">{i + 1}.</span> {step.title}
                </h3>
                <p class="leading-relaxed text-base-content/80">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  },
})
