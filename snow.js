import * as THREE from 'three';

let snow; // particle system object
let velocities = []; // falling speed of each snowflake
let particleCount = 500; // number of snowflakes
let globeRadius = 5; // size of the sphere (struggling to have the snow fall within sphere so not actual radius for now)

export function createSnow(scene, radius) {

  globeRadius = radius;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  // Create particles
  for (let i = 0; i < particleCount; i++) {

    // Random position inside sphere
    // Random number between -radius and +radius
    let x, y, z;
    do {
      x = (Math.random() - 0.5) * globeRadius * 2;
      y = Math.random() * globeRadius;
      z = (Math.random() - 0.5) * globeRadius * 2;
    } while (x*x + y*y + z*z > globeRadius * globeRadius); // Point is inside sphere

    // Particle's position in 3D
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Store falling speed for each particle
    velocities.push(0.5 + Math.random());
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );

  // Render each vertex as a dot
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08
  });

  snow = new THREE.Points(geometry, material);
  snow.position.y = 3.5;
  scene.add(snow);
}

// Call every f
export function updateSnow(deltaTime) {
  if (!snow) return;

  const positions = snow.geometry.attributes.position.array;

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 1] -= velocities[i] * deltaTime;

    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    if (x*x + y*y + z*z > globeRadius * globeRadius) {
      // Reset to random position in upper half of sphere
      let nx, ny, nz;
      do {
        nx = (Math.random() - 0.5) * globeRadius * 2;
        ny = Math.random() * globeRadius; // upper half only
        nz = (Math.random() - 0.5) * globeRadius * 2;
      } while (nx*nx + ny*ny + nz*nz > globeRadius * globeRadius);

      positions[i * 3] = nx;
      positions[i * 3 + 1] = ny;
      positions[i * 3 + 2] = nz;
    }
  }

  snow.geometry.attributes.position.needsUpdate = true;
}