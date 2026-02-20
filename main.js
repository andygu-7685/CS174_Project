import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



//--------------------------------------------------------------------------------------
//Setup
//--------------------------------------------------------------------------------------



const scene = new THREE.Scene();

//THREE.PerspectiveCamera( fov angle, aspect ratio, near depth, far depth );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.target.set(0, 5, 0);

// Rendering 3D axis
const createAxisLine = (color, start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
};
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3)); // Blue
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);


// ***** Assignment 2 *****
// Setting up the lights
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(5, 5, 5); // Position the light
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x505050);  // Soft white light
scene.add(ambientLight);

const phong_material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Green color
    shininess: 100   // Shininess of the material
});



//--------------------------------------------------------------------------------------
//Model
//--------------------------------------------------------------------------------------



//Mesh Template
const l = 0.5
const positions = new Float32Array([
  
]);
  
const indices = [
  
];

const normals = new Float32Array([
  
]);

const custom_cube_geometry = new THREE.BufferGeometry();
custom_cube_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
custom_cube_geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
custom_cube_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

let cube = new THREE.Mesh( custom_cube_geometry, phong_material );



//Wireframe template
const wireframe_vertices = new Float32Array([
]);

const wireframe_greometry = new THREE.BufferGeometry();
wireframe_greometry.setAttribute( 'position', new THREE.BufferAttribute( wireframe_vertices, 3 ) );

const line = new THREE.LineSegments( wireframe_greometry );



//--------------------------------------------------------------------------------------
//Transformation Template
//--------------------------------------------------------------------------------------



function translationMatrix(tx, ty, tz) {
	return new THREE.Matrix4().set(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1
	);
}
// TODO: Implement the other transformation functions.

function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
		Math.cos(theta), -Math.sin(theta), 0, 0,
		Math.sin(theta), Math.cos(theta), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	);
}

function scalingMatrix(sx, sy, sz) {
  return new THREE.Matrix4().set(
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, 0, 1
  );
}



//--------------------------------------------------------------------------------------
//Custom Transformation
//--------------------------------------------------------------------------------------



const translation = translationMatrix(0, 4*l, 0); // Translate 2l units in the y direction



//--------------------------------------------------------------------------------------
//Create model in Scene
//--------------------------------------------------------------------------------------



let cubes = [];
let lines = [];
for (let i = 0; i < 7; i++) {
	const line = new THREE.LineSegments( wireframe_greometry );
  let cube = new THREE.Mesh( custom_cube_geometry, phong_material );
	cube.matrixAutoUpdate = false;
  line.matrixAutoUpdate = false;
	cubes.push(cube);
  lines.push(line);
	scene.add(cube);
	scene.add(line);
}



//--------------------------------------------------------------------------------------
//Animation Loop
//--------------------------------------------------------------------------------------



let animation_time = 0;
let delta_animation_time;
const clock = new THREE.Clock();

function animate() {
    
	renderer.render( scene, camera );
  controls.update();

  delta_animation_time = clock.getDelta();
  animation_time += delta_animation_time; 

  let model_transformation = new THREE.Matrix4(); // model transformation matrix we will update
  for (let i = 0; i < cubes.length; i++) {
    cubes[i].matrix.copy(model_transformation);
    lines[i].matrix.copy(model_transformation);

    //model_transformation.multiplyMatrices(translation, model_transformation); 
    
    if (still){
      cubes[i].visible = false;
      lines[i].visible = true;
    }
    else{
      cubes[i].visible = true;
      lines[i].visible = false;
    }
  }
}
renderer.setAnimationLoop( animate );



//--------------------------------------------------------------------------------------
//Interactivity
//--------------------------------------------------------------------------------------



let still = false;
window.addEventListener('keydown', onKeyPress); // onKeyPress is called each time a key is pressed
// Function to handle keypress
function onKeyPress(event) {
    switch (event.key) {
        case 's': // Note we only do this if s is pressed.
            still = !still;
            break;
        default:
            console.log(`Key ${event.key} pressed`);
    }
}