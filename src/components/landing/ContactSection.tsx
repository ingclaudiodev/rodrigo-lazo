import { defineComponent } from 'vue'
import { contentService } from '@/services'
import ContactForm from './ContactForm'
import Icon from '@/components/icons/Icon'

export default defineComponent({
  name: 'ContactSection',
  setup() {
    const contact = contentService.getContact()
    const booking = contentService.getBooking()

    return () => (
      <section id="agenda" class="bg-primary-fade">
        <div class="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:py-28 lg:grid-cols-12">
          <div class="lg:col-span-5">
            <h2 class="font-display text-4xl font-bold tracking-tight text-balance md:text-5xl">
              {contact.title}
            </h2>
            <p class="mt-5 max-w-[48ch] text-lg leading-relaxed text-base-content">
              {contact.subtitle}
            </p>

            {!booking.pending && (
              <a class="btn btn-neutral btn-lg mt-8 rounded-full px-7" href={booking.href}>
                <Icon name="calendar" size={20} />
                {booking.label}
              </a>
            )}

            <ul class="mt-10 flex flex-col gap-5">
              {contact.channels.map((channel) => (
                <li key={channel.label} class="flex items-start gap-3">
                  <span class="mt-0.5 text-base-content">
                    <Icon name={channel.href.startsWith('tel:') ? 'phone' : 'mail'} size={20} />
                  </span>
                  <div>
                    <span class="block text-sm text-base-content">{channel.label}</span>
                    {channel.pending ? (
                      <span class="italic text-base-content">{channel.value}</span>
                    ) : (
                      <a class="link link-hover font-semibold" href={channel.href}>
                        {channel.value}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div class="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    )
  },
})
