/**
 * Convierte un campo de distancia en una malla cerrada con "surface nets": un
 * vértice por celda que cruza la superficie y un cuadrilátero por arista de la
 * rejilla que la atraviesa. Sin dependencias: se prueba sin WebGL.
 */
export interface FieldMesh {
  positions: Float32Array
  normals: Float32Array
  indices: Uint32Array
}

export type Field = (x: number, y: number, z: number) => number

export interface MeshOptions {
  min: readonly [number, number, number]
  max: readonly [number, number, number]
  cell: number
}

/** Bloque de muestreo grueso: los bloques lejos de la superficie no se refinan. */
const BLOCK = 4

export function meshField(field: Field, { min, max, cell }: MeshOptions): FieldMesh {
  const nx = Math.ceil((max[0] - min[0]) / cell / BLOCK) * BLOCK + 1
  const ny = Math.ceil((max[1] - min[1]) / cell / BLOCK) * BLOCK + 1
  const nz = Math.ceil((max[2] - min[2]) / cell / BLOCK) * BLOCK + 1
  const sx = 1
  const sy = nx
  const sz = nx * ny
  const values = new Float32Array(nx * ny * nz)

  // Muestreo en dos niveles: si el centro de un bloque está más lejos de la
  // superficie que su diagonal (con margen), todo el bloque queda del mismo lado.
  const reach = BLOCK * cell * Math.sqrt(3) * 0.5 * 1.8
  for (let bk = 0; bk < nz - 1; bk += BLOCK) {
    for (let bj = 0; bj < ny - 1; bj += BLOCK) {
      for (let bi = 0; bi < nx - 1; bi += BLOCK) {
        const half = (BLOCK * cell) / 2
        const center = field(
          min[0] + bi * cell + half,
          min[1] + bj * cell + half,
          min[2] + bk * cell + half,
        )
        const far = Math.abs(center) > reach
        for (let k = bk; k <= bk + BLOCK; k++) {
          for (let j = bj; j <= bj + BLOCK; j++) {
            for (let i = bi; i <= bi + BLOCK; i++) {
              const at = i * sx + j * sy + k * sz
              if (far) {
                if (values[at] === 0) values[at] = center
              } else {
                values[at] = field(min[0] + i * cell, min[1] + j * cell, min[2] + k * cell)
              }
            }
          }
        }
      }
    }
  }

  const cellVertex = new Int32Array(nx * ny * nz).fill(-1)
  const positions: number[] = []
  const corner = new Float32Array(8)
  const offsets = [0, sx, sy, sx + sy, sz, sx + sz, sy + sz, sx + sy + sz]
  // Aristas del cubo como pares de esquinas (bit 0 = x, bit 1 = y, bit 2 = z).
  const edges = [0, 1, 2, 3, 4, 5, 6, 7, 0, 2, 1, 3, 4, 6, 5, 7, 0, 4, 1, 5, 2, 6, 3, 7]

  for (let k = 0; k < nz - 1; k++) {
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const at = i * sx + j * sy + k * sz
        let mask = 0
        for (let c = 0; c < 8; c++) {
          const v = values[at + offsets[c]!]!
          corner[c] = v
          if (v < 0) mask |= 1 << c
        }
        if (mask === 0 || mask === 255) continue
        let px = 0
        let py = 0
        let pz = 0
        let n = 0
        for (let e = 0; e < 24; e += 2) {
          const a = edges[e]!
          const b = edges[e + 1]!
          const va = corner[a]!
          const vb = corner[b]!
          if (va < 0 === vb < 0) continue
          const t = va / (va - vb)
          px += (a & 1) + ((b & 1) - (a & 1)) * t
          py += ((a >> 1) & 1) + (((b >> 1) & 1) - ((a >> 1) & 1)) * t
          pz += ((a >> 2) & 1) + (((b >> 2) & 1) - ((a >> 2) & 1)) * t
          n++
        }
        cellVertex[at] = positions.length / 3
        positions.push(
          min[0] + (i + px / n) * cell,
          min[1] + (j + py / n) * cell,
          min[2] + (k + pz / n) * cell,
        )
      }
    }
  }

  const indices: number[] = []
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return
    if (flip) indices.push(a, c, b, a, d, c)
    else indices.push(a, b, c, a, c, d)
  }
  for (let k = 1; k < nz - 1; k++) {
    for (let j = 1; j < ny - 1; j++) {
      for (let i = 1; i < nx - 1; i++) {
        const at = i * sx + j * sy + k * sz
        const inside = values[at]! < 0
        if (inside !== values[at + sx]! < 0) {
          quad(
            cellVertex[at - sy - sz]!,
            cellVertex[at - sz]!,
            cellVertex[at]!,
            cellVertex[at - sy]!,
            !inside,
          )
        }
        if (inside !== values[at + sy]! < 0) {
          quad(
            cellVertex[at - sx - sz]!,
            cellVertex[at - sx]!,
            cellVertex[at]!,
            cellVertex[at - sz]!,
            !inside,
          )
        }
        if (inside !== values[at + sz]! < 0) {
          quad(
            cellVertex[at - sx - sy]!,
            cellVertex[at - sy]!,
            cellVertex[at]!,
            cellVertex[at - sx]!,
            !inside,
          )
        }
      }
    }
  }

  // Ajuste fino: cada vértice baja por el gradiente hasta la superficie real, y
  // la normal sale del propio campo (sombreado suave aunque la rejilla sea gruesa).
  const count = positions.length / 3
  const outPositions = new Float32Array(positions)
  const normals = new Float32Array(count * 3)
  const eps = cell * 0.2
  for (let v = 0; v < count; v++) {
    let x = outPositions[v * 3]!
    let y = outPositions[v * 3 + 1]!
    let z = outPositions[v * 3 + 2]!
    let gx = 0
    let gy = 1
    let gz = 0
    for (let pass = 0; pass < 2; pass++) {
      gx = (field(x + eps, y, z) - field(x - eps, y, z)) / (2 * eps)
      gy = (field(x, y + eps, z) - field(x, y - eps, z)) / (2 * eps)
      gz = (field(x, y, z + eps) - field(x, y, z - eps)) / (2 * eps)
      if (pass === 1) break
      const g2 = gx * gx + gy * gy + gz * gz
      if (g2 < 1e-8) break
      let step = field(x, y, z) / g2
      const length = Math.abs(step) * Math.sqrt(g2)
      if (length > cell * 0.5) step *= (cell * 0.5) / length
      x -= gx * step
      y -= gy * step
      z -= gz * step
    }
    const gl = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1
    outPositions[v * 3] = x
    outPositions[v * 3 + 1] = y
    outPositions[v * 3 + 2] = z
    normals[v * 3] = gx / gl
    normals[v * 3 + 1] = gy / gl
    normals[v * 3 + 2] = gz / gl
  }

  return { positions: outPositions, normals, indices: new Uint32Array(indices) }
}
