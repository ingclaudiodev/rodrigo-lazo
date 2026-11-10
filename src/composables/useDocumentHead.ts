import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Ajusta `document.title` y, si se pide, añade `<meta name="robots">` mientras la vista
 * está montada; al salir restaura el título y quita la etiqueta.
 *
 * Lo usa la página 404: como la app responde 200 a cualquier URL, sin `noindex` Google
 * la trataría como un «soft 404» e intentaría indexarla.
 */
export function useDocumentHead(options: { title?: string; robots?: string }) {
  let previousTitle = ''
  let robotsMeta: HTMLMetaElement | null = null

  onMounted(() => {
    if (options.title) {
      previousTitle = document.title
      document.title = options.title
    }
    if (options.robots) {
      robotsMeta = document.createElement('meta')
      robotsMeta.name = 'robots'
      robotsMeta.content = options.robots
      document.head.append(robotsMeta)
    }
  })

  onBeforeUnmount(() => {
    if (options.title) document.title = previousTitle
    robotsMeta?.remove()
  })
}
