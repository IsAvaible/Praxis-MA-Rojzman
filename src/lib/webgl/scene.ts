import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { MathUtils } from 'three';
import WEBGL from "three/examples/jsm/capabilities/WebGL";
// import { InteractionManager } from "three.interactive";
// import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {vertexShader, fragmentShader} from "./shaders";
import {prefersReducedMotionStore} from "../../scripts/stores/prefersReducedMotionStore";

export let sceneInitialized = false;

let renderer: THREE.WebGLRenderer;
// let interaction: InteractionManager;
let clock: THREE.Clock;
let frameTime = 0;
let frameRate = 1 / 60;
let uniforms: { u_time: any; u_resolution: any; u_mouse: any };

const fov = 50;
const planeAspectRatio = 16 / 9;

const scene: THREE.Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 250);
const gltfLoader = new GLTFLoader();

let virus: THREE.Group;

let prefersReducedMotion: boolean;
prefersReducedMotionStore.subscribe((b) => prefersReducedMotion = b);

const init = () => {
  // @ts-ignore
  // controls = new OrbitControls(camera, renderer.domElement);
  // interaction = new InteractionManager(renderer, camera, renderer.domElement, false);
  clock = new THREE.Clock();

  camera.position.z = 5;

  // controls.minDistance = 5.0;
  // controls.maxDistance = 35.0;
  // controls.enableDamping = true;
  // controls.enableZoom = false;

  uniforms = {
    u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_mouse: { type: "v2", value: new THREE.Vector2() }
  };

  // This part of the code may be used to add mouse interactivity to the shader
  // document.onmousemove = function(e){
  //   uniforms.u_mouse.value.x = e.pageX / renderer.domElement.clientWidth;
  //   uniforms.u_mouse.value.y = e.pageY / renderer.domElement.clientHeight;
  // }

  // const room = new RoomEnvironment();
  // room.position.set(0.0, -4, 0.0);
  // scene.add(room);

  loadVirus();
}

const animate = () => {
  requestAnimationFrame(animate);

  frameTime += clock.getDelta();
  if (frameTime > frameRate) {
    frameTime %= frameRate;
    update();
    uniforms.u_time.value += clock.getDelta();
    // interaction.update();
    renderer.render(scene, camera);
  }
};

const update = () => {
  if (virus != undefined) {
    virus.rotation.x += prefersReducedMotion ? 0.0001 : 0.001;
    virus.rotation.z += prefersReducedMotion ? 0.0001 : 0.001;
  }
}

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
  camera.aspect = window.innerWidth / (window.innerHeight * 0.8);

  if (camera.aspect > planeAspectRatio) { // window too large
    const cameraHeight = Math.tan(MathUtils.degToRad(fov / 2));
    const ratio = camera.aspect / planeAspectRatio;
    const newCameraHeight = cameraHeight / ratio;
    camera.fov = MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
  } else { // window too narrow
    camera.fov = fov;
  }

  camera.updateProjectionMatrix();

  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
};

export const createScene = (canvasElement: HTMLCanvasElement) => {
  if (!WEBGL.isWebGLAvailable()) return
  sceneInitialized = true;
  renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor( 0x000000, 0 );
  init();
  resize();
  window.addEventListener('resize', resize);
  animate();
}

export const rebindScene = (canvasElement: HTMLCanvasElement) => {
  renderer.dispose();
  renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor( 0x000000, 0 );
  resize();
}

const loadVirus = () => {
  const centerMaterial = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
    wireframe: true
  } );
  // const centerMaterial = new THREE.MeshBasicMaterial({color: 0x33333, wireframe: true});
  gltfLoader.load(
      window.innerWidth < 500 ? 'assets/virus_c.glb' : 'assets/virus.glb',
      (glb) => {
        virus = new THREE.Group();
        glb.scene.children.forEach((obj) => {
          virus.add(obj);
        })
        virus.add(glb.scene.children[0]);
        virus.traverse(function (child: THREE.Mesh) {
          if (child.isMesh) {
            child.geometry.center();
            child.material = centerMaterial;
          }
        });
        virus.scale.setScalar(2);
        virus.position.setX(1);
        scene.add(virus);
        // interaction.add(virus);
        // virus.addEventListener("mousedown", (event => centerMaterial.wireframe = !centerMaterial.wireframe));
      }
  );
}

