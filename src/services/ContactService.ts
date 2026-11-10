export interface ContactPayload {
  name: string
  email: string
  message: string
  /** Texto adicional que se adjunta al cuerpo (p. ej. el mapa de molestias). */
  notes?: string
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>

export interface ContactResult {
  ok: boolean
  error?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Lógica del formulario de contacto: validación y envío.
 *
 * `send()` abre el cliente de correo del visitante con un `mailto:` ya
 * rellenado. Para enviar a un backend real, reemplaza el cuerpo de `send()`
 * por un `fetch` a tu endpoint manteniendo la misma firma.
 */
export class ContactService {
  private readonly recipient: string

  constructor(recipient: string) {
    this.recipient = recipient
  }

  /** Falso mientras no exista un correo de destino confirmado. */
  get isConfigured(): boolean {
    return this.recipient.trim().length > 0
  }

  validate(payload: ContactPayload): ContactErrors {
    const errors: ContactErrors = {}
    if (payload.name.trim().length < 2) errors.name = 'Ingresa tu nombre.'
    if (!EMAIL_PATTERN.test(payload.email.trim())) errors.email = 'Ingresa un correo válido.'
    if (payload.message.trim().length < 10) {
      errors.message = 'Cuéntame un poco más (mínimo 10 caracteres).'
    }
    return errors
  }

  isValid(payload: ContactPayload): boolean {
    return Object.keys(this.validate(payload)).length === 0
  }

  buildMailto(payload: ContactPayload): string {
    const subject = encodeURIComponent(`Contacto desde la web: ${payload.name.trim()}`)
    const notes = payload.notes?.trim() ? `\n\n${payload.notes.trim()}` : ''
    const body = encodeURIComponent(
      `${payload.message.trim()}${notes}\n\n— ${payload.name.trim()} <${payload.email.trim()}>`,
    )
    return `mailto:${this.recipient}?subject=${subject}&body=${body}`
  }

  async send(payload: ContactPayload): Promise<ContactResult> {
    if (!this.isConfigured) {
      return { ok: false, error: 'El correo de contacto aún no está confirmado.' }
    }
    if (!this.isValid(payload)) {
      return { ok: false, error: 'Revisa los campos marcados.' }
    }
    if (typeof window === 'undefined') {
      return { ok: false, error: 'El envío solo está disponible en el navegador.' }
    }
    window.location.href = this.buildMailto(payload)
    return { ok: true }
  }
}
