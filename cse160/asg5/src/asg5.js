import * as THREE from '../lib/node_modules/build/three.module.js';
import {OrbitControls} from '../lib/node_modules/addons/OrbitControls.js';
import {} from '../lib/node_modules/addons/MTLLoader.js';
import {OBJLoader} from '../lib/node_modules/addons/OBJLoader.js';

function main() {
  // Canvas setup
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer( {antialias: true, canvas} );

  // Camera setup
  const fov = 90;
  const aspect = 16/9;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  // Orbit control
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();


  // Scene setup: cube
  const scene = new THREE.Scene();

  // Mesh = geometry + material; add mesh to scene
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    // Texture setup
  const loader = new THREE.TextureLoader();
  const texture = loader.load('../assets/rubikside.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  const cubes = [
    makeInstance(geometry, texture,  0),
    makeInstance(geometry, texture, -2),
    makeInstance(geometry, texture,  2),
  ];

  // Render scene
  renderer.render(scene, camera);
  
  requestAnimationFrame(render);
  
  // Hemisphere light
  {
    const skyColor = 0xB1E1FF; // light blue
    const groundColor = 0xB1E1FF; // brown
    const intensity = 2;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  // Directional light
  {
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  
  {
  // 3D model
  const objLoader = new OBJLoader();
  objLoader.load('../assets/cottage_obj.obj', (root) => {
    scene.add(root);
  });
  }


  // --- FUNCTIONS ---

  // Render animation of meshes
  function render(time) {
    time *= 0.001; // conver time to seconds

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }  
  
  // Make a cube
  function makeInstance(geometry, texture, x) {
    const material = new THREE.MeshPhongMaterial({map: texture});
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    cube.position.x = x;

    return cube;
  }

}

main();
