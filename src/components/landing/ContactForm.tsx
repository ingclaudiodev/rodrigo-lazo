import { defineComponent, withModifiers } from 'vue'
import { useContactForm } from '@/composables/useContactForm'
import { usePainMapStore } from '@/stores/painMap'
import { contentService } from '@/services'

export default defineComponent({
  name: 'ContactForm',
  setup() {
    const pain = usePainMapStore()
    const painCopy = contentService.getPainMap()
    const { form, errors, status, errorMessage, isSending, isConfigured, submit } = useContactForm(
      undefined,
      () => pain.summary,
    )

    const field = (
      key: 'name' | 'email',
      label: string,
      type: 'text' | 'email',
      autocomplete: string,
    ) => {
      const error = errors.value[key]
      return (
        <fieldset class="fieldset">
          <label class="label" for={`contact-${key}`}>
            {label}
          </label>
          <input
            id={`contact-${key}`}
            type={type}
            autocomplete={autocomplete}
            class={['input input-lg w-full', { 'input-error': error }]}
            value={form[key]}
            onInput={(e) => (form[key] = (e.target as HTMLInputElement).value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `contact-${key}-error` : undefined}
          />
          {error && (
            <p id={`contact-${key}-error`} role="alert" class="text-sm text-error">
              {error}
            </p>
          )}
        </fieldset>
      )
    }

    return () => (
      <form
        class="flex flex-col gap-4 rounded-box bg-base-100 p-6 shadow-soft md:p-8"
        novalidate
        onSubmit={withModifiers(submit, ['prevent'])}
      >
        {field('name', 'Nombre', 'text', 'name')}
        {field('email', 'Correo', 'email', 'email')}

        <fieldset class="fieldset">
          <label class="label" for="contact-message">
            ¿Qué te molesta?
          </label>
          <textarea
            id="contact-message"
            rows={4}
            class={[
              'textarea textarea-lg w-full border-neutral-content/25',
              { 'textarea-error': errors.value.message },
            ]}
            value={form.message}
            onInput={(e) => (form.message = (e.target as HTMLTextAreaElement).value)}
            aria-invalid={Boolean(errors.value.message)}
            aria-describedby={errors.value.message ? 'contact-message-error' : undefined}
          />
          {errors.value.message && (
            <p id="contact-message-error" role="alert" class="text-sm text-error">
              {errors.value.message}
            </p>
          )}
        </fieldset>

        <div class="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            class="btn btn-neutral btn-lg rounded-full px-7"
            disabled={isSending.value || !isConfigured}
            aria-describedby={!isConfigured ? 'contact-pending' : undefined}
          >
            {isSending.value ? 'Enviando…' : 'Enviar mensaje'}
          </button>
          {!isConfigured && (
            <p id="contact-pending" class="text-sm text-base-content/75">
              El correo de contacto está <em>por confirmar</em>: el envío se activará cuando esté
              definido.
            </p>
          )}
          {pain.marks.length > 0 && (
            <p class="w-full text-sm text-base-content/75">{painCopy.attached}</p>
          )}
          <p class="text-sm text-base-content/75" role="status" aria-live="polite">
            {status.value === 'sent' && 'Listo, se abrió tu cliente de correo.'}
            {status.value === 'error' && errorMessage.value}
          </p>
        </div>
      </form>
    )
  },
})
