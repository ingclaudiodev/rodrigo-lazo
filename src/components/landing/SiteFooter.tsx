import { defineComponent } from 'vue'
import { contentService } from '@/services'

export default defineComponent({
  name: 'SiteFooter',
  setup() {
    const footer = contentService.getFooter()
    const links = contentService.getNavLinks()

    return () => (
      <footer class="footer mx-auto max-w-6xl items-center justify-between border-t border-base-content/15 px-5 py-10 text-sm text-base-content sm:footer-horizontal">
        <p>{footer.copyright}</p>
        <nav class="flex gap-5" aria-label="Enlaces del pie">
          {links.map((link) => (
            <a key={link.href} href={link.href} class="link link-hover">
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    )
  },
})
