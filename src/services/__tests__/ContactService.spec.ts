import { describe, it, expect } from 'vitest'
import { ContactService } from '@/services'

const valid = {
  name: 'Ana',
  email: 'ana@ejemplo.com',
  message: 'Hola, quiero cotizar un proyecto.',
}

describe('ContactService', () => {
  const service = new ContactService('destino@ejemplo.com')

  it('accepts a valid payload', () => {
    expect(service.validate(valid)).toEqual({})
    expect(service.isValid(valid)).toBe(true)
  })

  it('reports one error per invalid field', () => {
    const errors = service.validate({ name: 'A', email: 'no-es-correo', message: 'corto' })
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name'])
  })

  it('builds a mailto link with subject and body', () => {
    const href = service.buildMailto(valid)
    expect(href.startsWith('mailto:destino@ejemplo.com?')).toBe(true)
    expect(decodeURIComponent(href)).toContain('Contacto desde la web: Ana')
    expect(decodeURIComponent(href)).toContain('ana@ejemplo.com')
  })

  it('refuses to send an invalid payload', async () => {
    const result = await service.send({ ...valid, email: '' })
    expect(result.ok).toBe(false)
  })
})
