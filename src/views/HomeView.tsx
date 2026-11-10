import { defineComponent, ref } from 'vue'
import { useSectionReveal } from '@/composables/useSectionReveal'
import HeroSection from '@/components/landing/HeroSection'
import TreatmentsSection from '@/components/landing/TreatmentsSection'
import ProcessSection from '@/components/landing/ProcessSection'
import AboutSection from '@/components/landing/AboutSection'
import FaqSection from '@/components/landing/FaqSection'
import ContactSection from '@/components/landing/ContactSection'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const main = ref<HTMLElement | null>(null)
    useSectionReveal(main)

    return () => (
      <main ref={main}>
        <HeroSection />
        <TreatmentsSection />
        <ProcessSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>
    )
  },
})
