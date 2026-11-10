import { computed, reactive, ref } from 'vue'
import { contactService as defaultService } from '@/services'
import type { ContactErrors, ContactPayload, ContactService } from '@/services'

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Estado reactivo del formulario de contacto. La validación y el envío
 * se delegan a `ContactService`; aquí solo vive la coreografía de la UI.
 */
export function useContactForm(
  service: ContactService = defaultService,
  getNotes: () => string = () => '',
) {
  const form = reactive<ContactPayload>({ name: '', email: '', message: '' })
  const errors = ref<ContactErrors>({})
  const status = ref<ContactStatus>('idle')
  const errorMessage = ref<string | null>(null)

  const isSending = computed(() => status.value === 'sending')

  const reset = () => {
    form.name = ''
    form.email = ''
    form.message = ''
    errors.value = {}
    status.value = 'idle'
    errorMessage.value = null
  }

  const submit = async () => {
    errors.value = service.validate(form)
    if (Object.keys(errors.value).length > 0) {
      status.value = 'error'
      errorMessage.value = 'Revisa los campos marcados.'
      return
    }

    status.value = 'sending'
    errorMessage.value = null
    const result = await service.send({ ...form, notes: getNotes() })

    if (result.ok) {
      status.value = 'sent'
    } else {
      status.value = 'error'
      errorMessage.value = result.error ?? 'No se pudo enviar el mensaje.'
    }
  }

  const isConfigured = service.isConfigured

  return { form, errors, status, errorMessage, isSending, isConfigured, submit, reset }
}
