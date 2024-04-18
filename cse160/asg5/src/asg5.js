import * as THREE from '../lib/node_modules/build/three.module.js';


function main() {
  // Canvas setup
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer( {antialias: true, canvas} );

  // Camera setup
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  camera.position.z = 2;

  // Scene setup: cube
  const scene = new THREE.Scene();
  // Mesh = geometry + material; add mesh to scene
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const material = new THREE.MeshBasicMaterial({color: 0x44aa88});

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Render scene
  renderer.render(scene, camera);
  console.log(THREE);
}

main();
