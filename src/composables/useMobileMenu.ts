import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Estado de un menú colapsable (móvil): abrir, cerrar, alternar.
 * Se cierra automáticamente con la tecla Escape.
 */
export function useMobileMenu() {
  const isOpen = ref(false)

  const open = () => (isOpen.value = true)
  const close = () => (isOpen.value = false)
  const toggle = () => (isOpen.value = !isOpen.value)

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close()
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

  return { isOpen, open, close, toggle }
}
