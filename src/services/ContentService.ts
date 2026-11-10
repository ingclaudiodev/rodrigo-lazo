import * as landing from '@/content/landing'

/**
 * Fuente única del contenido de la landing.
 * Hoy lee de `@/content/landing`; mañana puede leer de un CMS sin tocar los `.tsx`.
 */
export class ContentService {
  getBrand() {
    return landing.brand
  }

  getBooking() {
    return landing.booking
  }

  getNotFound() {
    return landing.notFound
  }

  getNavLinks(): landing.NavLink[] {
    return landing.navLinks
  }

  getHero() {
    return landing.hero
  }

  getSymptoms(): landing.Symptom[] {
    return landing.symptoms
  }

  getSymptom(id: string): landing.Symptom | undefined {
    return landing.symptoms.find((s) => s.id === id)
  }

  getTreatments(): landing.Treatment[] {
    return landing.treatments
  }

  getProcess() {
    return landing.process
  }

  getAbout() {
    return landing.about
  }

  getFaq() {
    return landing.faq
  }

  getContact() {
    return landing.contact
  }

  getPainMap() {
    return landing.painMap
  }

  getPendingReview(): string[] {
    return landing.pendingReview
  }

  getFooter() {
    return landing.footer
  }

  /** Ids de las secciones de la portada que tienen URL propia. */
  getSectionIds(): landing.SectionId[] {
    return [...landing.sectionIds]
  }
}
