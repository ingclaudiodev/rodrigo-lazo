# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Personas en Chile con una molestia en los pies (uña encarnada, callosidades, hongos,
dolor al caminar) o que cuidan a un familiar con pie diabético, y quieren agendar
hora con un podólogo clínico. Llegan desde el teléfono y necesitan entender rápido
qué trata, si es para ellas y cómo reservar.

## Product Purpose

Landing page de Rodrigo Lazo, podólogo clínico independiente (confirmado por el
usuario). Existe para presentar sus tratamientos y convertir visitas en horas
agendadas. Éxito: el visitante agenda una sesión o deja sus datos para ser
contactado.

## Positioning

Atención podológica personal y directa: quien evalúa, trata e indica es el mismo
profesional. [Hipótesis a confirmar con el usuario.]

## Capabilities and Constraints

- Acción principal confirmada: agendar una reunión. El enlace de agenda aún no
  existe; queda como `TODO` en `src/content/landing.ts` hasta que el usuario lo
  entregue.
- Acción secundaria: formulario de contacto (hoy abre el cliente de correo).
- Cobertura confirmada por el usuario: atención a domicilio en toda la Región
  Metropolitana; otras regiones con recargo adicional (monto no confirmado).
- Mapa de dolor/molestia: el visitante marca partes del pie con tipo (dolor o
  molestia) e intensidad 1–10; se guarda en el dispositivo y se adjunta al mensaje.
- Stack fijado por el usuario: Vue 3 con componentes TSX, Tailwind CSS 4 y daisyUI 5,
  lógica repartida en `src/composables` y `src/services`.
- Especialidad confirmada: podología clínica. Dirección de consulta, horarios,
  formación, registro profesional y coberturas de salud (Fonasa/Isapre) NO están
  confirmados: el contenido los marca como "por confirmar" y nunca los presenta
  como hechos. La cobertura territorial (RM y regiones) sí está confirmada.

## Brand Commitments

- Nombre: Rodrigo Lazo.
- El usuario descartó explícitamente glassmorphism y liquid glass.
- Dirección elegida por el usuario entre tres propuestas: Podograma (mapa de presión
  plantar como figura central, base clara, tinta navy).
- Paleta fijada por el usuario: principal #3498db, secundario #ecf0f1, efectos #1abc9c.
- Fondos fijados por el usuario: general #ecf0f1; hero en degradado #3498db → #ecf0f1;
  secciones importantes (primera sesión, agenda) en #3498db.
- Escala de dolor fijada por el usuario: 1 blanco, 5 amarillo, 10 rojo, tonos suaves.

## Evidence on Hand

Ninguna todavía. No existen logo, fotografías, testimonios, clientes ni
credenciales verificables. Nada de eso debe inventarse; el contenido de ejemplo se
etiqueta como ejemplo y se entrega la lista de reemplazos pendientes.

## Product Principles

- Que agendar sea la acción obvia desde el primer vistazo, en móvil primero.
- Hablar como el profesional habla con un paciente: claro, cercano, sin jerga.
- No prometer lo que no está confirmado: ni cifras, ni credenciales, ni coberturas.
- Base clínica clara y tinta navy; el gradiente azul→verde agua existe solo como
  escala de presión del podograma, nunca como decoración. El texto siempre se lee.
