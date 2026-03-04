import * as THREE from 'three';

let snow;
let velocities = [];
let particleCount = 500;
let globeRadius = 5;
let scene_ref;

const gridSize = 10;
const cellSize = 0.5;
let accumulationGrid = {};
let snowPiles = {};

function gridKey(x, z) {
  const gx = Math.round(x / cellSize);
  const gz = Math.round(z / cellSize);
  return `${gx},${gz}`;
}

function createSnowflakeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

export function createSnow(scene, radius) {
  scene_ref = scene;
  globeRadius = radius;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    let x, y, z;
    do {
      x = (Math.random() - 0.5) * globeRadius * 2;
      y = Math.random() * globeRadius;
      z = (Math.random() - 0.5) * globeRadius * 2;
    } while (x*x + y*y + z*z > globeRadius * globeRadius);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    velocities.push(0.5 + Math.random());
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.userData.isFalling = new Array(particleCount).fill(true);

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    map: createSnowflakeTexture(),
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending 
  });

  snow = new THREE.Points(geometry, material);
  //snow.renderOrder = 1;
  snow.position.y = 3.5;
  scene.add(snow);
}

function addSnowPile(x, z) {
  const key = gridKey(x, z);
  accumulationGrid[key] = (accumulationGrid[key] || 0) + 1;
  const hits = accumulationGrid[key];

  if (hits % 5 !== 0) return;

  const height = Math.min(hits / 50, 0.4);
  const radius = Math.min(0.1 + hits / 200, 0.35);

  if (snowPiles[key]) scene_ref.remove(snowPiles[key]);

  const gx = Math.round(x / cellSize) * cellSize;
  const gz = Math.round(z / cellSize) * cellSize;

  if (gx*gx + gz*gz > 2.2 * 2.2) return;

  const pile = new THREE.Mesh(
    new THREE.SphereGeometry(1, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0xf0f0ff, shininess: 80 })
  );
  pile.scale.set(radius, height, radius);
  pile.position.set(gx, 1.25, gz);
  scene_ref.add(pile);
  snowPiles[key] = pile;
}

// Call every frame
export function updateSnow(deltaTime, snowing) {
  if (!snow) return;

  const positions = snow.geometry.attributes.position.array;
  const floorY = -2.2;

  for (let i = 0; i < particleCount; i++) {

    // Only move if snowing is on and particle is falling
    if (snowing && snow.geometry.userData.isFalling[i]) {
      positions[i * 3 + 1] -= velocities[i] * deltaTime;
    }

    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    const outsideSphere = x*x + y*y + z*z > globeRadius * globeRadius;
    const hitFloor = y < floorY;

    if (outsideSphere || hitFloor) {
      if (hitFloor) addSnowPile(x, z);

      if (snowing) {
        // Reset to random position in upper half of sphere
        let nx, ny, nz;
        do {
          nx = (Math.random() - 0.5) * globeRadius * 2;
          ny = Math.random() * globeRadius;
          nz = (Math.random() - 0.5) * globeRadius * 2;
        } while (nx*nx + ny*ny + nz*nz > globeRadius * globeRadius);

        positions[i * 3] = nx;
        positions[i * 3 + 1] = ny;
        positions[i * 3 + 2] = nz;
        snow.geometry.userData.isFalling[i] = true;
      } else {
        snow.geometry.userData.isFalling[i] = false;
      }
    }
  }

  snow.geometry.attributes.position.needsUpdate = true;
}