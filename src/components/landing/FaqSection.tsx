import { defineComponent } from 'vue'
import { contentService } from '@/services'

export default defineComponent({
  name: 'FaqSection',
  setup() {
    const faq = contentService.getFaq()

    return () => (
      <section id="preguntas" class="bg-base-200">
        <div class="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:py-28 lg:grid-cols-12">
          <h2 class="font-display text-4xl font-bold tracking-tight text-balance md:text-5xl lg:col-span-4">
            {faq.title}
          </h2>
          <div class="flex flex-col gap-3 lg:col-span-8">
            {faq.items.map((item) => (
              <details
                key={item.question}
                class="collapse collapse-arrow rounded-box bg-base-100 shadow-soft"
              >
                <summary class="collapse-title font-display text-lg font-semibold">
                  {item.question}
                </summary>
                <div class="collapse-content">
                  <p
                    class={[
                      'leading-relaxed',
                      item.pending ? 'italic text-base-content/60' : 'text-base-content/80',
                    ]}
                  >
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    )
  },
})
