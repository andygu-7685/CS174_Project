import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createSnow, updateSnow } from './snow.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit controls (rotate around globe)
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

controls.minDistance = 10;
controls.maxDistance = 40;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(5, 8, 5);
scene.add(pointLight);

createSnow(scene, 5);

// Temp sphere
// Remove later when actual globe model is added
const tempSphere = new THREE.Mesh(
  new THREE.SphereGeometry(7, 64, 64),
  new THREE.MeshPhongMaterial({ color: 0x88ccff, wireframe: true })
);
scene.add(tempSphere);

// Clock for animations like snow
const clock = new THREE.Clock();


// Animation loop 
function animate() {

  const deltaTime = clock.getDelta();

  updateSnow(deltaTime);

  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});