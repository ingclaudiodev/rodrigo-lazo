/**
 * Contenido de la landing de Rodrigo Lazo, podólogo clínico.
 *
 * Regla: nada que no esté confirmado se presenta como hecho. Los campos marcados
 * `POR_CONFIRMAR` se muestran con esa etiqueta en pantalla hasta reemplazarlos.
 *
 * TODO(rodrigo): reemplazar `booking.href` por el enlace real de agenda
 * (Calendly, Cal.com, Google Calendar…). Mientras tanto el botón lleva al formulario.
 */

export const POR_CONFIRMAR = 'por confirmar'

export type ZoneId = 'hallux' | 'toes' | 'metatarsal' | 'lateral' | 'heel' | 'dorsum' | 'ankle'

export interface NavLink {
  label: string
  href: string
}

export interface Symptom {
  id: string
  label: string
  /** Nombre clínico, se muestra en pequeño. */
  clinical: string
  zones: ZoneId[]
  context: string
}

export interface Treatment {
  id: string
  title: string
  clinical: string
  description: string
  includes: string[]
  zones: ZoneId[]
}

export interface ProcessStep {
  title: string
  description: string
}

export interface FaqItem {
  question: string
  answer: string
  pending?: boolean
}

export interface ContactChannel {
  label: string
  value: string
  href: string
  pending?: boolean
}

export const brand = {
  name: 'Rodrigo Lazo',
  role: 'Podólogo clínico',
} as const

export const booking = {
  label: 'Agendar una hora',
  /** TODO(rodrigo): enlace real de agenda. Hasta entonces apunta al formulario. */
  href: '#agenda',
  pending: true,
} as const

export const navLinks: NavLink[] = [
  { label: 'Tratamientos', href: '#tratamientos' },
  { label: 'Primera sesión', href: '#primera-sesion' },
  { label: 'Preguntas', href: '#preguntas' },
]

export const hero = {
  title: 'Cuida tus pies con un podólogo clínico.',
  /** Corte de línea controlado del titular. */
  titleLines: ['Cuida tus pies con', 'un podólogo clínico.'],
  subtitle:
    'Rodrigo Lazo evalúa, trata e indica personalmente: uñas encarnadas, callosidades, hongos, verrugas plantares y cuidado del pie diabético.',
  coverage:
    'Atención a domicilio en toda la Región Metropolitana. Otras regiones, con recargo adicional.',
  prompt: '¿Qué te molesta?',
  hint: 'Elige una molestia para ver en qué zona del pie se ubica y cómo se trata.',
  secondaryCta: { label: 'Ver tratamientos', href: '#tratamientos' },
  figureCaption: 'Modelo 3D del pie derecho con su mapa de presión plantar.',
  figureHint: 'Arrastra para girar el pie.',
  legend: { low: 'baja', high: 'alta', title: 'Presión plantar' },
} as const

export const symptoms: Symptom[] = [
  {
    id: 'una-encarnada',
    label: 'Uña encarnada',
    clinical: 'Onicocriptosis',
    zones: ['hallux'],
    context:
      'Se evalúa el borde de la uña y se trata la zona afectada con instrumental estéril. Casi siempre ocurre en el dedo mayor.',
  },
  {
    id: 'callosidades',
    label: 'Callos y durezas',
    clinical: 'Hiperqueratosis',
    zones: ['metatarsal', 'lateral'],
    context:
      'Retiro controlado de la piel engrosada y revisión de los puntos de apoyo que la producen, para que no vuelva tan pronto.',
  },
  {
    id: 'hongos',
    label: 'Hongos en las uñas',
    clinical: 'Onicomicosis',
    zones: ['hallux', 'toes'],
    context:
      'Evaluación de la uña, limpieza y plan de cuidado. Si hace falta tratamiento médico, se deriva.',
  },
  {
    id: 'talon',
    label: 'Talón agrietado',
    clinical: 'Fisuras del talón',
    zones: ['heel'],
    context:
      'Tratamiento de la piel del talón y revisión del apoyo, con indicaciones de cuidado para la casa.',
  },
  {
    id: 'pie-diabetico',
    label: 'Pie diabético',
    clinical: 'Cuidado preventivo',
    zones: ['hallux', 'toes', 'metatarsal', 'lateral', 'heel'],
    context:
      'Revisión preventiva de piel, uñas y puntos de presión, con indicaciones de cuidado diario. El manejo de heridas se coordina con tu médico.',
  },
]

export const treatments: Treatment[] = [
  {
    id: 'onicocriptosis',
    title: 'Uña encarnada',
    clinical: 'Onicocriptosis',
    description:
      'Cuando el borde de la uña se clava en la piel, duele y a veces se inflama. Se trata el borde afectado y se revisa cómo se corta la uña para que no se repita.',
    includes: [
      'Evaluación del borde ungueal',
      'Procedimiento con instrumental estéril',
      'Indicaciones de corte y cuidado',
    ],
    zones: ['hallux'],
  },
  {
    id: 'hiperqueratosis',
    title: 'Callos y durezas',
    clinical: 'Hiperqueratosis y helomas',
    description:
      'La piel se engrosa donde hay roce o presión repetida. Se retira de forma controlada y se identifica qué la provoca: calzado, apoyo o forma del pie.',
    includes: [
      'Retiro controlado de la hiperqueratosis',
      'Revisión de puntos de apoyo',
      'Recomendaciones de calzado',
    ],
    zones: ['metatarsal', 'lateral', 'heel'],
  },
  {
    id: 'onicomicosis',
    title: 'Hongos en las uñas',
    clinical: 'Onicomicosis',
    description:
      'Uñas gruesas, opacas o quebradizas. Se evalúa el estado de la uña, se limpia y se define un plan de cuidado; si requiere tratamiento médico, se deriva.',
    includes: [
      'Evaluación y limpieza de la lámina',
      'Plan de cuidado',
      'Derivación cuando corresponde',
    ],
    zones: ['hallux', 'toes'],
  },
  {
    id: 'verrugas',
    title: 'Verrugas plantares',
    clinical: 'Papilomas',
    description:
      'Lesiones en la planta que molestan al pisar. Se evalúan para distinguirlas de un callo y se define el tratamiento o la derivación adecuada.',
    includes: ['Diagnóstico diferencial', 'Tratamiento o derivación', 'Prevención del contagio'],
    zones: ['metatarsal', 'heel'],
  },
  {
    id: 'pie-diabetico',
    title: 'Cuidado del pie diabético',
    clinical: 'Podología preventiva',
    description:
      'Las personas con diabetes necesitan revisar sus pies con regularidad. Se evalúan piel, uñas, sensibilidad y puntos de presión, y se entregan indicaciones de cuidado diario.',
    includes: [
      'Revisión de piel, uñas y presión',
      'Corte y cuidado ungueal seguro',
      'Indicaciones para la casa y la familia',
    ],
    zones: ['hallux', 'toes', 'metatarsal', 'lateral', 'heel'],
  },
  {
    id: 'general',
    title: 'Podología general',
    clinical: 'Corte y cuidado profesional',
    description:
      'Corte y limpieza profesional de uñas y piel para quienes no pueden hacerlo con comodidad o prefieren hacerlo bien y de forma segura.',
    includes: [
      'Corte y limado de uñas',
      'Limpieza de piel y pliegues',
      'Hidratación e indicaciones',
    ],
    zones: ['hallux', 'toes', 'heel'],
  },
]

export const process = {
  title: 'Cómo es la primera sesión',
  steps: [
    {
      title: 'Conversamos y evalúo',
      description:
        'Me cuentas qué te molesta y desde cuándo. Reviso piel, uñas y cómo apoyas el pie.',
    },
    {
      title: 'Trato lo que encontramos',
      description:
        'Procedimiento con instrumental esterilizado, explicándote cada paso antes de hacerlo.',
    },
    {
      title: 'Te vas con indicaciones',
      description:
        'Cuidados concretos para la casa y, si corresponde, fecha de control o derivación.',
    },
  ] as ProcessStep[],
} as const

export const about = {
  title: 'Quién te atiende',
  paragraphs: [
    'Soy Rodrigo Lazo, podólogo clínico. Atiendo personalmente cada sesión: la misma persona que te evalúa es la que te trata y la que te explica cómo cuidarte después.',
    'Trabajo con instrumental esterilizado y te explico cada paso antes de hacerlo. Si algo escapa a la podología, te lo digo y te derivo.',
    'Atiendo a domicilio en toda la Región Metropolitana, y también en otras regiones con un recargo adicional por el traslado.',
  ],
  /** TODO(rodrigo): completar con datos reales antes de publicar. */
  facts: [
    { label: 'Formación', value: POR_CONFIRMAR, pending: true },
    { label: 'Registro profesional', value: POR_CONFIRMAR, pending: true },
    {
      label: 'Lugar de atención',
      value: 'A domicilio en toda la Región Metropolitana; otras regiones con recargo adicional.',
      pending: false,
    },
  ],
} as const

export const faq = {
  title: 'Preguntas frecuentes',
  items: [
    {
      question: '¿Duele el procedimiento?',
      answer:
        'Depende del tratamiento y de la sensibilidad de cada persona. Antes de empezar te explico qué vas a sentir y trabajamos a tu ritmo.',
    },
    {
      question: '¿Qué llevo a la primera sesión?',
      answer:
        'Calzado cómodo y, si tienes diabetes u otra condición de salud, tus indicaciones médicas o medicamentos actuales.',
    },
    {
      question: '¿Atiendes pie diabético?',
      answer:
        'Sí: revisión preventiva y cuidado de piel y uñas. El manejo de heridas se coordina con tu médico tratante.',
    },
    {
      question: '¿Dónde atiendes y en qué horario?',
      answer: `A domicilio en toda la Región Metropolitana y también en otras regiones, con recargo adicional. Horarios ${POR_CONFIRMAR}.`,
    },
    {
      question: '¿Hay convenio con Fonasa o Isapre?',
      answer: `Coberturas y formas de pago ${POR_CONFIRMAR}.`,
      pending: true,
    },
  ] as FaqItem[],
} as const

export const contact = {
  title: 'Agenda tu hora',
  subtitle: 'Cuéntame qué te molesta y te respondo con las próximas horas disponibles.',
  channels: [
    { label: 'Correo', value: POR_CONFIRMAR, href: 'mailto:', pending: true },
    { label: 'Teléfono', value: POR_CONFIRMAR, href: 'tel:', pending: true },
  ] as ContactChannel[],
} as const

/**
 * Textos a confirmar con Rodrigo antes de publicar. Se muestran en la página
 * (sección "Quién te atiende") mientras la lista no esté vacía.
 */
export const pendingReview: string[] = [
  'Hero: "evalúa, trata e indica personalmente".',
  'Quién te atiende: "Atiendo personalmente cada sesión" e "instrumental esterilizado".',
  'Catálogo de seis tratamientos y qué incluye cada uno.',
  'Respuestas de Preguntas frecuentes redactadas en primera persona.',
  'Formación y registro profesional.',
  'Monto del recargo por atención en regiones y horarios de atención.',
  'Correo, teléfono y enlace de agenda.',
]

export const painMap = {
  title: 'Marca dónde te duele o molesta',
  intro:
    'Toca una parte del pie (o elígela en la lista), indica si es dolor o molestia y cuánto, del 1 al 10. Queda guardado en este dispositivo y se adjunta a tu mensaje.',
  zoneLabel: 'Parte del pie',
  zonePlaceholder: 'Elige una parte…',
  kinds: [
    { id: 'molestia', label: 'Molestia' },
    { id: 'dolor', label: 'Dolor' },
  ],
  intensityLabel: 'Intensidad',
  scaleLow: '1 · leve',
  scaleHigh: '10 · máximo',
  save: 'Guardar',
  remove: 'Quitar',
  savedTitle: 'Tus marcas',
  empty: 'Aún no has marcado ninguna parte.',
  clear: 'Borrar todo',
  attached: 'Tu mapa de molestias se adjuntará al mensaje.',
} as const

export const footer = {
  copyright: `© ${new Date().getFullYear()} ${brand.name}, ${brand.role.toLowerCase()}.`,
} as const
