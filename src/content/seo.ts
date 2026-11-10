/**
 * Datos SEO del sitio. Los lee `scripts/seo-plugin.ts` en el build para escribir
 * `<head>`, `robots.txt` y `sitemap.xml`.
 *
 * TODO(rodrigo): poner el dominio real en `siteUrl` cuando exista
 * (p. ej. 'https://www.rodrigolazo.cl', sin barra final). Mientras esté vacío, el build
 * omite canonical, og:url, og:image y sitemap.xml: un dominio inventado perjudicaría la
 * indexación, porque Google trataría la página como duplicado de una URL que no existe.
 */
export const seo = {
  siteUrl: '',

  /** Menos de 60 caracteres para que Google no lo recorte. */
  title: 'Rodrigo Lazo · Podólogo clínico a domicilio en Santiago',

  /** Menos de 155 caracteres. Solo afirma lo confirmado en `landing.ts`. */
  description:
    'Podólogo clínico a domicilio en toda la Región Metropolitana: uña encarnada, callos, hongos en las uñas, talón agrietado y pie diabético. Agenda tu hora.',

  locale: 'es_CL',
  language: 'es-CL',

  /** 1200×630, generada con `node scripts/og-image.mjs`. Solo se enlaza si hay `siteUrl`. */
  ogImage: '/og-image.png',
  ogImageAlt: 'Rodrigo Lazo, podólogo clínico a domicilio. Huella del podograma sobre fondo azul.',

  /** Cobertura confirmada. Sin dirección ni teléfono hasta que estén confirmados. */
  areaServed: ['Región Metropolitana de Santiago', 'Chile'],

  /** Miembro de la enumeración MedicalSpecialty de schema.org. */
  medicalSpecialty: 'Podiatric',
} as const
