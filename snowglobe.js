import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createSnow, updateSnow, shakeSnow, updateShake } from './snow.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 7, -15);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);

const point_light = new THREE.PointLight(0xb3d9ff, 4000, 200);
point_light.position.set(0, 16, 0);
scene.add(point_light);
const ambient_light = new THREE.AmbientLight(0x8a8a8a);
scene.add(ambient_light);

const base = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 2, 32),
    new THREE.MeshPhongMaterial({ color: 0x4d331a, shininess: 10 })
);
base.position.y = 1;
scene.add(base);

const snow_floor = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0xf8f8ff, shininess: 70 })
);
snow_floor.scale.y = 0.3;
snow_floor.position.y = 2.2;
scene.add(snow_floor);

const tree_base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.4, 1.6, 8),
    new THREE.MeshPhongMaterial({ color: 0x4a2f1a, shininess: 5 })
);
tree_base.position.set(-2.4, 3.6, 0.6);
scene.add(tree_base);

const crown = new THREE.Mesh(
    new THREE.ConeGeometry(1.6, 3.0, 7),
    new THREE.MeshPhongMaterial({ color: 0x1a4d1a, shininess: 10 })
);
crown.position.set(-2.4, 5.8, 0.6);
scene.add(crown);

const tree_base2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8),
    new THREE.MeshPhongMaterial({ color: 0x4a2f1a, shininess: 5 })
);
tree_base2.position.set(2.4, 3.54, 0.6);
scene.add(tree_base2);

const crown2 = new THREE.Mesh(
    new THREE.ConeGeometry(1.0, 2.0, 7),
    new THREE.MeshPhongMaterial({ color: 0x1a4d1a, shininess: 10 })
);
crown2.position.set(2.4, 4.8, 0.6);
scene.add(crown2);

const house_walls = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1.2, 1.6),
    new THREE.MeshPhongMaterial({ color: 0xE3890E, shininess: 5 })
);
house_walls.position.set(0, 4.2, 0);
scene.add(house_walls);

const house_roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.4, 1.0, 4),
    new THREE.MeshPhongMaterial({ color: 0xaa0000, shininess: 5 })
);
house_roof.position.set(0, 5.3, 0);
house_roof.rotation.y = Math.PI / 4;
scene.add(house_roof);

const house_door = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.64, 0.04),
    new THREE.MeshPhongMaterial({ color: 0x1497F5, shininess: 15 })
);
house_door.position.set(0, 3.86, -0.86);
scene.add(house_door);

// Door frame
const doorFrame = new THREE.MeshPhongMaterial({ color: 0x00008b, shininess: 10 });

const frame_top = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.04), doorFrame);
frame_top.position.set(0, 4.21, -0.82);
scene.add(frame_top);

const door_frame_left = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.64, 0.04), doorFrame);
door_frame_left.position.set(-0.23, 3.86, -0.82);
scene.add(door_frame_left);

const door_frame_right = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.64, 0.04), doorFrame);
door_frame_right.position.set(0.23, 3.86, -0.82);
scene.add(door_frame_right);

// Red circle handle
const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 80 })
);
handle.position.set(-0.14, 3.86, -0.84);
scene.add(handle);

scene.background = new THREE.Color(0x252f33);

// Snow piles
// const snowPileMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0ff, shininess: 80 });

// const pile1 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), snowPileMaterial);
// pile1.scale.y = 0.4;
// pile1.position.set(1.6, 3.5, 1.6);
// scene.add(pile1);

// const pile2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), snowPileMaterial);
// pile2.scale.y = 0.4;
// pile2.position.set(-1.4, 3.5, -1.2);
// scene.add(pile2);

// const pile3 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), snowPileMaterial);
// pile3.scale.y = 0.4;
// pile3.position.set(0.6, 3.5, -1.8);
// scene.add(pile3);

// Windows
const windowGlass = new THREE.MeshPhongMaterial({ color: 0xffcc44, shininess: 100, emissive: 0xffaa00, emissiveIntensity: 0.4 });
const windowFrame = new THREE.MeshPhongMaterial({ color: 0x1a0a00, shininess: 10 });

const win_frame_right = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.56, 0.56), windowFrame);
win_frame_right.position.set(0.82, 4.3, 0);
scene.add(win_frame_right);

const glass_right = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.44), windowGlass);
glass_right.position.set(0.84, 4.3, 0);
scene.add(glass_right);

const win_frame_left = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.56, 0.56), windowFrame);
win_frame_left.position.set(-0.82, 4.3, 0);
scene.add(win_frame_left);

const glass_left = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.44), windowGlass);
glass_left.position.set(-0.84, 4.3, 0);
scene.add(glass_left);

// Window crosses
const cross_v_right = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.44, 0.06), windowFrame);
cross_v_right.position.set(0.86, 4.3, 0);
scene.add(cross_v_right);

const cross_h_right = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.44), windowFrame);
cross_h_right.position.set(0.86, 4.3, 0);
scene.add(cross_h_right);

const cross_v_left = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.44, 0.06), windowFrame);
cross_v_left.position.set(-0.86, 4.3, 0);
scene.add(cross_v_left);

const cross_h_left = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.44), windowFrame);
cross_h_left.position.set(-0.86, 4.3, 0);
scene.add(cross_h_left);

const glass_sphere = new THREE.Mesh(
    new THREE.SphereGeometry(6, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0xcce5ff, shininess: 100, transparent: true, opacity: 0.35, depthWrite: false })
);
glass_sphere.position.y = 7;
scene.add(glass_sphere);

createSnow(scene, 6);
const clock = new THREE.Clock();

let snowing = true;
window.addEventListener('keydown', (event) => {
    if (event.key === 'r') snowing = !snowing;
    if (event.key === ' ') shakeSnow(scene);
});

function animate() {
    const deltaTime = clock.getDelta();
    updateSnow(deltaTime, snowing);
    updateShake(deltaTime, scene);
    renderer.render(scene, camera);
    controls.update();
}
renderer.setAnimationLoop(animate);