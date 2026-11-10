import type { ZoneId } from '@/content/landing'

/**
 * Forma del pie como campo de distancia (SDF): volúmenes anatómicos fundidos con
 * uniones suaves, de modo que la malla resultante es una sola superficie orgánica.
 *
 * Ejes: +Z hacia los dedos, +Y hacia arriba, +X lado medial (dedo mayor).
 * Unidades: 1 = 10 cm. El suelo está en y = 0; el talón en z ≈ -1.3 y la punta
 * del dedo mayor en z ≈ +1.3 (misma longitud que la huella del podograma).
 */
export const FOOT_BOUNDS = {
  min: [-0.74, -0.1, -1.46] as const,
  max: [0.74, 1.3, 1.44] as const,
}

/** Altura a la que la pierna termina en un corte redondeado. */
export const LEG_TOP = 1.2

/** Grupos anatómicos del campo: 0 cuerpo, 1 tobillo/pierna, 2..6 dedos (mayor → menor). */
export const GROUP_COUNT = 7
const group = new Float64Array(GROUP_COUNT)
const FAR = 9
/** Más allá de estos planos el tobillo o los dedos ya no alteran la superficie. */
const ANKLE_REACH = 0.05
const TOES_REACH = 0.3

const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k)

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Elipsoide: cx, cy, cz, rx, ry, rz. */
type Ellipsoid = readonly [number, number, number, number, number, number]

function ellipsoid(x: number, y: number, z: number, e: Ellipsoid) {
  const px = (x - e[0]) / e[3]
  const py = (y - e[1]) / e[4]
  const pz = (z - e[2]) / e[5]
  const k0 = Math.sqrt(px * px + py * py + pz * pz)
  const qx = px / e[3]
  const qy = py / e[4]
  const qz = pz / e[5]
  const k1 = Math.sqrt(qx * qx + qy * qy + qz * qz)
  if (k1 < 1e-9) return -Math.min(e[3], e[4], e[5])
  return (k0 * (k0 - 1)) / k1
}

/** Segmento redondeado de radio variable: ax, ay, az, ra, bx, by, bz, rb. */
type Bone = readonly [number, number, number, number, number, number, number, number]

/** `flat` aplana la sección en vertical (dedos más anchos que altos). */
function bone(x: number, y: number, z: number, b: Bone, flat = 1) {
  const ay = b[1] / flat
  const py = y / flat - ay
  const px = x - b[0]
  const pz = z - b[2]
  const dx = b[4] - b[0]
  const dy = b[5] / flat - ay
  const dz = b[6] - b[2]
  const h = Math.min(1, Math.max(0, (px * dx + py * dy + pz * dz) / (dx * dx + dy * dy + dz * dz)))
  const ex = px - dx * h
  const ey = py - dy * h
  const ez = pz - dz * h
  return (Math.sqrt(ex * ex + ey * ey + ez * ez) - (b[3] + (b[7] - b[3]) * h)) * Math.min(1, flat)
}

// Cuerpo: talón, mediopié, empeine, antepié y cabezas metatarsianas.
const BODY: Ellipsoid[] = [
  [0.0, 0.3, -0.97, 0.3, 0.34, 0.35], // almohadilla del talón
  [0.0, 0.42, -0.6, 0.31, 0.4, 0.46], // retropié
  [0.02, 0.36, -0.2, 0.34, 0.34, 0.52], // mediopié / empeine
  [0.03, 0.24, 0.28, 0.43, 0.235, 0.5], // antepié
  [0.27, 0.17, 0.6, 0.235, 0.17, 0.27], // cabeza del primer metatarsiano
  [-0.03, 0.17, 0.66, 0.26, 0.165, 0.25], // cabezas centrales
  [-0.31, 0.15, 0.44, 0.185, 0.15, 0.29], // quinto metatarsiano
  [-0.27, 0.17, -0.25, 0.16, 0.17, 0.62], // borde externo
]

// Tobillo: pierna, maléolos (el externo más bajo y atrás) y tendón de Aquiles.
const LEG: Bone = [0.0, 0.6, -0.74, 0.3, 0.0, 1.8, -0.82, 0.33]
const LEG_NARROW = 1.14
const MALLEOLI: Ellipsoid[] = [
  [0.265, 0.82, -0.74, 0.13, 0.17, 0.16],
  [-0.275, 0.71, -0.84, 0.12, 0.16, 0.15],
]
const ACHILLES: Bone = [0.0, 0.4, -1.15, 0.08, 0.0, 1.8, -1.12, 0.105]

interface Toe {
  /** Falanges: base → nudillo → punta. */
  bones: [Bone, Bone]
  flat: number
  pad: Ellipsoid
  nail: Ellipsoid
}

function toe(
  base: [number, number, number],
  knuckle: [number, number, number],
  tip: [number, number, number],
  radii: [number, number, number],
  flat: number,
): Toe {
  const r = radii[2]
  return {
    bones: [
      [...base, radii[0], ...knuckle, radii[1]],
      [...knuckle, radii[1], ...tip, radii[2]],
    ],
    flat,
    pad: [tip[0], tip[1] - r * 0.12, tip[2] - r * 0.1, r * 1.2, r * 0.92, r * 1.32],
    nail: [tip[0], tip[1] + r * flat * 0.62, tip[2] - r * 0.05, r * 0.8, r * 0.42, r * 0.92],
  }
}

/** Dedos colocados sobre las mismas posiciones que la huella del podograma. */
export const TOES: Toe[] = [
  toe([0.25, 0.17, 0.78], [0.265, 0.165, 0.97], [0.275, 0.125, 1.14], [0.14, 0.132, 0.136], 0.86),
  toe([-0.01, 0.16, 0.84], [-0.02, 0.172, 1.03], [-0.027, 0.085, 1.2], [0.09, 0.082, 0.08], 0.92),
  toe([-0.19, 0.15, 0.79], [-0.21, 0.158, 0.97], [-0.222, 0.08, 1.13], [0.085, 0.078, 0.075], 0.92),
  toe([-0.33, 0.14, 0.69], [-0.355, 0.146, 0.87], [-0.373, 0.076, 1.02], [0.08, 0.073, 0.07], 0.92),
  toe(
    [-0.44, 0.13, 0.55],
    [-0.47, 0.132, 0.72],
    [-0.49, 0.072, 0.855],
    [0.076, 0.068, 0.066],
    0.94,
  ),
]

/** Origen del abanico de tendones extensores, delante del tobillo (x, z). */
const TENDON_ORIGIN = [0.06, -0.5] as const
const TENDON_HEIGHT = [0.02, 0.013, 0.012, 0.011, 0.009]

/** Relieve de los tendones extensores sobre el empeine, hacia la base de cada dedo. */
function tendonRelief(x: number, z: number) {
  let relief = 0
  for (let i = 0; i < TOES.length; i++) {
    const base = TOES[i]!.bones[0]
    const dx = base[0] - TENDON_ORIGIN[0]
    const dz = base[2] - TENDON_ORIGIN[1]
    const px = x - TENDON_ORIGIN[0]
    const pz = z - TENDON_ORIGIN[1]
    const h = Math.min(1, Math.max(0, (px * dx + pz * dz) / (dx * dx + dz * dz)))
    const ex = px - dx * h
    const ez = pz - dz * h
    const across = (ex * ex + ez * ez) / (0.026 * 0.026)
    if (across > 6) continue
    relief +=
      TENDON_HEIGHT[i]! * Math.exp(-across) * smoothstep(0.12, 0.6, h) * (1 - smoothstep(0.9, 1, h))
  }
  return relief
}

/** Altura del "suelo" bajo el pie: el arco medial se despega y los bordes redondean. */
function floorHeight(x: number, z: number) {
  const along = Math.exp(-(((z + 0.12) / 0.44) ** 2))
  const arch = 0.17 * along * smoothstep(-0.26, 0.22, x)
  const bowl = 0.05 * x * x
  return arch + bowl
}

/**
 * Distancia con signo a la superficie del pie (negativa dentro). Deja en
 * `footGroups()` la distancia a cada grupo anatómico para clasificar el punto.
 */
export function footField(x: number, y: number, z: number): number {
  let body = ellipsoid(x, y, z, BODY[0]!)
  for (let i = 1; i < BODY.length; i++) body = smin(body, ellipsoid(x, y, z, BODY[i]!), 0.16)

  // Tobillo y dedos solo se evalúan cerca de donde influyen (el campo se muestrea
  // cientos de miles de veces al construir la malla).
  let ankle = FAR
  if (z < ANKLE_REACH) {
    ankle = bone(x * LEG_NARROW, y, z, LEG) / LEG_NARROW
    ankle = smin(ankle, ellipsoid(x, y, z, MALLEOLI[0]!), 0.15)
    ankle = smin(ankle, ellipsoid(x, y, z, MALLEOLI[1]!), 0.15)
    ankle = smin(ankle, bone(x, y, z, ACHILLES), 0.13)
  }

  group[0] = body
  group[1] = ankle
  let d = smin(body, ankle, 0.22)

  let toes = FAR
  if (z > TOES_REACH && y < 0.5) {
    for (let i = 0; i < TOES.length; i++) {
      const t = TOES[i]!
      let dt = smin(bone(x, y, z, t.bones[0], t.flat), bone(x, y, z, t.bones[1], t.flat), 0.03)
      dt = smin(dt, ellipsoid(x, y, z, t.pad), 0.04)
      dt = smin(dt, ellipsoid(x, y, z, t.nail), 0.012)
      group[2 + i] = dt
      toes = smin(toes, dt, 0.018)
    }
  } else {
    group.fill(FAR, 2)
  }
  d = smin(d, toes, 0.075)

  if (d < 0.08 && d > -0.08 && y > 0.1 && z > -0.5)
    d -= tendonRelief(x, z) * smoothstep(0.1, 0.2, y)

  d = smax(d, floorHeight(x, z) - y, 0.075)
  return smax(d, y - LEG_TOP, 0.07)
}

/** Distancias por grupo del último punto evaluado con `footField`. */
export function footGroups(): Readonly<Float64Array> {
  return group
}

/** Cuánto pertenece un punto a la uña de algún dedo (0..1). */
export function nailAmount(x: number, y: number, z: number): number {
  let best = 0
  for (const t of TOES) {
    const n = t.nail
    if (y < n[1] - n[4] * 0.2) continue
    const dx = (x - n[0]) / (n[3] * 0.92)
    const dz = (z - n[2]) / (n[5] * 0.92)
    best = Math.max(best, 1 - smoothstep(0.8, 1.05, Math.sqrt(dx * dx + dz * dz)))
  }
  return best
}

export const ZONE_ORDER: ZoneId[] = [
  'hallux',
  'toes',
  'metatarsal',
  'lateral',
  'heel',
  'dorsum',
  'ankle',
]

/**
 * Pertenencia suave (0..1) de un punto de la superficie a cada parte seleccionable,
 * en el orden de `ZONE_ORDER`. `ny` es la componente vertical de la normal.
 */
export function zoneWeights(
  x: number,
  y: number,
  z: number,
  ny: number,
  out: Float32Array | number[] = new Array<number>(ZONE_ORDER.length),
): Float32Array | number[] {
  footField(x, y, z)
  const rest = Math.min(group[0]!, group[1]!)
  const member = (i: number) => Math.min(1, Math.max(0, 0.5 + (rest - group[2 + i]!) / 0.07))
  const hallux = member(0)
  const toes = Math.max(member(1), member(2), member(3), member(4)) * (1 - hallux)
  const foot = 1 - Math.max(hallux, toes)

  const rear = 1 - smoothstep(-0.4, -0.08, z)
  const ankle = foot * Math.max(smoothstep(0.46, 0.72, y) * rear, smoothstep(0.82, 0.98, y))
  const low = foot - ankle

  const heelAll = 1 - smoothstep(-0.68, -0.38, z)
  const up = smoothstep(-0.35, 0.35, ny)
  const sole = low * (1 - heelAll) * (1 - up)
  const front = smoothstep(0.0, 0.3, z)
  const mid = sole * (1 - front)
  const medial = smoothstep(-0.16, 0.12, x)
  const medialFront = smoothstep(-0.32, -0.04, z)

  out[0] = hallux
  out[1] = toes
  out[2] = sole * front + mid * medial * medialFront
  out[3] = mid * (1 - medial)
  out[4] = low * heelAll + mid * medial * (1 - medialFront)
  out[5] = low * (1 - heelAll) * up
  out[6] = ankle
  return out
}

/** Parte seleccionable dominante en un punto de la superficie. */
export function classifyFootPoint(x: number, y: number, z: number, ny: number): ZoneId {
  const w = zoneWeights(x, y, z, ny)
  let best = 0
  for (let i = 1; i < ZONE_ORDER.length; i++) if (w[i]! > w[best]!) best = i
  return ZONE_ORDER[best]!
}

/** Coordenadas de la huella del podograma (viewBox 320×640) bajo un punto del pie. */
export function toFootprint(x: number, z: number): { fx: number; fy: number } {
  return { fx: 166 + x * 225, fy: 616 - (z + 1.3) * 218.5 }
}
