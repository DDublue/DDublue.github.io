import * as THREE from '../lib/node_modules/build/three.module.js';
import {OrbitControls} from '../lib/node_modules/addons/OrbitControls.js';
import {MTLLoader} from '../lib/node_modules/addons/MTLLoader.js';
import {OBJLoader} from '../lib/node_modules/addons/OBJLoader.js';

// Help from three.js tutorials linked on asg 5a canvas page
function main() {
  // Canvas setup
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer( {antialias: true, canvas, alpha: true} );

  // Camera setup
  const fov = 75;
  const aspect = 16/9;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3;
  camera.position.set(10, 1, 10);

  // Orbit control
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

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
    makeInstance(geometry, texture,  0, 0, 0),
    makeInstance(geometry, texture,  -2.5, 0, 0),
    makeInstance(geometry, texture,  2.5, 0, 0),
    makeInstance(geometry, texture,  5, 0, 0),
    makeInstance(geometry, texture,  -5, 0, 0),

    makeInstance(geometry, texture,  5, 0, -4),
    makeInstance(geometry, texture,  -5, 0, -4),
    makeInstance(geometry, texture,  5, 1, -8),
    makeInstance(geometry, texture,  -5, 0, -8),
    makeInstance(geometry, texture,  -0.75, 2, -4),

    makeInstance(geometry, texture,  0, 0, -8),
    makeInstance(geometry, texture,  -2.5, 0, -8),
    makeInstance(geometry, texture,  2.5, 0, -8),
    makeInstance(geometry, texture,  -1, 0, -15),
    makeInstance(geometry, texture,  -6, 0, -12),

    makeInstance(geometry, texture,  9, 0.5, -4),
    makeInstance(geometry, texture,  -9, 1, -1),
    makeInstance(geometry, texture,  7, 0, 4),
    makeInstance(geometry, texture,  -7, 1, 8),
    makeInstance(geometry, texture,  11, 1, -14),
  ];

  // Render scene
  renderer.render(scene, camera);
  
  requestAnimationFrame(render);
  
  // Skybox
  const bgTexture = loader.load('../assets/Night-Sky-Pan.png',
    () => {
      bgTexture.mapping = THREE.EquirectangularReflectionMapping;
      bgTexture.colorSpace = THREE.SRGBColorSpace;
      scene.background = bgTexture;
    });

  // --- LIGHT SOURCES ---

  // Hemisphere light
  {
    const skyColor = 0xB1E1FF; // light blue
    const groundColor = 0xB1E1FF; // brown
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  // Directional light
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 2, 4);
    scene.add(light);
    scene.add(light.target);
  }
  
  // Ambient light
  {
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
  }

  // 3D model and material: Cottage House
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('../assets/cottage_obj.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('../assets/cottage_obj.obj', (root) => {
        root.scale.set(0.2,0.2,0.2);
        root.position.set(0,-1, -4);
        scene.add(root);
      })
    });
  }
  
  // 3d model: terrain
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('../assets/snow_terrain/SnowTerrain.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('../assets/snow_terrain/SnowTerrain.obj', (root) => {
        root.scale.set(0.5,0.5,0.5);
        root.position.set(0,-1, -4);
        scene.add(root);
      })
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

    // Set the repeat and offset properties of the background texture
    // to keep the image's aspect correct.
    // Note the image may not have loaded yet.
    const canvasAspect = canvas.clientWidth / canvas.clientHeight;
    const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
    const aspect = imageAspect / canvasAspect;
  
    bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
    bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
  
    bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
    bgTexture.repeat.y = aspect > 1 ? 1 : aspect;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }  
  
  // Make a cube
  function makeInstance(geometry, texture, x=0, y=0, z=0) {
    const material = new THREE.MeshPhongMaterial({map: texture});
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    return cube;
  }

}

main();
