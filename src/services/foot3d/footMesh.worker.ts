import { buildFootMesh } from './footMesh'

const mesh = buildFootMesh()
;(self as unknown as Worker).postMessage(mesh, [
  mesh.positions.buffer,
  mesh.normals.buffer,
  mesh.indices.buffer,
])
