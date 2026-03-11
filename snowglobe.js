import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createSnow, updateSnow, shakeSnow, updateShake } from './snow.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 7, -15);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// informational overlay
const infoDiv = document.createElement('div');
infoDiv.style.position = 'absolute';
infoDiv.style.top = '10px';
infoDiv.style.right = '10px';
infoDiv.style.padding = '8px 12px';
infoDiv.style.backgroundColor = 'rgba(0,0,0,0.6)';
infoDiv.style.color = '#fff';
infoDiv.style.fontFamily = 'sans-serif';
infoDiv.style.fontSize = '14px';
infoDiv.style.borderRadius = '4px';
infoDiv.innerHTML = '<b>Controls:</b> R = toggle snow, P = follow/unfollow train, Space = shake snow';
document.body.appendChild(infoDiv);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);

const point_light = new THREE.PointLight(0xb3d9ff, 50, 50);
point_light.position.set(0, 16, 0);
scene.add(point_light);

const ambient_light = new THREE.AmbientLight(0xffffff, 1.5); 
scene.add(ambient_light);

// directional light so the base gets lit from the side too
const dir_light = new THREE.DirectionalLight(0xffffff, 1.0);
dir_light.position.set(5, 10, 5);
scene.add(dir_light);

const textureLoader = new THREE.TextureLoader();

const woodDiffuse = textureLoader.load('./textures/wood_diffuse.jpg');
woodDiffuse.wrapS = THREE.RepeatWrapping;
woodDiffuse.wrapT = THREE.RepeatWrapping;
woodDiffuse.repeat.set(4, 2);

const woodNormal = textureLoader.load('./textures/wood_normal.jpg');
woodNormal.wrapS = THREE.RepeatWrapping;
woodNormal.wrapT = THREE.RepeatWrapping;
woodNormal.repeat.set(4, 2);

const snowDiffuse = textureLoader.load('/textures/snow_diffuse.jpg');
snowDiffuse.wrapS = THREE.RepeatWrapping;
snowDiffuse.wrapT = THREE.RepeatWrapping;
snowDiffuse.repeat.set(3, 3);

const snowNormal = textureLoader.load('/textures/snow_normal.jpg');
snowNormal.wrapS = THREE.RepeatWrapping;
snowNormal.wrapT = THREE.RepeatWrapping;
snowNormal.repeat.set(3, 3);

const barkDiffuse = textureLoader.load('/textures/bark_diffuse.jpg');
barkDiffuse.wrapS = THREE.RepeatWrapping;
barkDiffuse.wrapT = THREE.RepeatWrapping;
barkDiffuse.repeat.set(1, 2);

const barkNormal = textureLoader.load('/textures/bark_normal.jpg');
barkNormal.wrapS = THREE.RepeatWrapping;
barkNormal.wrapT = THREE.RepeatWrapping;
barkNormal.repeat.set(1, 2);

const leavesDiffuse = textureLoader.load('/textures/forest_diffuse.jpg');
leavesDiffuse.wrapS = THREE.RepeatWrapping;
leavesDiffuse.wrapT = THREE.RepeatWrapping;
leavesDiffuse.repeat.set(2, 2);

const leavesNormal = textureLoader.load('/textures/forest_normal.jpg');
leavesNormal.wrapS = THREE.RepeatWrapping;
leavesNormal.wrapT = THREE.RepeatWrapping;
leavesNormal.repeat.set(2, 2);

const brickDiffuse = textureLoader.load('/textures/brick_diffuse.jpg');
brickDiffuse.wrapS = THREE.RepeatWrapping;
brickDiffuse.wrapT = THREE.RepeatWrapping;
brickDiffuse.repeat.set(2, 2);

const brickNormal = textureLoader.load('/textures/brick_normal.jpg');
brickNormal.wrapS = THREE.RepeatWrapping;
brickNormal.wrapT = THREE.RepeatWrapping;
brickNormal.repeat.set(2, 2);

const roofDiffuse = textureLoader.load('/textures/tiles_diffuse.jpg');
roofDiffuse.wrapS = THREE.RepeatWrapping;
roofDiffuse.wrapT = THREE.RepeatWrapping;
roofDiffuse.repeat.set(2, 2);

const roofNormal = textureLoader.load('/textures/tiles_normal.jpg');
roofNormal.wrapS = THREE.RepeatWrapping;
roofNormal.wrapT = THREE.RepeatWrapping;
roofNormal.repeat.set(2, 2);

const base = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 2, 32),
    new THREE.MeshStandardMaterial({
        map: woodDiffuse,        // diffuse/color map
        normalMap: woodNormal,   // normal map
        normalScale: new THREE.Vector2(1.5, 1.5),
        roughness: 0.9,
        metalness: 0.0,
    })
);
base.position.y = 1;
scene.add(base);

const snow_floor = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshStandardMaterial({
        map: snowDiffuse,
        normalMap: snowNormal,
        normalScale: new THREE.Vector2(0.8, 0.8),
        roughness: 1.0,
        metalness: 0.0,
    })
);
snow_floor.scale.y = 0.3;
snow_floor.position.y = 2.2;
scene.add(snow_floor);

const treeMat = new THREE.MeshStandardMaterial({color: 0x4a2f1a,
    map: barkDiffuse,
    normalMap: barkNormal,
    normalScale: new THREE.Vector2(1.0, 1.0),
    roughness: 0.9,
    metalness: 0.0,
});

const crownMat = new THREE.MeshStandardMaterial({
    color: 0x2d8a2d,
    map: leavesDiffuse,
    normalMap: leavesNormal,
    normalScale: new THREE.Vector2(1.0, 1.0),
    roughness: 0.8,
    metalness: 0.0,
});

const tree_base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.4, 2.4, 8),
    treeMat
);
tree_base.position.set(-2.4, 4, 0.6);
scene.add(tree_base);

const crown_t1 = new THREE.Mesh(
    new THREE.ConeGeometry(1.6, 1.2, 7),
    crownMat
);
crown_t1.position.set(-2.4, 5, 0.6);
scene.add(crown_t1);

const crown_t2 = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 1.2, 7),
    crownMat
);
crown_t2.position.set(-2.4, 5.7, 0.6);
scene.add(crown_t2);

const crown_t3 = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 1.2, 7),
    crownMat
);
crown_t3.position.set(-2.4, 6.55, 0.6);
scene.add(crown_t3);


const tree_base2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8),
    treeMat  
);
tree_base2.position.set(1.8, 3.54, 0.6);
scene.add(tree_base2);

const crown2_t1 = new THREE.Mesh(
    new THREE.ConeGeometry(1.0, 0.8, 7),
    crownMat
);
crown2_t1.position.set(1.8, 4.3, 0.6);
scene.add(crown2_t1);

const crown2_t2 = new THREE.Mesh(
    new THREE.ConeGeometry(0.75, 0.8, 7),
    crownMat
);
crown2_t2.position.set(1.8, 4.9, 0.6);
scene.add(crown2_t2);

const crown2_t3 = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 0.8, 7),
    crownMat
);
crown2_t3.position.set(1.8, 5.4, 0.6);
scene.add(crown2_t3);

const house_walls = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1.2, 1.6),
    new THREE.MeshStandardMaterial({
        color: 0xE3890E,
        map: brickDiffuse,
        normalMap: brickNormal,
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughness: 0.9,
        metalness: 0.0,
    })
);
house_walls.position.set(0, 4.2, 0);
scene.add(house_walls);

const house_roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.4, 1.0, 4),
    new THREE.MeshStandardMaterial({
        color: 0xaa0000,
        map: roofDiffuse,
        normalMap: roofNormal,
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughness: 0.8,
        metalness: 0.0,
    })
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


const door_handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 80 })
);
door_handle.position.set(-0.14, 3.86, -0.84);
scene.add(door_handle);

scene.background = new THREE.Color(0x252f33);


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

// window crosses to make them look like they have 4 parts
const vertical_bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.025), windowFrame);
vertical_bar1.position.set(0.86, 4.3, 0);
scene.add(vertical_bar1);

const horizontal_bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.44), windowFrame);
horizontal_bar1.position.set(0.86, 4.3, 0);
scene.add(horizontal_bar1);

const vertical_bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.025), windowFrame);
vertical_bar2.position.set(-0.86, 4.3, 0);
scene.add(vertical_bar2);

const horizontal_bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.44), windowFrame);
horizontal_bar2.position.set(-0.86, 4.3, 0);
scene.add(horizontal_bar2);

const train = new THREE.Group();


const locomotive = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 0.5),
    new THREE.MeshPhongMaterial({ color: 0xcc0000, shininess: 40 })
);
train.add(locomotive);

const train_chimney = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8),
    new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 20 })
);
train_chimney.position.set(0.35, 0.45, 0);
train.add(train_chimney);

const train_windowMaterial = new THREE.MeshPhongMaterial({ color: 0xffcc44, emissive: 0xffaa00, emissiveIntensity: 0.3, shininess: 80 });
const loco_win_left = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.02), train_windowMaterial);
loco_win_left.position.set(0.1, 0.18, 0.27);
train.add(loco_win_left);

const loco_win_right = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.02), train_windowMaterial);
loco_win_right.position.set(0.1, 0.18, -0.27);
train.add(loco_win_right);

const loco_win_front = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.35), train_windowMaterial);
loco_win_front.position.set(0.61, 0.18, 0);
train.add(loco_win_front);

const wheelMat = new THREE.MeshPhongMaterial({ color: 0x111111, shininess: 60 });

const loco_wheel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
loco_wheel1.rotation.x = Math.PI / 2;
loco_wheel1.position.set(-0.35, -0.25, 0.28);
train.add(loco_wheel1);

const loco_wheel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
loco_wheel2.rotation.x = Math.PI / 2;
loco_wheel2.position.set(-0.35, -0.25, -0.28);
train.add(loco_wheel2);

const loco_wheel3 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
loco_wheel3.rotation.x = Math.PI / 2;
loco_wheel3.position.set(0, -0.25, 0.28);
train.add(loco_wheel3);

const loco_wheel4 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
loco_wheel4.rotation.x = Math.PI / 2;
loco_wheel4.position.set(0, -0.25, -0.28);
train.add(loco_wheel4);

const loco_whl5 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
loco_whl5.rotation.x = Math.PI / 2;
loco_whl5.position.set(0.35, -0.25, 0.28);
train.add(loco_whl5);

const loco_whl6 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
loco_whl6.rotation.x = Math.PI / 2;
loco_whl6.position.set(0.35, -0.25, -0.28);
train.add(loco_whl6);

// Blue Wagon
const wagon1 = new THREE.Group();

const wagon1_body = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.55, 0.5),
    new THREE.MeshPhongMaterial({ color: 0x2255cc, shininess: 40 })
);
wagon1.add(wagon1_body);

const wagon1_win_left = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.02), train_windowMaterial);
wagon1_win_left.position.set(0, 0.1, 0.27);
wagon1.add(wagon1_win_left);

const wagon1_win_right = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.02), train_windowMaterial);
wagon1_win_right.position.set(0, 0.1, -0.27);
wagon1.add(wagon1_win_right);

const wagon1_whl1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
wagon1_whl1.rotation.x = Math.PI / 2;
wagon1_whl1.position.set(-0.3, -0.25, 0.28);
wagon1.add(wagon1_whl1);

const wagon1_wheel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
wagon1_wheel2.rotation.x = Math.PI / 2;
wagon1_wheel2.position.set(-0.3, -0.25, -0.28);
wagon1.add(wagon1_wheel2);

const wagon1_wheel3 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
wagon1_wheel3.rotation.x = Math.PI / 2;
wagon1_wheel3.position.set(0.3, -0.25, 0.28);
wagon1.add(wagon1_wheel3);

const wagon1_whl4 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
wagon1_whl4.rotation.x = Math.PI / 2;
wagon1_whl4.position.set(0.3, -0.25, -0.28);
wagon1.add(wagon1_whl4);

wagon1.position.set(3.5, 3.6, 0);
scene.add(wagon1);

// Green wagon 
const wagon2 = new THREE.Group();

const wagon2_body = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.55, 0.5),
    new THREE.MeshPhongMaterial({ color: 0x228833, shininess: 40 })
);
wagon2.add(wagon2_body);

const wagon2_left_window = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.02), train_windowMaterial);
wagon2_left_window.position.set(0, 0.1, 0.27);
wagon2.add(wagon2_left_window);

const wagon2_right_window = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.02), train_windowMaterial);
wagon2_right_window.position.set(0, 0.1, -0.27);
wagon2.add(wagon2_right_window);

const wagon2_wheel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
wagon2_wheel1.rotation.x = Math.PI / 2;
wagon2_wheel1.position.set(-0.3, -0.25, 0.28);
wagon2.add(wagon2_wheel1);

const wagon2_wheel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
wagon2_wheel2.rotation.x = Math.PI / 2;
wagon2_wheel2.position.set(-0.3, -0.25, -0.28);
wagon2.add(wagon2_wheel2);

const wagon2_wheel3 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
wagon2_wheel3.rotation.x = Math.PI / 2;
wagon2_wheel3.position.set(0.3, -0.25, 0.28);
wagon2.add(wagon2_wheel3);

const wagon2_whl4 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), wheelMat);
wagon2_whl4.rotation.x = Math.PI / 2;
wagon2_whl4.position.set(0.3, -0.25, -0.28);
wagon2.add(wagon2_whl4);

wagon2.position.set(3.5, 3.6, 0);
scene.add(wagon2);

const railMat = new THREE.MeshPhongMaterial({ color: 0x111111, shininess: 80 });
const rail_left = new THREE.Mesh(new THREE.TorusGeometry(3.78, 0.03, 8, 64), railMat);
rail_left.rotation.x = Math.PI / 2;
rail_left.position.y = 3.25;
scene.add(rail_left);

const rail_right = new THREE.Mesh(
    new THREE.TorusGeometry(3.22, 0.03, 8, 64),
    railMat
);
rail_right.rotation.x = Math.PI / 2;
rail_right.position.y = 3.35;
scene.add(rail_right);

train.position.set(3.5, 3.6, 0);
scene.add(train);

const glass_sphere = new THREE.Mesh(
    new THREE.SphereGeometry(6, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0xcce5ff, shininess: 100, transparent: true, opacity: 0.15, depthWrite: false })
);
glass_sphere.position.y = 7;
scene.add(glass_sphere);

createSnow(scene, 6);
const clock = new THREE.Clock();

let trainAngle = 0;
let snowing = true;
let followTrain = false; // camera follows the train when true
const followOffset = new THREE.Vector3(0, 1, -2); // local offset behind & above locomotive

window.addEventListener('keydown', (event) => {
    if (event.key === 'r') snowing = !snowing;
    if (event.key === ' ') shakeSnow(scene);
    if (event.key === 'p') {
        followTrain = !followTrain;
        controls.enabled = !followTrain;
        if (followTrain) {
            camera.lookAt(train.position);
        }
        else{
            camera.position.set(0, 7, -15);
        }
    }
});

function animate() {
    const deltaTime = clock.getDelta();
    trainAngle += deltaTime * 0.5;
// Locomotive
train.position.x = 3.5 * Math.cos(trainAngle);
train.position.z = 3.5 * Math.sin(trainAngle);
train.position.y = 3.6;
train.rotation.y = -(trainAngle + Math.PI / 2);

// Blue wagon
const angle1 = trainAngle - 0.4;
wagon1.position.x = 3.5 * Math.cos(angle1);
wagon1.position.z = 3.5 * Math.sin(angle1);
wagon1.position.y = 3.6;
wagon1.rotation.y = -(angle1 + Math.PI / 2);

// Green wagon 
const angle2 = trainAngle - 0.8;
wagon2.position.x = 3.5 * Math.cos(angle2);
wagon2.position.z = 3.5 * Math.sin(angle2);
wagon2.position.y = 3.6;
wagon2.rotation.y = -(angle2 + Math.PI / 2);
    updateSnow(deltaTime, snowing);
    updateShake(deltaTime, scene);

    if (followTrain) {
        const worldOffset = followOffset.clone();
        
        worldOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -trainAngle);
        camera.position.copy(train.position).add(worldOffset);

        const lookAtPoint = new THREE.Vector3(
            3.5 * Math.cos(trainAngle + 0.5), // Offset the angle forward
            3.6,
            3.5 * Math.sin(trainAngle + 0.5)
        );
        camera.lookAt(lookAtPoint);

    }

    renderer.render(scene, camera);
    controls.update();
}
renderer.setAnimationLoop(animate);