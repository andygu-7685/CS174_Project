import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createSnow, updateSnow } from './snow.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3, 0);

const point_light = new THREE.PointLight(0xb3d9ff, 1000, 100);
point_light.position.set(0, 8, 0);
scene.add(point_light);
const ambient_light = new THREE.AmbientLight(0x404060);
scene.add(ambient_light);

const base = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 1, 32),
    new THREE.MeshPhongMaterial({ color: 0x4d331a, shininess: 10 })
);
base.position.y = 0.5;
scene.add(base);


const snow_floor = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0xf8f8ff, shininess: 70 })
);
snow_floor.scale.y = 0.3;
snow_floor.position.y = 1.1;
scene.add(snow_floor);

const tree_base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 0.8, 8),
    new THREE.MeshPhongMaterial({ color: 0x4a2f1a, shininess: 5 })
);
tree_base.position.set(0, 1.8, 0);
scene.add(tree_base);
const crown = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 1.5, 7),
    new THREE.MeshPhongMaterial({ color: 0x1a4d1a, shininess: 10 })
);
crown.position.set(0, 2.9, 0);
scene.add(crown);

const tree_base2 = new THREE.Mesh(  // one more tree added withthe same dimentions but different coordinates 
    new THREE.CylinderGeometry(0.15, 0.2, 0.8, 8),
    new THREE.MeshPhongMaterial({ color: 0x4a2f1a, shininess: 5 })
);
tree_base2.position.set(1, 1.8, 0.5);
scene.add(tree_base2);

const crown2 = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 1.5, 7),
    new THREE.MeshPhongMaterial({ color: 0x1a4d1a, shininess: 10 })
);
crown2.position.set(1, 2.9, 0.5);
scene.add(crown2);

const glass_sphere = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0xcce5ff, shininess: 100, transparent: true, opacity: 0.2 })
);
glass_sphere.position.y = 3.5;
scene.add(glass_sphere);
createSnow(scene, 3);
snow.position.y = 3.5;
const clock = new THREE.Clock();



function animate() {
    const deltaTime = clock.getDelta();
    updateSnow(deltaTime);
    renderer.render(scene, camera);
    controls.update();
}
renderer.setAnimationLoop(animate);