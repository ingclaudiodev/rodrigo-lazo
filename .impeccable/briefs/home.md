# Surface brief: Home (src/views/HomeView.tsx)

Scope: landing de una sola ruta `/`. Modo: Persuade.
Audiencia: pacientes con molestias en los pies y cuidadores de personas con pie
diabético, en Chile, desde el móvil.
Acción: agendar una hora (enlace pendiente, TODO en content). Secundaria: formulario.
Pruebas disponibles: ninguna real; sin fotos, logo ni testimonios. Nada se inventa.
Restricciones: Vue TSX + Tailwind 4 + daisyUI 5; paleta #3498db / #ecf0f1 / #1abc9c;
lógica en composables y services. Descartado por el usuario: glassmorphism y liquid glass.
Pedidos posteriores del usuario (vinculantes): pie 3D completo (planta y dorso) con
three.js; selección por partes con escala dolor/molestia 1–10 (blanco → amarillo → rojo)
persistida; hero azul → claro; fondo general #ecf0f1 y secciones importantes en #3498db;
sin la parte "arco" en la lista; cobertura a domicilio RM y regiones con recargo.

## Direction contract

THESIS: La página es un podograma vivo: el pie del paciente, con su mapa de presión,
que responde cuando el visitante señala qué le molesta y le permite marcar dónde y
cuánto le duele. Rechaza el héroe de titular centrado sobre fila de tarjetas con ícono,
el kicker, el texto degradado, el vidrio y el bloque de métricas.

OWN-WORLD: Base clara #ecf0f1; tinta navy #0f2238; azul de marca #3498db como campo
de color en el hero (degradado hacia la base), en la banda "primera sesión" (tinte) y
en la banda de agenda + pie de página (sólido); verde agua #1abc9c solo como escala de
presión y foco. Escala de dolor del visitante aparte: blanco → amarillo → rojo suaves.
Display Bricolage Grotesque (opsz 96), texto Onest, autoalojadas. Íconos SVG propios
de trazo 1.75. Radios 1rem en controles, 1.5rem en paneles. Sombras suaves con
desplazamiento. Figura: pie derecho 3D (three.js, procedimental, material mate claro)
con textura de presión en la planta; fallback SVG del podograma sin WebGL.

STORY: "Es un podólogo clínico que atiende a domicilio; reconozco mi molestia en el
pie, veo que tiene tratamiento, marco dónde y cuánto me duele y agendo".

FIRST VIEWPORT: Nav ligera (marca + 'Podólogo clínico', 3 enlaces, botón Agendar).
Campo azul → claro. Izquierda 7/12 (sticky): titular display en dos líneas con corte
controlado, párrafo de una frase, línea de cobertura con ícono, chips "¿Qué te
molesta?", línea de contexto (nombre clínico · zona · explicación), CTA navy "Agendar
una hora" y enlace "Ver tratamientos". Derecha 5/12: pie 3D (reposo: dorso y tobillo,
giro lento; al elegir chip o parte: planta de frente, dedos arriba) con leyenda de
presión y pista "Arrastra para girar"; debajo, panel "Marca dónde te duele o molesta"
(parte, Molestia/Dolor, intensidad 1–10 con pista de color, Guardar, lista de marcas).
En móvil todo apila en ese orden y el CTA queda visible sin scroll.

FORM: Podograma, primera de mi lista de siete (podograma, señalética clínica,
instrumental, ficha clínica, farmacia de barrio, calcetín/venda, tarjeta de citación),
elegida por el usuario entre tres cartas. Tirada de concept-seed NO disponible (el
launcher instalado solo ofrece `detect`); sustituto registrado: elección del usuario
entre tres cartas presentadas por el agente. DESIGN.md debe recoger esta nota.
Interacción firma: chip de síntoma o parte seleccionada → el pie gira hasta mostrar la
planta y enciende la zona; marcas del visitante pintadas en la planta y en los dedos.
Movimiento: giro lento en reposo, orientación con slerp 900 ms ease-out, transición de
color 350 ms; todo estático con reduced-motion. Sin bucles decorativos adicionales.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
