---
name: Rodrigo Lazo · Podograma
description: Landing clínica de una ruta donde un pie 3D con mapa de presión responde a la molestia del visitante; base clara, tinta navy, campos azules.
colors:
  base-100: "#ecf0f1"
  base-200: "#e1e7ea"
  ink: "#0f2238"
  primary: "#3498db"
  primary-ink: "#266b9d"
  primary-tint: "#cbe0ed"
  accent: "#1abc9c"
  error: "#b3261e"
  pain-1: "#ffffff"
  pain-5: "#f7d774"
  pain-10: "#e0564b"
  foot-skin: "#e9eff3"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem / 3rem (sm) / 3.75rem (md) / 4.5rem (lg)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "'opsz' 96"
  headline:
    fontFamily: "Bricolage Grotesque, Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem / 3rem (md)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
    fontVariation: "'opsz' 96"
  title:
    fontFamily: "Bricolage Grotesque, Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem / 1.25rem / 1.125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem / 1.125rem / 1.25rem (md)"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem / 0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  control:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem (btn-lg) / 0.75rem (btn-sm)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "normal"
  legend:
    fontFamily: "Onest, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  focus: "0.25rem"
  field: "1rem"
  box: "1.5rem"
  pill: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "2.5rem"
  3xl: "3rem"
  section: "5rem"
  section-md: "7rem"
  gutter: "1.25rem"
  container: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.base-100}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 1.75rem"
    height: "3rem"
  button-primary-small:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.base-100}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2rem"
  chip-symptom:
    backgroundColor: "rgba(236, 240, 241, 0.35)"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2rem"
  chip-symptom-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.base-100}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2rem"
  input-text:
    backgroundColor: "{colors.base-100}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0 0.75rem"
    height: "3rem"
  card:
    backgroundColor: "{colors.base-100}"
    textColor: "{colors.ink}"
    rounded: "{rounded.box}"
    padding: "1.5rem"
  panel-pain:
    backgroundColor: "#eff3f4"
    textColor: "{colors.ink}"
    rounded: "{rounded.box}"
    padding: "1.25rem 1.25rem 1.5rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "rgba(15, 34, 56, 0.65)"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.75rem"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.75rem"
---

# Design System: Rodrigo Lazo · Podograma

## Overview

**Creative North Star: "El podograma vivo"**

La página es un podograma: el pie del paciente, con su mapa de presión plantar, que responde cuando el visitante señala qué le molesta y le deja marcar dónde y cuánto le duele. Todo lo demás es consulta clínica clara: una base gris-azulada muy clara (#ecf0f1), tinta navy (#0f2238) para texto y controles, y el azul de marca (#3498db) usado como *campo* de color (hero, banda tintada de primera sesión, banda de agenda y pie de página), nunca como tinta de texto grande ni como botón. El verde agua (#1abc9c) sólo aparece como extremo alto de la escala de presión, como anillo de foco y como marca de verificación en las listas. La densidad es media-baja: secciones de 5–7 rem de respiro, una sola columna de lectura de 58–62 caracteres, controles con forma de píldora y paneles de esquinas amplias.

El mundo rechaza explícitamente el vidrio: no hay glassmorphism ni liquid glass, no hay héroe centrado sobre fila de tarjetas con ícono, ni kicker, ni texto degradado, ni bloque de métricas. La profundidad se logra con capas tonales (base-100 / base-200 / tinte azul) y una sola sombra suave desplazada. El único movimiento es el del pie: giro lento en reposo, orientación por slerp al elegir una zona y transición de color de la zona encendida; con `prefers-reduced-motion` todo queda estático.

Nota de procedencia (registrada por el reviewer de cierre): la dirección **Podograma** fue elegida por el usuario entre tres cartas presentadas por el agente; la tirada de *concept-seed* NO estaba disponible en el launcher de Impeccable instalado (sólo ofrece `detect`), y la elección del usuario entre tres cartas es el sustituto registrado.

Restricciones fijadas por el usuario, vinculantes para cualquier trabajo futuro: paleta #3498db (principal) / #ecf0f1 (secundario, fondo general) / #1abc9c (efectos); glassmorphism y liquid glass explícitamente rechazados; hero en degradado #3498db → #ecf0f1; secciones importantes (primera sesión, agenda) en #3498db; escala de dolor 1 blanco → 5 amarillo → 10 rojo en tonos suaves; pie 3D (planta y dorso) con three.js; marcas de dolor/molestia persistidas por dispositivo. Donde el build aterrizó distinto del enunciado literal, este documento registra lo construido y lo anota: el degradado del hero termina en base-100 (#ecf0f1) y se funde sin borde con la sección siguiente; la banda de primera sesión es un tinte al 18 % de azul sobre la base y no azul sólido; y la de agenda arranca clara y llega al azul sólido a los 60 % de su altura, que continúa en el pie de página.

**Key Characteristics:**
- Base clínica clara (#ecf0f1) con tinta navy (#0f2238); el azul de marca es fondo, no tinta.
- Un solo degradado de marca: azul → verde agua, y sólo como escala de presión plantar.
- Escala de dolor del visitante aparte: blanco → amarillo suave → rojo suave, 1 a 10.
- Bricolage Grotesque (opsz 96, −0.03em) para titulares; Onest para todo el texto.
- Íconos SVG propios de trazo 1.75, viewBox 24, terminaciones redondeadas.
- Controles píldora (999px), campos a 1rem, paneles a 1.5rem; una sombra suave desplazada.
- Movimiento sólo en el pie 3D: slerp 900 ms `outExpo`, color 350 ms, giro lento en reposo; estático con reduced-motion.

## Colors

Paleta de consulta: gris-azulado claro de fondo, navy de tinta, azul de marca como campo y verde agua reservado a la presión y al foco.

### Primary
- **Azul de marca** (`{colors.primary}`): campo de color. Degradado vertical del hero (100 % arriba → 70 % → 30 % → base-100 abajo, paradas a 0/28/62/100 %), tinte al 18 % en la banda "primera sesión", sólido en el tramo final de "Agenda tu hora" y en el pie de página. Extremo *bajo* de la escala de presión plantar. Nunca texto grande ni botón.
- **Tinta azul** (`{colors.primary-ink}`): azul oscurecido (`color-mix(in srgb, #3498db 62%, #0f2238)`) para texto pequeño que debe leerse sobre base clara (nombre clínico del tratamiento, numerales de pasos). Cumple 4.5:1.
- **Tinte azul** (`{colors.primary-tint}`): `color-mix(in srgb, #3498db 18%, #ecf0f1)`, fondo de la banda "primera sesión".

### Secondary
- **Verde agua** (`{colors.accent}`): extremo *alto* de la escala de presión plantar (textura 3D, barra de leyenda, zonas del podograma SVG y mini-huellas), anillo de foco (`outline: 2px solid`, offset 3px), anillo discontinuo de la zona seleccionada, emisivo de la parte seleccionada en 3D, marcas de verificación de "incluye", caret de los campos y fondo de selección al 35 %. Nunca como fondo de sección ni botón.

### Tertiary (escala de dolor del visitante)
- **Dolor 1 · blanco** (`{colors.pain-1}`), **Dolor 5 · amarillo suave** (`{colors.pain-5}`), **Dolor 10 · rojo suave** (`{colors.pain-10}`): interpolación lineal en RGB entre las tres paradas; pinta la pista del slider, el valor "n/10", el punto de cada marca guardada y las manchas del visitante sobre la planta y los dedos. Es la única familia cálida del sistema.
- **Error** (`{colors.error}`): sólo mensajes de validación del formulario, como texto sobre base clara.

### Neutral
- **Base clara** (`{colors.base-100}`): fondo general, nav (al 90 %), tarjetas de FAQ y formulario, chips guardados.
- **Base media** (`{colors.base-200}`): fondo de "Preguntas frecuentes" y color de canal del scrollbar.
- **Tinta navy** (`{colors.ink}`): texto, botones primarios, bordes al 10–30 %, sombra suave al 30 %. Jerarquía por opacidad: 100 % títulos y cuerpo principal, 90 % párrafos del hero, 80 % descripciones, 75 % notas, 65–70 % etiquetas y nav inactivo, 55–60 % textos "por confirmar" en cursiva.
- **Piel del pie 3D** (`{colors.foot-skin}`): material mate del modelo y fondo de la textura; la retícula de la planta es `rgba(15, 34, 56, 0.07)`.

El tema daisyUI define además `base-300` (#d3dbdf), `primary-content` (#0b1a2b), `accent-content` (#06241d), `error-content` (#fff5f3) y `warning` (#f1c40f); ninguno se usa en una superficie visible (el texto sobre azul es `ink`), por eso no entran en los tokens. `info` y `success` son alias de `primary` y `accent`.

### Named Rules
**The One Gradient Rule.** El degradado azul → verde agua existe sólo como escala de presión plantar (textura, leyenda, podograma SVG). Ningún texto, botón ni fondo lo usa como decoración.

**The Field, Not Ink Rule.** El azul de marca es un campo de fondo (hero, tinte, agenda, pie); el texto y los botones sobre él son navy. Para texto azul pequeño se usa `primary-ink`, nunca `primary`.

**The Two Scales Rule.** Presión (azul → verde agua) y dolor (blanco → amarillo → rojo) no se mezclan: la presión describe el pie, el dolor lo marca el visitante, y siempre se pintan en capas distintas.

## Typography

**Display Font:** Bricolage Grotesque (con Onest, ui-sans-serif, system-ui) — autoalojada en `public/fonts/`, eje de peso 200–800, `font-variation-settings: 'opsz' 96` en toda la clase display.
**Body Font:** Onest (con ui-sans-serif, system-ui) — autoalojada, peso 300–800.

**Character:** Bricolage a tamaño óptico 96 con tracking −0.03em da titulares compactos y un poco excéntricos, de consulta moderna; Onest debajo es neutra, amplia y legible en móvil. No hay versalitas, ni kickers, ni texto en mayúsculas.

### Hierarchy
- **Display** (700, 2.5rem → 3rem sm → 3.75rem md → 4.5rem lg, line-height 1, −0.03em): sólo el titular del hero, en dos líneas con corte controlado (`<br>`).
- **Headline** (700, 2.25rem → 3rem md, tracking-tight, `text-balance`): título de cada sección (Tratamientos, Cómo es la primera sesión, Quién te atiende, Preguntas frecuentes, Agenda tu hora). En Tratamientos y FAQ va en la columna izquierda, sticky a `top: 7rem` en lg.
- **Title** (600, 1.5rem tratamientos y pasos / 1.25rem panel de dolor / 1.125rem pregunta de FAQ, tracking-tight): títulos dentro de listas y paneles. Marca del nav: 1.125rem, 700.
- **Body** (400, 1rem base; 1.125rem párrafos de sección y subtítulo de agenda; 1.25rem subtítulo del hero en md; line-height 1.625): ancho máximo 58ch en el hero, 62ch en "Quién te atiende", 48ch en agenda.
- **Label** (500–600, 0.875rem etiquetas de campo, nav, líneas "incluye"; 0.75rem notas, leyenda del pie, enlaces secundarios): sin mayúsculas ni tracking extra. Valores numéricos con `tabular-nums`.
- **Control** (600, Onest; 1.125rem en botones grandes, 0.75rem en botones pequeños y chips de síntoma): la escala `btn-lg`/`btn-sm` de daisyUI, sin variar el peso.
- **Legend** (600, 11px, +0.04em): únicamente el título de la leyenda dentro del podograma SVG.

### Named Rules
**The No Kicker Rule.** Ninguna sección lleva kicker, eyebrow ni etiqueta en mayúsculas sobre el título. El titular abre solo.

**The Breakpoint Ramp Rule.** La escala tipográfica salta por breakpoint (sm/md/lg), no por `clamp()`.

## Layout

Contenedor único de 72rem (`max-w-6xl`) centrado con gutter de 1.25rem; ancho de lectura limitado por `ch` dentro del contenedor. Grid de 12 columnas sólo desde lg (1024px): hero 7/5 (texto sticky a `top: 6rem`, figura + panel a la derecha), Tratamientos 4/8 (título sticky), Quién te atiende 7/5, FAQ 4/8, Agenda 5/7 (texto + canales / formulario). Pasos de primera sesión en tres columnas desde md. Por debajo de lg todo apila en el orden del DOM salvo una excepción: el CTA "Agendar una hora" y "Ver tratamientos" pasan delante de los chips de síntomas (`order-1 lg:order-none` en chips y texto de ayuda) para que agendar quede en la primera pantalla de un móvil de 664 px de alto; el pie 3D viene después del CTA.

Ritmo vertical: secciones a `py-20` (5rem) y `py-28` (7rem) en md; hero `pt-10 pb-16` / `pt-16 pb-24` en md. Gaps internos en la escala 0.5 / 0.75 / 1 / 1.5 / 2 / 2.5 / 3rem; el hero separa sus bloques a 2rem; las filas de tratamientos a 2rem (`py-8`) con divisores de tinta al 10 %. Nav fija de 4rem (`h-16`) con `scroll-padding-top: 5rem` y `scroll-behavior: smooth` (auto con reduced-motion). Breakpoints de Tailwind: sm 640, md 768, lg 1024.

Escenario 3D: cuadrado en móvil, 5/4 desde sm, altura máxima `min(60vh, 30rem)`; el podograma SVG de respaldo llega a `min(78vh, 42rem)`.

## Elevation & Depth

Sistema híbrido, casi plano: la profundidad la dan las capas tonales (base-100 sobre base-200, tinte azul, campo azul sólido) y los bordes de tinta al 10–25 %. daisyUI corre con `--depth: 0` y `--noise: 0`, así que botones y campos no traen relieve propio. Existe una única sombra ambiental, suave y desplazada hacia abajo, derivada de la tinta navy; la llevan los contenedores que "flotan" sobre un campo de color (panel de dolor sobre el hero, formulario sobre el azul de agenda, acordeones de FAQ sobre base-200).

### Shadow Vocabulary
- **Sombra suave** (`box-shadow: 0 10px 28px -14px color-mix(in srgb, #0f2238 30%, transparent)`): paneles y tarjetas sobre un campo; utilidad `shadow-soft`.
- **Sombra del pulgar** (`box-shadow: 0 2px 6px rgb(15 34 56 / 0.25)`): sólo el pulgar del slider de intensidad.

### Named Rules
**The One Shadow Rule.** Una sola sombra para contenedores; nada de sombras duras, offset de color ni glows. Si un elemento no flota sobre un campo de color, no lleva sombra.

**The No Glass Rule.** Ningún panel, tarjeta ni héroe se construye como vidrio (superficie translúcida con desenfoque usada como material). Las superficies de contenido son opacas o tintes sólidos; las dos únicas translucidez del build son funcionales y no se extienden: la cabecera sticky (base-100 al 90 % con desenfoque leve para que el contenido no choque bajo ella) y los chips de síntoma sin seleccionar (base-100 al 35 % sobre el degradado del hero).

## Shapes

Tres radios y nada más: píldora (999px) para todo lo que se pulsa (botones, chips de síntoma, chips de marcas, enlaces del nav, barra de leyenda, pista y valor del slider); 1rem (`--radius-field`) para campos de texto, select y textarea; 1.5rem (`--radius-box`) para paneles, tarjetas, acordeones y la caja de "textos a confirmar". El anillo de foco redondea a 0.25rem salvo en el slider (píldora). Bordes de 1px en tinta al 10–30 % (al 25 % discontinuos en la caja de pendientes); el pie 3D es una forma orgánica mate, sin contorno, y el podograma SVG usa trazo de 1.5 en tinta al 35 %. Los íconos repiten la gramática: trazo 1.75, `stroke-linecap: round`, `stroke-linejoin: round`.

## Components

### Buttons
- **Shape:** píldora (999px) en todas las variantes.
- **Primary (`btn-neutral`):** fondo tinta navy, texto base clara, Onest 600. `btn-lg`: 1.125rem, 3rem de alto, `px-7` (1.75rem) en los CTA ("Agendar una hora", "Enviar mensaje"). `btn-sm`: 0.75rem, 2rem de alto, `px-4` (1rem) en el nav, Guardar y chips seleccionados. Ícono de 20px (16px en sm) a la izquierda del texto.
- **Hover / Focus:** daisyUI oscurece ligeramente el navy; foco visible con anillo verde agua de 2px a 3px de offset.
- **Ghost:** transparente, texto navy, misma píldora (Quitar, botón del menú móvil). **Outline:** borde tinta al 30 %, se usa en el `join` Molestia/Dolor (ahí con esquinas de campo, no píldora). **Link:** `link link-hover` en Onest 500 con ícono de flecha de 18px ("Ver tratamientos").

### Chips
- **Symptom chip (hero):** `btn-sm` píldora de 2rem, fondo base clara al 35 % sobre el degradado azul, borde tinta al 30 %, texto navy 0.75rem/600; hover: borde navy y fondo al 70 %. Seleccionado: navy sólido con texto claro (`aria-pressed`). Al pasar o enfocar, el pie 3D enciende la zona; al pulsar, gira a la planta.
- **Saved mark chip (panel de dolor):** píldora de fondo base-100, borde tinta al 20 %, 0.8rem, punto de 0.85rem pintado con el color de la escala de dolor; hover y seleccionado: borde navy; transición de borde 150 ms.

### Cards / Containers
- **Corner Style:** 1.5rem.
- **Background:** base-100 (formulario, acordeones); el panel de dolor usa `color-mix(#ecf0f1 82%, white)` ≈ #eff3f4 para despegarse del hero.
- **Shadow Strategy:** sombra suave únicamente cuando el contenedor está sobre un campo de color (ver Elevation).
- **Border:** ninguno en tarjetas; 1px tinta al 10 % como divisor interno; dashed al 25 % sólo en la caja de "textos a confirmar".
- **Internal Padding:** 1.5rem (2rem en md) en el formulario; 1.25rem/1.5rem en el panel de dolor; acordeón según `collapse` de daisyUI.

### Inputs / Fields
- **Style:** `input-lg`/`textarea-lg` de daisyUI (3rem de alto, texto Onest 1.125rem, padding lateral 0.75rem), fondo base-100, borde 1px, radio 1rem. El `select` va en tamaño base (2.5rem, 0.875rem) y sustituye el caret nativo por el chevron propio de trazo 1.75 en navy (1.1rem, a 0.9rem del borde derecho). Caret de texto verde agua. Etiquetas `label` 0.875rem/500 encima del campo.
- **Focus:** anillo verde agua 2px, offset 3px.
- **Error / Disabled:** `input-error`/`textarea-error` con mensaje 0.875rem en `error` y `role="alert"`; fieldsets deshabilitados al 55 % de opacidad; botón deshabilitado atenuado por daisyUI.
- **Range (intensidad):** pista de 0.6rem píldora con el degradado de dolor y borde tinta al 20 %; pulgar de 1.35rem, fondo del color actual de la escala, borde 2px navy, sombra del pulgar; `aria-valuetext` "n de 10".

### Navigation
- **Style:** cabecera sticky de 4rem, base-100 sólida (sin desenfoque: el mundo rechaza el vidrio) y borde inferior tinta al 10 %. Marca en dos líneas (nombre Bricolage 1.125rem/700 + "Podólogo clínico" 0.75rem/500 al 65 %). Enlaces píldora 0.875rem/500: inactivo tinta al 65 %, hover y activo (`aria-current`, por sección visible) tinta al 100 %, transición de color. CTA `btn-neutral btn-sm` a la derecha.
- **Mobile:** botón `btn-ghost btn-square btn-sm` con íconos `menu`/`x` de 22px; panel desplegable bajo la cabecera, enlaces a `py-3 text-base`, CTA píldora a ancho completo.
- **Footer:** sobre azul sólido, contenedor con borde superior tinta al 15 %, texto 0.875rem navy, enlaces `link-hover`.

### Signature: Pie 3D con mapa de presión
Pie derecho procedimental en three.js (`MeshPhysicalMaterial`, roughness 0.62, metalness 0, sheen blanco, color `foot-skin`), iluminado con hemisférica blanca/azulada y tres direccionales; fondo transparente sobre el degradado del hero. La planta lleva una textura canvas: base `foot-skin`, retícula tinta al 7 % sólo en la planta, manchas de presión desenfocadas en azul (baja) y verde agua (alta); encima, las marcas del visitante con el color de la escala de dolor, y un anillo discontinuo verde agua en la zona que se edita. Los dedos son mallas propias que se tiñen al 60 % hacia verde agua cuando están activos. Leyenda debajo: título 0.75rem/600 +0.04em, barra píldora de 0.5rem con el degradado azul → verde agua, extremos "baja / alta", y pista en cursiva "Arrastra para girar el pie". Cursor `grab`/`grabbing`; arrastre con umbral de 6px (yaw 0.01 rad/px, pitch 0.006 rad/px).

**Motion grammar (única del sistema):** en reposo muestra dorso y tobillo y gira 0.0022 rad por frame, sólo tras 4 s sin interacción y sin puntero encima. Al elegir un chip o una parte, una sola interpolación de orientación (slerp de cuaterniones) de 900 ms con `outExpo` lleva la planta al frente con los dedos arriba. El color de dedos y partes transiciona en 350 ms `outQuad`; en el podograma SVG las zonas atenúan/encienden en 0.3 s `cubic-bezier(0.16, 1, 0.3, 1)` (opacidad 0.22 ↔ 1, `saturate(1.3)`), el anillo entra en 0.45 s y la entrada única del SVG florece de talón a dedos en 700 ms con escalonado de 110 ms. Con `prefers-reduced-motion: reduce` no hay giro, ni slerp, ni transiciones: cada cambio se pinta en un solo frame. Sin otros bucles decorativos en la página.

Sin WebGL, el componente cae al podograma SVG (`PodogramaFigure`) con la misma paleta y leyenda; en la lista de tratamientos cada ítem lleva una mini-huella (`PodogramaMini`, 2.25 × 4.5rem) con las zonas en verde agua al 85 %.

### Signature: Panel "Marca dónde te duele o molesta"
Contenedor 1.5rem con sombra suave; título 1.25rem Bricolage 600; `select` de parte + `join` Molestia/Dolor; slider de intensidad con salida "n/10" en píldora pintada con el color actual; botón Guardar `btn-neutral btn-sm`; lista de marcas en chips con punto de color, divisor superior tinta al 12 %. Las marcas persisten en el dispositivo (`localStorage`, clave `rodrigo-lazo.pain-marks.v1`) y se adjuntan como resumen al mensaje de contacto.

## Do's and Don'ts

### Do:
- **Do** usar #ecf0f1 como fondo general y #0f2238 como tinta; el azul #3498db va en campos (hero degradado, tinte al 18 %, agenda y pie sólidos) y el texto sobre él sigue siendo navy.
- **Do** reservar el degradado #3498db → #1abc9c a la escala de presión plantar (textura, leyenda, podograma SVG) y usar #1abc9c además sólo para foco, caret, selección y marcas de verificación.
- **Do** pintar el dolor del visitante con la escala 1 #ffffff → 5 #f7d774 → 10 #e0564b (interpolación lineal) en capa separada del mapa de presión, y persistir las marcas por dispositivo.
- **Do** componer titulares en Bricolage Grotesque 700 con `'opsz' 96` y −0.03em, y todo el texto en Onest; ambas autoalojadas desde `public/fonts/`.
- **Do** dibujar íconos como SVG propios de trazo 1.75 con terminaciones redondeadas, en `currentColor`, tamaños 16/18/20/22px.
- **Do** mantener tres radios: píldora en controles pulsables, 1rem en campos, 1.5rem en paneles; y una sola sombra `0 10px 28px -14px` de tinta al 30 % sólo sobre campos de color.
- **Do** mover únicamente el pie: slerp 900 ms `outExpo`, color 350 ms, giro lento en reposo; todo estático bajo `prefers-reduced-motion`.
- **Do** mostrar cualquier dato "por confirmar" (formación, registro, horarios, recargo, correo, teléfono, enlace de agenda) en cursiva al 55–60 % de tinta o dentro de la caja de borde discontinuo "Textos a confirmar", nunca con el peso visual de un hecho (ver `pendingReview` en `src/content/landing.ts` y PRODUCT.md).

### Don't:
- **Don't** construir paneles, tarjetas o héroes de vidrio (glassmorphism, liquid glass): el usuario los rechazó explícitamente.
- **Don't** usar kickers, eyebrows, texto en mayúsculas con tracking, texto con degradado, filas de tarjetas con ícono bajo un titular centrado ni bloques de métricas.
- **Don't** usar #3498db como color de texto pequeño ni como botón; para texto azul legible usar `primary-ink` (#266b9d) y para botones la tinta navy.
- **Don't** decorar con el degradado azul → verde agua ni introducir otras familias cálidas fuera de la escala de dolor.
- **Don't** añadir sombras duras, glows, relieve de daisyUI (`--depth`), ruido, ni bucles de animación distintos del giro lento del pie.
- **Don't** presentar como hechos la formación, el registro profesional, los horarios, las coberturas de salud ni el monto del recargo mientras sigan "por confirmar".
