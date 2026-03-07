import * as THREE from 'three';

let snow;
let velocities = [];
let particleCount = 500;
let globeRadius = 5;

// --- Shake system ---
let shakeSnowMesh = null;
let shakeVelocities = []; // each entry is {vx, vy, vz}
let shakeParticleCount = 300;
const gravity = 3.0;

export function createSnow(scene, radius) {
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

    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    velocities.push(0.7 + Math.random() * 0.5);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.userData.isFalling = new Array(particleCount).fill(true);

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  snow = new THREE.Points(geometry, material);
  snow.position.y = 7;
  scene.add(snow);
}

export function shakeSnow(scene) {
  // Remove previous shake if still alive
  if (shakeSnowMesh) {
    scene.remove(shakeSnowMesh);
    shakeSnowMesh = null;
    shakeVelocities = [];
  }

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(shakeParticleCount * 3);

  for (let i = 0; i < shakeParticleCount; i++) {
    let x, y, z;
    do {
      x = (Math.random() - 0.5) * globeRadius * 2;
      y = (Math.random() - 0.5) * globeRadius * 2;
      z = (Math.random() - 0.5) * globeRadius * 2;
    } while (x*x + y*y + z*z > globeRadius * globeRadius);
    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    // Random outward velocity in all directions
    const speed = 2 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    shakeVelocities.push({
      vx: speed * Math.sin(phi) * Math.cos(theta),
      vy: speed * Math.cos(phi),
      vz: speed * Math.sin(phi) * Math.sin(theta),
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.userData.isFalling = new Array(shakeParticleCount).fill(true);

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  shakeSnowMesh = new THREE.Points(geometry, material);
  shakeSnowMesh.position.y = 7;
  scene.add(shakeSnowMesh);
}

export function updateShake(deltaTime, scene) {
  if (!shakeSnowMesh) return;

  const positions = shakeSnowMesh.geometry.attributes.position.array;
  const floorY = -4.4;
  let anyAlive = false;

  for (let i = 0; i < shakeParticleCount; i++) {
    if (!shakeSnowMesh.geometry.userData.isFalling[i]) continue;

    // Apply gravity and move
    shakeVelocities[i].vy -= gravity * deltaTime;
    positions[i * 3]     += shakeVelocities[i].vx * deltaTime;
    positions[i * 3 + 1] += shakeVelocities[i].vy * deltaTime;
    positions[i * 3 + 2] += shakeVelocities[i].vz * deltaTime;

    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    // Kill particle if it hits floor or leaves sphere — no reset
    if (y < floorY || x*x + y*y + z*z > globeRadius * globeRadius) {
      shakeSnowMesh.geometry.userData.isFalling[i] = false;
      positions[i * 3 + 1] = -999; // hide it
    } else {
      anyAlive = true;
    }
  }

  shakeSnowMesh.geometry.attributes.position.needsUpdate = true;

  // Clean up once all particles are dead
  if (!anyAlive) {
    scene.remove(shakeSnowMesh);
    shakeSnowMesh = null;
    shakeVelocities = [];
  }
}

export function updateSnow(deltaTime, snowing) {
  if (!snow) return;

  const positions = snow.geometry.attributes.position.array;
  const floorY = -4.4;

  for (let i = 0; i < particleCount; i++) {

    if (snowing && snow.geometry.userData.isFalling[i]) {
      positions[i * 3 + 1] -= velocities[i] * deltaTime;
    }

    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    const outsideSphere = x*x + y*y + z*z > globeRadius * globeRadius;
    const hitFloor = y < floorY;

    if (outsideSphere || hitFloor) {
      if (snowing) {
        let nx, ny, nz;
        do {
          nx = (Math.random() - 0.5) * globeRadius * 2;
          ny = Math.random() * globeRadius;
          nz = (Math.random() - 0.5) * globeRadius * 2;
        } while (nx*nx + ny*ny + nz*nz > globeRadius * globeRadius);

        positions[i * 3]     = nx;
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