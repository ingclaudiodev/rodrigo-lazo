import type { HtmlTagDescriptor, Plugin } from 'vite'
import { seo } from '../src/content/seo.ts'
import { brand, faq, POR_CONFIRMAR, treatments } from '../src/content/landing.ts'

/**
 * Escribe en `index.html` el título, la descripción, canonical, Open Graph, Twitter y el
 * JSON-LD del negocio; en el build emite además `robots.txt` y `sitemap.xml`.
 * Todo sale de `src/content/seo.ts` y `src/content/landing.ts`: no hay textos duplicados.
 */
export function seoPlugin(): Plugin {
  const base = seo.siteUrl.replace(/\/$/, '')
  const absolute = (path: string) => (base ? `${base}${path}` : undefined)
  const escapeAttr = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

  const meta = (attrs: Record<string, string | undefined>): HtmlTagDescriptor[] => {
    const clean = Object.fromEntries(
      Object.entries(attrs).filter(([, v]) => v !== undefined),
    ) as Record<string, string>
    return Object.keys(clean).length > 1 ? [{ tag: 'meta', attrs: clean, injectTo: 'head' }] : []
  }

  const jsonLd = () => {
    const business = {
      '@type': 'MedicalBusiness',
      '@id': '#negocio',
      name: brand.name,
      description: seo.description,
      url: absolute('/'),
      image: absolute(seo.ogImage),
      medicalSpecialty: seo.medicalSpecialty,
      areaServed: seo.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
      founder: { '@id': '#rodrigo' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Tratamientos',
        itemListElement: treatments.map((t) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: t.title, description: t.description },
        })),
      },
    }
    const person = {
      '@type': 'Person',
      '@id': '#rodrigo',
      name: brand.name,
      jobTitle: brand.role,
      worksFor: { '@id': '#negocio' },
    }
    // Solo preguntas con respuesta confirmada: nada marcado «por confirmar» entra en datos estructurados.
    const confirmedFaq = faq.items.filter(
      (item) => !item.pending && !item.answer.includes(POR_CONFIRMAR),
    )
    const faqPage = {
      '@type': 'FAQPage',
      mainEntity: confirmedFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    }
    const website = base
      ? [{ '@type': 'WebSite', name: brand.name, url: `${base}/`, inLanguage: seo.language }]
      : []
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [business, person, ...website, faqPage],
    }
    // `</` no puede aparecer literal dentro de <script>.
    return JSON.stringify(graph, (_k, v) => (v === undefined ? undefined : v)).replace(
      /<\//g,
      '<\\/',
    )
  }

  return {
    name: 'seo',

    transformIndexHtml(html) {
      const withText = html
        .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(seo.title)}</title>`)
        .replace(
          /<meta name="description" content="[^"]*">/,
          `<meta name="description" content="${escapeAttr(seo.description)}">`,
        )
      const image = absolute(seo.ogImage)
      const tags: HtmlTagDescriptor[] = [
        ...meta({ name: 'robots', content: 'index, follow' }),
        ...(base
          ? [
              {
                tag: 'link',
                attrs: { rel: 'canonical', href: `${base}/` },
                injectTo: 'head' as const,
              },
            ]
          : []),
        ...meta({ property: 'og:type', content: 'website' }),
        ...meta({ property: 'og:locale', content: seo.locale }),
        ...meta({ property: 'og:site_name', content: brand.name }),
        ...meta({ property: 'og:title', content: seo.title }),
        ...meta({ property: 'og:description', content: seo.description }),
        ...meta({ property: 'og:url', content: absolute('/') }),
        ...meta({ property: 'og:image', content: image }),
        ...(image ? meta({ property: 'og:image:width', content: '1200' }) : []),
        ...(image ? meta({ property: 'og:image:height', content: '630' }) : []),
        ...(image ? meta({ property: 'og:image:alt', content: seo.ogImageAlt }) : []),
        ...meta({ name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' }),
        ...meta({ name: 'twitter:title', content: seo.title }),
        ...meta({ name: 'twitter:description', content: seo.description }),
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: jsonLd(),
          injectTo: 'head',
        },
      ]
      return { html: withText, tags }
    },

    generateBundle() {
      const robots = [
        'User-agent: *',
        'Allow: /',
        ...(base ? [`Sitemap: ${base}/sitemap.xml`] : []),
        '',
      ].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      if (!base) {
        this.warn(
          '[seo] `siteUrl` vacío en src/content/seo.ts: se omiten canonical, og:url, og:image y sitemap.xml.',
        )
        return
      }
      // Las secciones (/tratamientos, /agenda…) son la misma página: solo se lista la portada.
      const today = new Date().toISOString().slice(0, 10)
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        `  <url><loc>${base}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>`,
        '</urlset>',
        '',
      ].join('\n')
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}
