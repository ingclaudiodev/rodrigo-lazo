import { defineComponent } from 'vue'
import HeroSection from '@/components/landing/HeroSection'
import TreatmentsSection from '@/components/landing/TreatmentsSection'
import ProcessSection from '@/components/landing/ProcessSection'
import AboutSection from '@/components/landing/AboutSection'
import FaqSection from '@/components/landing/FaqSection'
import ContactSection from '@/components/landing/ContactSection'

export default defineComponent({
  name: 'HomeView',
  setup() {
    return () => (
      <main>
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
