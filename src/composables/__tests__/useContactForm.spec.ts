import { describe, it, expect, vi } from 'vitest'
import { useContactForm } from '../useContactForm'
import { ContactService } from '@/services'

describe('useContactForm', () => {
  it('surfaces validation errors without calling send', async () => {
    const service = new ContactService('x@ejemplo.com')
    const send = vi.spyOn(service, 'send')
    const { submit, errors, status } = useContactForm(service)

    await submit()

    expect(send).not.toHaveBeenCalled()
    expect(status.value).toBe('error')
    expect(errors.value.name).toBeDefined()
  })

  it('marks the form as sent when the service succeeds', async () => {
    const service = new ContactService('x@ejemplo.com')
    vi.spyOn(service, 'send').mockResolvedValue({ ok: true })
    const { form, submit, status } = useContactForm(service)

    form.name = 'Ana'
    form.email = 'ana@ejemplo.com'
    form.message = 'Mensaje suficientemente largo.'
    await submit()

    expect(status.value).toBe('sent')
  })
})
