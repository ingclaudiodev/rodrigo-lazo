# Guía: preparar la página para Google

Qué hay que hacer, en orden, para que la landing de Rodrigo Lazo quede publicada, indexada y
bien descrita en Google. Las tareas marcadas con **[Rodrigo]** necesitan datos o cuentas del
dueño del sitio; las marcadas con **[código]** son cambios en el repositorio.

Antes de nada, una expectativa honesta: los archivos del repo hacen que Google **entienda e
indexe** la página correctamente. **Aparecer en los primeros resultados** depende sobre todo
de tres cosas que ningún archivo sustituye: un Perfil de Empresa en Google con reseñas
reales, contenido útil y específico, y tiempo. Esta guía cubre ambas partes.

## 1. Lo que ya hace el código

| Pieza                                   | Dónde                                 | Qué logra                                                       |
| --------------------------------------- | ------------------------------------- | --------------------------------------------------------------- |
| Título y descripción                    | `src/content/seo.ts`                  | Lo que Google muestra en el resultado de búsqueda               |
| Open Graph y Twitter                    | `scripts/seo-plugin.ts`               | Vista previa con imagen al compartir por WhatsApp, Instagram, X |
| Imagen para compartir (1200×630)        | `public/og-image.png`                 | Generada con `node scripts/og-image.mjs`                        |
| Datos estructurados (JSON-LD)           | `scripts/seo-plugin.ts`               | Negocio médico con especialidad podológica, servicios, FAQ      |
| `robots.txt` y `sitemap.xml`            | generados en el build en `dist/`      | Permiten rastrear y declaran la URL de la portada               |
| Canonical                               | generado en el build                  | Evita que `/tratamientos`, `/agenda`… cuenten como duplicados   |
| `noindex` en la página 404              | `src/composables/useDocumentHead.ts`  | Evita «soft 404»: URLs inexistentes no se indexan               |
| Favicon, iconos y manifest              | `public/`, `index.html`               | Icono en pestaña, en resultados y al añadir a inicio            |
| Idioma `es-CL`                          | `index.html`                          | Orienta la página a Chile                                       |
| Responsive, sin desborde horizontal     | `e2e/responsive.spec.ts`              | Google indexa «mobile first»: la versión móvil es la que cuenta |

Todo el texto sale de `src/content/`. Nada que esté «por confirmar» entra en los datos
estructurados: Google penaliza datos inventados (teléfonos, direcciones, horarios).

## 2. Antes de publicar **[Rodrigo + código]**

1. **Dominio.** Comprar el dominio (por ejemplo en NIC Chile para `.cl`). Luego escribirlo en
   `src/content/seo.ts`, campo `siteUrl`, sin barra final:

   ```ts
   siteUrl: 'https://www.rodrigolazo.cl',
   ```

   Mientras esté vacío, el build omite a propósito canonical, `og:url`, `og:image` y
   `sitemap.xml`, y avisa en consola. Un dominio inventado sería peor que ninguno.

2. **Datos pendientes en `src/content/landing.ts`.** Cada «por confirmar» que quede visible
   resta confianza al visitante y a Google: correo, teléfono, enlace de agenda, formación,
   registro profesional, horarios, recargo por regiones, convenios. La lista completa está en
   `pendingReview` dentro de ese archivo.

3. **Desplegar en Cloud Run con el dominio propio.** En la consola de Cloud Run: servicio →
   *Administrar dominios personalizados* → *Agregar asignación*. Google entrega los registros
   DNS (A/AAAA o CNAME) que hay que crear en el panel del dominio. El certificado HTTPS lo
   emite Cloud Run solo. Comprobar que `http://` redirige a `https://` y que `www` y sin `www`
   llevan al mismo sitio (elegir uno como principal y que coincida con `siteUrl`).

4. **Reconstruir y desplegar** después de poner `siteUrl`: la imagen Docker se construye con
   `vite build`, que es donde se generan los archivos SEO.

## 3. Google Search Console **[Rodrigo]**

Es el panel gratuito donde Google dice qué indexó y qué falló.

1. Entrar en [search.google.com/search-console](https://search.google.com/search-console) con
   una cuenta de Google.
2. *Agregar propiedad* → tipo **Dominio** (cubre `www`, sin `www`, http y https a la vez).
3. Verificar con el **registro TXT en el DNS** que muestra Google (se crea en el mismo panel
   del dominio donde se crearon los registros de Cloud Run). Tarda minutos u horas.
4. *Sitemaps* → enviar `https://www.rodrigolazo.cl/sitemap.xml` (con el dominio real).
5. *Inspección de URL* → pegar la portada → *Solicitar indexación*. Repetir tras cambios
   grandes de contenido.
6. Revisar a los pocos días *Páginas* (qué se indexó) y *Mejoras* (datos estructurados,
   usabilidad móvil).

## 4. Perfil de Empresa en Google **[Rodrigo]** — la palanca principal

Para búsquedas como «podólogo a domicilio Santiago» o «podólogo cerca de mí», lo que
aparece primero es el **mapa con fichas de negocios**, no las páginas web. Sin ficha, la web
compite solo por los resultados de abajo.

1. Crear la ficha en [business.google.com](https://business.google.com) como **negocio con
   servicio a domicilio** (sin dirección pública; se declara el área de cobertura: Región
   Metropolitana y las comunas o regiones que correspondan).
2. Categoría principal: **Podólogo**. Añadir los servicios con los mismos nombres de la web
   (uña encarnada, callos y durezas, hongos en las uñas, talón agrietado, pie diabético).
3. Enlazar la web con el dominio real, poner teléfono y horario reales, subir fotos propias
   (nada de banco de imágenes).
4. Verificar la ficha (Google pide vídeo, llamada o carta según el caso).
5. **Pedir reseñas** a cada paciente atendido, con el enlace corto que da la ficha. Las reseñas
   son el factor que más mueve la posición en el mapa. Responderlas todas.
6. Mantener la ficha viva: una publicación al mes y responder preguntas.

## 5. Comprobar que todo está bien **[Rodrigo o código]**

| Qué                       | Dónde                                                                                          | Resultado esperado                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Datos estructurados       | [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results)                | Detecta `MedicalBusiness` y `FAQPage` sin errores                |
| Vista previa al compartir | [opengraph.xyz](https://www.opengraph.xyz) o enviar la URL por WhatsApp                        | Título, descripción e imagen azul con la huella                  |
| Velocidad y Core Web Vitals | [PageSpeed Insights](https://pagespeed.web.dev)                                               | Móvil en verde; el modelo 3D se carga aparte y no bloquea        |
| Indexación                | Buscar `site:www.rodrigolazo.cl` en Google                                                     | Aparece la portada con el título de `seo.ts`                     |
| Móvil                     | `CI=1 npm run build && CI=1 npm run test:e2e`                                                  | Los proyectos *Mobile Chrome* y *Mobile Safari* pasan            |

Sobre las preguntas frecuentes: desde 2023 Google solo muestra el desplegable de FAQ en
resultados de sitios gubernamentales o de salud reconocidos. El JSON-LD de FAQ sigue siendo
útil para que Google entienda el contenido, pero no hay que esperar ese formato visual.

## 6. Contenido que sí mueve la aguja **[Rodrigo]**

- **Una página por tratamiento** (`/una-encarnada`, `/pie-diabetico`…) con 300–600 palabras
  cada una: qué es, cuándo consultar, cómo se trata, qué incluye la sesión. Hoy todo vive en
  una sola página; las búsquedas específicas («uña encarnada tratamiento Santiago») necesitan
  páginas específicas. Es la siguiente mejora de código con más impacto.
- **Comunas de cobertura** nombradas en el texto (Providencia, Las Condes, Maipú, Puente
  Alto…): Google asocia la página a esas búsquedas locales.
- **Fotos propias** del instrumental, del profesional y del proceso, con `alt` descriptivo.
- **Credenciales verificables**: título, registro en la Superintendencia de Salud. Para
  contenido de salud Google exige señales de experiencia y confianza (E-E-A-T).
- Evitar textos genéricos copiados de otras webs de podología: el contenido duplicado no
  posiciona.

## 7. Siguiente paso técnico (opcional)

Hoy la página se renderiza en el navegador con JavaScript. Google lo ejecuta y la indexa,
pero con algo de retraso y otros buscadores o vistas previas pueden ver el HTML vacío.
**Prerenderizar** la portada en el build (HTML completo servido desde Nginx, con Vue
«hidratando» encima) elimina esa dependencia. Es un cambio acotado pero transversal:
`main.ts`, un `entry-server.ts`, el paso de build del Dockerfile y revisar cada acceso a
`window` o `document`. Conviene hacerlo cuando existan las páginas por tratamiento del
punto 6, que son las que más se benefician.

## 8. Lista de verificación rápida

- [ ] Dominio comprado y en `siteUrl`
- [ ] Datos «por confirmar» reemplazados en `landing.ts`
- [ ] Desplegado en Cloud Run con dominio propio y HTTPS
- [ ] Search Console verificada y sitemap enviado
- [ ] Portada inspeccionada e indexación solicitada
- [ ] Perfil de Empresa creado, verificado y con servicios
- [ ] Primeras cinco reseñas pedidas
- [ ] Prueba de resultados enriquecidos sin errores
- [ ] PageSpeed móvil en verde
