import { FOOT_BOUNDS, footField } from './footShape'
import { meshField, type FieldMesh } from './surfaceNets'

/** Lado de la celda de la rejilla: ~2 mm de pie, unos 22 000 vértices. */
const CELL = 0.022

export function buildFootMesh(): FieldMesh {
  return meshField(footField, { ...FOOT_BOUNDS, cell: CELL })
}

/**
 * Construye la malla del pie fuera del hilo principal para no congelar la página
 * (tarda décimas de segundo, más en un teléfono). Sin Web Workers, la construye aquí.
 */
export function loadFootMesh(): Promise<FieldMesh> {
  if (typeof Worker === 'undefined') return Promise.resolve(buildFootMesh())
  return new Promise((resolve) => {
    let worker: Worker
    try {
      worker = new Worker(new URL('./footMesh.worker.ts', import.meta.url), { type: 'module' })
    } catch {
      resolve(buildFootMesh())
      return
    }
    worker.onmessage = (event: MessageEvent<FieldMesh>) => {
      worker.terminate()
      resolve(event.data)
    }
    worker.onerror = () => {
      worker.terminate()
      resolve(buildFootMesh())
    }
  })
}
