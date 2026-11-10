import { defineComponent } from 'vue'
import { contentService } from '@/services'
import Icon from '@/components/icons/Icon'

export default defineComponent({
  name: 'AboutSection',
  setup() {
    const about = contentService.getAbout()
    const pending = contentService.getPendingReview()

    return () => (
      <section id="sobre-mi" class="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div class="grid gap-10 lg:grid-cols-12">
          <div class="lg:col-span-7">
            <h2 class="font-display text-4xl font-bold tracking-tight text-balance md:text-5xl">
              {about.title}
            </h2>
            <div class="mt-6 flex max-w-[62ch] flex-col gap-4 text-lg leading-relaxed text-base-content/80">
              {about.paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </div>
          <dl class="flex flex-col divide-y divide-base-content/10 border-y border-base-content/10 self-start lg:col-span-5 lg:mt-3">
            {about.facts.map((f) => (
              <div key={f.label} class="grid grid-cols-[9rem_1fr] gap-4 py-4">
                <dt class="text-sm font-medium text-base-content/70">{f.label}</dt>
                <dd class={['text-sm', f.pending ? 'italic text-base-content/55' : 'font-medium']}>
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {pending.length > 0 && (
          <details class="group mt-10 rounded-box border border-dashed border-base-content/25 px-5 py-4 text-sm">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-base-content/80 [&::-webkit-details-marker]:hidden">
              <span>Textos a confirmar con Rodrigo antes de publicar ({pending.length})</span>
              <span class="shrink-0 transition-transform duration-200 group-open:rotate-180">
                <Icon name="chevron-down" size={18} />
              </span>
            </summary>
            <ul class="mt-3 flex list-disc flex-col gap-1 pl-5 text-base-content/70">
              {pending.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        )}
      </section>
    )
  },
})
