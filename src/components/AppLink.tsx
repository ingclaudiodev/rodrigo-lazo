import type { AnchorHTMLAttributes, FunctionalComponent } from 'vue'
import { RouterLink } from 'vue-router'

type AppLinkProps = AnchorHTMLAttributes & { href: string }

/**
 * Enlace que decide solo cómo navegar: las rutas internas (`/agenda`) pasan por vue-router
 * sin recargar la página; cualquier otra (`https://…`, `mailto:`, `tel:`) es un `<a>` normal.
 * Acepta los mismos atributos que `<a>` (`class`, `onClick`, `aria-*`…) y los reenvía.
 */
const AppLink: FunctionalComponent<AppLinkProps> = ({ href, ...attrs }, { slots }) =>
  href.startsWith('/') ? (
    <RouterLink to={href} {...attrs}>
      {slots.default?.()}
    </RouterLink>
  ) : (
    <a href={href} {...attrs}>
      {slots.default?.()}
    </a>
  )

export default AppLink
