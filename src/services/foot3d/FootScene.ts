import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { animate } from 'animejs'
import type { ZoneId } from '@/content/landing'
import { FootPainter, type FootPalette, type TextureMark } from './footPaint'
import { ZONE_ORDER } from './footShape'
import type { FieldMesh } from './surfaceNets'

export interface FootSceneOptions {
  reducedMotion: boolean
  palette: FootPalette
  /** Se llama con la parte tocada (o null si se tocó fuera del pie). */
  onPick?: (zone: ZoneId | null) => void
}

const DRAG_THRESHOLD_PX = 6
/** Centro de giro del pie, en coordenadas de la forma (el suelo está en y = 0). */
const PIVOT = new THREE.Vector3(0, 0.5, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)
const UP = new THREE.Vector3(0, 1, 0)
const SOLE_NORMAL = new THREE.Vector3(0, -1, 0)
const LOOK_TARGET = new THREE.Vector3(0, 0.15, 0)
const CAMERA_DIR = new THREE.Vector3(3.1, 2.3, 4.3).normalize()

type ViewName = 'rest' | 'sole' | 'dorsum'

interface View {
  quaternion: THREE.Quaternion
  distance: number
}

/**
 * Escena three.js del pie completo: una sola malla orgánica (talón, arco, tobillo,
 * dedos con uñas) generada desde `footShape`. El mapa de presión, las marcas del
 * visitante y la selección se pintan como color por vértice (`FootPainter`), y las
 * partes se eligen por raycasting.
 */
export class FootScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private group = new THREE.Group()
  private body!: THREE.Mesh
  private painter: FootPainter
  private colors!: THREE.BufferAttribute
  private colorTween: { pause(): void } | null = null
  private disposables: Array<{ dispose(): void }> = []
  private raycaster = new THREE.Raycaster()
  private frame = 0
  private running = false
  private lastPointer: { x: number; y: number } | null = null
  private pointerStart: { x: number; y: number } | null = null
  private dragged = false
  private userRotatedAt = 0
  private activeZones: ZoneId[] = []
  private marks: TextureMark[] = []
  private selectedZone: ZoneId | null = null
  private currentTween: { pause(): void } | null = null
  private views!: Record<ViewName, View>
  private currentView: ViewName = 'rest'
  private cameraDistance = 5.7

  constructor(
    private readonly canvas: HTMLCanvasElement,
    mesh: FieldMesh,
    private readonly options: FootSceneOptions,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.NeutralToneMapping
    this.renderer.setClearColor(0x000000, 0)

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
    this.setCameraDistance(this.cameraDistance)

    this.painter = new FootPainter(mesh.positions, mesh.normals, options.palette)
    this.buildFoot(mesh)
    this.buildLights()
    this.scene.add(this.group)
    this.views = {
      // Reposo: tres cuartos con la planta inclinada hacia la cámara (mapa visible) y
      // los dedos en diagonal; el giro lento va mostrando el borde y el dorso.
      rest: {
        quaternion: this.computeOrientation(
          CAMERA_DIR.clone().addScaledVector(UP, 0.45).normalize(),
          -0.75,
        ),
        distance: 5.6,
      },
      // Planta de frente, dedos arriba.
      sole: { quaternion: this.computeOrientation(CAMERA_DIR.clone(), -0.18), distance: 5.9 },
      // Dorso: para empeine y tobillo.
      dorsum: {
        quaternion: this.computeOrientation(
          CAMERA_DIR.clone().negate().addScaledVector(UP, -0.35).normalize(),
          Math.PI - 0.6,
        ),
        distance: 5.4,
      },
    }
    this.group.quaternion.copy(this.views.rest.quaternion)
    this.setCameraDistance(this.views.rest.distance)

    this.bindPointer()
  }

  private buildFoot(mesh: FieldMesh) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(mesh.positions, 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(mesh.normals, 3))
    this.colors = new THREE.BufferAttribute(new Float32Array(this.painter.count * 3), 3)
    this.painter.paint(this.paintState(), this.colors.array as Float32Array)
    geometry.setAttribute('color', this.colors)
    geometry.setIndex(new THREE.BufferAttribute(mesh.indices, 1))

    // Piel: mate, con un velo cálido en los bordes que imita la luz que la atraviesa.
    const material = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.56,
      metalness: 0,
      sheen: 0.22,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color('#ffb199'),
      envMapIntensity: 0.3,
    })

    this.body = new THREE.Mesh(geometry, material)
    this.body.position.copy(PIVOT).negate()
    this.disposables.push(geometry, material)
    this.group.add(this.body)
    this.group.position.copy(LOOK_TARGET)
  }

  private buildLights() {
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    const room = new RoomEnvironment()
    const environment = pmrem.fromScene(room, 0.04)
    this.scene.environment = environment.texture
    room.dispose()
    pmrem.dispose()
    this.disposables.push(environment)

    const hemi = new THREE.HemisphereLight(0xffffff, 0xc9b3a6, 0.2)
    const key = new THREE.DirectionalLight(0xfff4ea, 1.35)
    key.position.set(3, 4, 3)
    const fill = new THREE.DirectionalLight(0xdfeeff, 0.22)
    fill.position.set(-3, 1.5, -2)
    const rim = new THREE.DirectionalLight(0xffffff, 0.4)
    rim.position.set(-1, -2, -3)
    this.scene.add(hemi, key, fill, rim)
  }

  private paintState() {
    return { activeZones: this.activeZones, marks: this.marks, selectedZone: this.selectedZone }
  }

  /** Repinta el pie; el cambio de color se funde salvo con movimiento reducido. */
  private repaint() {
    this.colorTween?.pause()
    const current = this.colors.array as Float32Array
    if (this.options.reducedMotion) {
      this.painter.paint(this.paintState(), current)
      this.colors.needsUpdate = true
      this.renderOnce()
      return
    }
    const from = current.slice()
    const target = this.painter.paint(this.paintState(), new Float32Array(current.length))
    const mix = { k: 0 }
    this.colorTween = animate(mix, {
      k: 1,
      duration: 350,
      ease: 'outQuad',
      onUpdate: () => {
        const k = mix.k
        for (let i = 0; i < current.length; i++) current[i] = from[i]! + (target[i]! - from[i]!) * k
        this.colors.needsUpdate = true
      },
    })
  }

  setActiveZones(zones: ZoneId[]) {
    this.activeZones = zones
    this.repaint()
    this.goTo(zones.length > 0 ? 'sole' : 'rest')
  }

  setMarks(marks: TextureMark[]) {
    this.marks = marks
    this.repaint()
  }

  setSelectedZone(zone: ZoneId | null) {
    this.selectedZone = zone
    this.repaint()
    if (this.activeZones.length > 0) return
    if (zone === 'dorsum' || zone === 'ankle') {
      // Estas partes solo se ven desde el dorso.
      this.goTo('dorsum')
    } else {
      this.goTo(zone ? 'sole' : 'rest')
    }
  }

  private setCameraDistance(distance: number) {
    this.cameraDistance = distance
    this.camera.position.copy(LOOK_TARGET).addScaledVector(CAMERA_DIR, distance)
    this.camera.lookAt(LOOK_TARGET)
  }

  /**
   * Orientación en la que la normal de la planta (-Y local) apunta a `normal` y,
   * girando alrededor de esa normal, los dedos quedan a `toesAngle` radianes del
   * "arriba" de pantalla (0 = dedos hacia arriba).
   */
  private computeOrientation(normal: THREE.Vector3, toesAngle: number): THREE.Quaternion {
    const q = new THREE.Quaternion().setFromUnitVectors(SOLE_NORMAL, normal)
    const toes = new THREE.Vector3(0, 0, 1).applyQuaternion(q)
    const project = (v: THREE.Vector3) =>
      v
        .clone()
        .sub(normal.clone().multiplyScalar(v.dot(normal)))
        .normalize()
    const toesP = project(toes)
    const upP = project(UP)
    const angle = Math.atan2(toesP.clone().cross(upP).dot(normal), toesP.dot(upP))
    const twist = new THREE.Quaternion().setFromAxisAngle(normal, angle + toesAngle)
    return twist.multiply(q)
  }

  private goTo(view: ViewName) {
    this.currentView = view
    const target = this.views[view]
    this.currentTween?.pause()
    if (this.options.reducedMotion) {
      this.group.quaternion.copy(target.quaternion)
      this.setCameraDistance(target.distance)
      this.renderOnce()
      return
    }
    const from = this.group.quaternion.clone()
    const fromDistance = this.cameraDistance
    const mix = { k: 0 }
    this.currentTween = animate(mix, {
      k: 1,
      duration: 900,
      ease: 'outExpo',
      onUpdate: () => {
        this.group.quaternion.slerpQuaternions(from, target.quaternion, mix.k)
        this.setCameraDistance(fromDistance + (target.distance - fromDistance) * mix.k)
      },
    })
  }

  /** Parte del pie bajo un punto del canvas, o null. */
  pickAt(clientX: number, clientY: number): ZoneId | null {
    const rect = this.canvas.getBoundingClientRect()
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    )
    this.raycaster.setFromCamera(ndc, this.camera)
    for (const hit of this.raycaster.intersectObject(this.body, false)) {
      const vertex = hit.face?.a
      if (vertex === undefined) continue
      return ZONE_ORDER[this.painter.zoneIndex[vertex]!] ?? null
    }
    return null
  }

  private bindPointer() {
    const onDown = (e: PointerEvent) => {
      this.lastPointer = { x: e.clientX, y: e.clientY }
      this.pointerStart = { x: e.clientX, y: e.clientY }
      this.dragged = false
      this.canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!this.lastPointer || !this.pointerStart) {
        if (this.options.onPick) {
          this.canvas.style.cursor = this.pickAt(e.clientX, e.clientY) ? 'pointer' : 'grab'
        }
        return
      }
      const dx = e.clientX - this.lastPointer.x
      const dy = e.clientY - this.lastPointer.y
      this.lastPointer = { x: e.clientX, y: e.clientY }
      if (
        Math.abs(e.clientX - this.pointerStart.x) > DRAG_THRESHOLD_PX ||
        Math.abs(e.clientY - this.pointerStart.y) > DRAG_THRESHOLD_PX
      ) {
        this.dragged = true
      }
      if (!this.dragged) return
      this.currentTween?.pause()
      const yaw = new THREE.Quaternion().setFromAxisAngle(Y_AXIS, dx * 0.01)
      const pitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * 0.006)
      this.group.quaternion.premultiply(yaw).premultiply(pitch)
      this.userRotatedAt = performance.now()
      if (this.options.reducedMotion) this.renderOnce()
    }
    const onUp = (e: PointerEvent) => {
      const wasDrag = this.dragged
      this.lastPointer = null
      this.pointerStart = null
      this.dragged = false
      if (!wasDrag && this.options.onPick) {
        this.options.onPick(this.pickAt(e.clientX, e.clientY))
      }
    }
    const onCancel = () => {
      this.lastPointer = null
      this.pointerStart = null
      this.dragged = false
    }
    this.canvas.addEventListener('pointerdown', onDown)
    this.canvas.addEventListener('pointermove', onMove)
    this.canvas.addEventListener('pointerup', onUp)
    this.canvas.addEventListener('pointercancel', onCancel)
    this.disposables.push({
      dispose: () => {
        this.canvas.removeEventListener('pointerdown', onDown)
        this.canvas.removeEventListener('pointermove', onMove)
        this.canvas.removeEventListener('pointerup', onUp)
        this.canvas.removeEventListener('pointercancel', onCancel)
      },
    })
  }

  resize(width: number, height: number) {
    if (width === 0 || height === 0) return
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    if (!this.running) this.renderOnce()
  }

  setVisible(visible: boolean) {
    if (visible && !this.running && !this.options.reducedMotion) this.start()
    if (!visible) this.stop()
  }

  start() {
    if (this.options.reducedMotion) {
      this.renderOnce()
      return
    }
    if (this.running) return
    this.running = true
    const loop = () => {
      if (!this.running) return
      const idle = performance.now() - this.userRotatedAt > 4000
      if (idle && this.currentView === 'rest' && !this.lastPointer) {
        this.group.rotateOnWorldAxis(Y_AXIS, 0.0022)
      }
      this.renderer.render(this.scene, this.camera)
      this.frame = requestAnimationFrame(loop)
    }
    this.frame = requestAnimationFrame(loop)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.frame)
  }

  renderOnce() {
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.stop()
    this.currentTween?.pause()
    this.colorTween?.pause()
    for (const d of this.disposables) d.dispose()
    this.renderer.dispose()
  }
}
