import { defineComponent } from 'vue'
import { contentService } from '@/services'
import { useMobileMenu } from '@/composables/useMobileMenu'
import { useActiveSection } from '@/composables/useActiveSection'
import Icon from '@/components/icons/Icon'

export default defineComponent({
  name: 'SiteNav',
  setup() {
    const brand = contentService.getBrand()
    const booking = contentService.getBooking()
    const links = contentService.getNavLinks()
    const menu = useMobileMenu()
    const { isActive } = useActiveSection(() => contentService.getSectionIds())

    const renderLink = (href: string, label: string, extra = '') => {
      const active = isActive(href.slice(1))
      return (
        <a
          key={href}
          href={href}
          class={[
            'rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-base-content',
            extra,
            active ? 'text-base-content' : 'text-base-content/65',
          ]}
          aria-current={active ? 'true' : undefined}
          onClick={menu.close}
        >
          {label}
        </a>
      )
    }

    return () => (
      <header class="sticky top-0 z-20 border-b border-base-content/10 bg-base-100">
        <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#inicio" class="flex flex-col leading-tight" onClick={menu.close}>
            <span class="font-display text-lg font-bold tracking-tight">{brand.name}</span>
            <span class="text-xs font-medium text-base-content/65">{brand.role}</span>
          </a>

          <nav class="hidden items-center gap-1 md:flex" aria-label="Principal">
            {links.map((link) => renderLink(link.href, link.label))}
            <a class="btn btn-neutral btn-sm ml-3 rounded-full px-4" href={booking.href}>
              {booking.label}
            </a>
          </nav>

          <button
            type="button"
            class="btn btn-ghost btn-square btn-sm md:hidden"
            aria-label={menu.isOpen.value ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menu.isOpen.value}
            aria-controls="site-nav-mobile"
            onClick={menu.toggle}
          >
            <Icon name={menu.isOpen.value ? 'x' : 'menu'} size={22} />
          </button>
        </div>

        {menu.isOpen.value && (
          <nav
            id="site-nav-mobile"
            class="flex flex-col gap-1 border-t border-base-content/10 bg-base-100 px-3 py-3 md:hidden"
            aria-label="Principal móvil"
          >
            {links.map((link) => renderLink(link.href, link.label, 'py-3 text-base'))}
            <a class="btn btn-neutral mt-2 rounded-full" href={booking.href} onClick={menu.close}>
              {booking.label}
            </a>
          </nav>
        )}
      </header>
    )
  },
})
