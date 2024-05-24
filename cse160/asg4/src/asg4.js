// asg3.js
// Vertex shader program
var VSHADER_SOURCE = `
precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_UV;
attribute vec3 a_Normal;
varying vec2 v_UV;
varying vec3 v_Normal;
varying vec4 v_VertPos;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal,1)));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  void main() {
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal + 1.0)/2.0, 1.0);   // Use normal

    }
    else if (u_whichTexture == -2) {                    // Use color
      gl_FragColor = u_FragColor;

    } else if (u_whichTexture == -1) {             // Use UV debug color
      gl_FragColor = vec4(v_UV,1.0,1.0);

    } else if (u_whichTexture == 0) {              // Use texture0
      gl_FragColor = texture2D(u_Sampler0, v_UV);

    } else if (u_whichTexture == 1) {              // Use texture1
      gl_FragColor = texture2D(u_Sampler1, v_UV);

    } else {                                       // Error, put Redish
      gl_FragColor = vec4(0.1,0.2,0.2,1);
    }

    vec3 lightVector = u_lightPos-vec3(v_VertPos);
    float r=length(lightVector);

    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    // Reflection
    vec3 R = reflect(-L, N);

    // Eye
    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    // Specular
    float specular = pow(max(dot(E,R), 0.0), 128.0);

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.2;
    if (u_lightOn) {
        gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
    }
  }`

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_NormalMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (u_Size < 0) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_lightPos
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }  

  // Get the storage location of u_cameraPos
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }
  
  // Get the storage location of u_lightOn
  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }
  
  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_NormalMatrix
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}


// Global related UI variables
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize  = 5.0;
// Camera
let g_globalAngle = 0;
// Global HTML elements
let h_angleSlide = document.getElementById('angleSlide');
let g_normalOn = false;
let g_lightPos = [0,1,0];
let animateLight = false;
let g_lightOn = true;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  // Button Events
  document.getElementById('normalOn').onclick = function() {
    g_normalOn = true;
  };
  document.getElementById('normalOff').onclick = function() {
    g_normalOn = false;
  }
  document.getElementById('animateLightOn').onclick = function() {
    animateLight = true;
  }
  document.getElementById('animateLightOff').onclick = function() {
    animateLight = false;
  }
  document.getElementById('turnLightOn').onclick = function() {
    g_lightOn = true;
  }
  document.getElementById('turnLightOff').onclick = function() {
    g_lightOn = false;
  }
  
  
  // Slider Events
  document.getElementById('lightSlideX').addEventListener('mousemove',
    function(ev) {
      if (ev.buttons == 1) {
       g_lightPos[0] = this.value/100; renderAllShapes(); 
      }
    }
  );
  document.getElementById('lightSlideY').addEventListener('mousemove',
    function(ev) {
      if (ev.buttons == 1) {
       g_lightPos[1] = this.value/100; renderAllShapes(); 
      }
    }
  );
  document.getElementById('lightSlideZ').addEventListener('mousemove',
    function(ev) {
      if (ev.buttons == 1) {
       g_lightPos[2] = this.value/100; renderAllShapes(); 
      }
    }
  );

  // Angle Slider Events
  h_angleSlide.addEventListener('input',
    function() {
      g_globalAngle = this.value;
      renderAllShapes();
    }
  );
}

function initTextures() {
  // Create image objects
  let image0 = new Image();
  let image1 = new Image();
  if (!image0) {
    console.log('Failed to create the image0 object');
    return false;
  }
  if (!image1) {
    console.log('Failed to create the image1 object');
    return false;
  }

  // Register the event handler to be called on loading an image
  // and tell browser to load an image
  image0.onload = function() {
    sendImageToTEXTURE(image0, 0);
  }
  image1.onload = function() {
    sendImageToTEXTURE(image1, 1);
  }
  
  image0.src = '../assets/images/sky.jpg';
  image1.src = '../assets/images/dirt.jpg';

  return true;
}

function sendImageToTEXTURE(image, n) {
  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1) // Flip the image's y axis
  // Enable texture unit0
  if (n == 0) {
    gl.activeTexture(gl.TEXTURE0);
  } else if (n == 1) {
    gl.activeTexture(gl.TEXTURE1);

  }
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture iamge
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 'n' to the sampler
  if (n == 0) {
    gl.uniform1i(u_Sampler0, n);
  } else if (n == 1) {
    gl.uniform1i(u_Sampler1, n);
  }

  // gl.clear(gl.COLOR_BUFFER_BIT); // Clear canvas
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw rec
  console.log('Finished sendImageToTEXTURE ' + n);
}

function main() {
  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Check keydowns
  document.onkeydown = keydown;

  // Do camera movement
  canvas.onmousedown = onMove;
  canvas.onmousemove = onMove;


  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0,0,0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  requestAnimationFrame(tick);
}

// Global variables for animation
let g_startTime = performance.now()/1000.0;
let g_seconds = performance.now()/1000.0 - g_startTime;

// Called by browser repeatedly whenever its time
function tick() {
  // Save the current time
  g_seconds = performance.now()/1000.0 - g_startTime;
  // console.log(g_seconds); // DEBUG

  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if (animateLight) g_lightPos[0] = cos(g_seconds);
}

let camera = new Camera(); 

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function drawMap() {
  for (let x=0; x<32; x++) {
    for (let y=0; y<32; y++) {
      for (let z=0; z<2; z++) {
        if (map[x][y] == 1) {
          let body = new Cube();
          body.color = WHITE;
          body.textureNum = -2+z;
          body.matrix.translate(0, -0.75+z*0.5, 0);
          body.matrix.scale(0.5, 0.5, 0.5);
          body.matrix.translate(x-16, 0, y-16);
          body.renderfast();
        }
      }
    }
  }
}

// Globally store previous x and y values
let g_prevX = 0;
let g_prevY = 0;
// From asg1
function convertCoordinatesEventToGL(ev) {
  let x = ev.clientX; // x coordinate of a mouse pointer
  let y = ev.clientY; // y coordinate of a mouse pointer
  let rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

// Camera movement
function onMove(ev) {
  [x,y] = convertCoordinatesEventToGL(ev);
  if (ev.buttons == 1) {
    // Actual calculation
    if (x > g_prevX) {
      camera.panRight(5);
    } else
    if (x < g_prevX) {
      camera.panLeft(5);
    }
  }
  [g_prevX,g_prevY] = [x,y];
}
function keydown(ev) {

  if (ev.keyCode == 68) { // D
    camera.right();
  } else
  if (ev.keyCode == 65) { // A
    camera.left();
  };

  if (ev.keyCode == 87) { // W
    camera.forward();
  } else
  if (ev.keyCode == 83) { // S
    camera.back();
  };

  if (ev.keyCode == 81) { // Q
    camera.panLeft();
  } else
  if (ev.keyCode == 69) { // E
    camera.panRight();
  }

  renderAllShapes();
  console.log(ev.keyCode);
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

  // Check time at the start of this function
  let startTime = performance.now();

  // Pass the projection matrix
  let projMat = new Matrix4();
  projMat.setPerspective(camera.fov, canvas.width/canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  let viewMat = new Matrix4();
  viewMat.setLookAt(
    camera.eye.elements[0],camera.eye.elements[1],camera.eye.elements[2],
    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass matrix to u_ModelMatrix attribute
  let globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let shapeList = [];

  // // Drawing

  // Pass the light position to GLSL
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  // Pass the camera position to GLSL
  gl.uniform3f(u_cameraPos, camera.eye.x, camera.eye.y, camera.eye.z);
  // Pass the light status
  gl.uniform1i(u_lightOn, g_lightOn);

  
  // Light source
  let light = new Cube();
  light.color = [2,2,0,1];
  light.textureNum = -2;
  light.matrix.translate(g_lightPos[0],g_lightPos[1],g_lightPos[2]);
  light.matrix.scale(-0.1,-0.1,-0.1);
  light.matrix.translate(-0.5,-0.5,-0.5);
  shapeList.push(light);


  // Test cube 1
  let test1 = new Cube();
  if (g_normalOn) test1.textureNum = -3;
  test1.color = WHITE;
  test1.matrix.rotate(10,1,0,0);
  test1.matrix.scale(0.5,0.5,0.5);
  test1.normalMatrix.setInverseOf(test1.matrix).transpose();
  shapeList.push(test1);
  
  // Test cube 2
  let test2 = new Cube();
  test2.color = LIGHT;
  test2.textureNum = -2;
  if (g_normalOn) test2.textureNum = -3;
  test2.matrix.translate(-1,-0.5,0.5);
  test2.matrix.rotate(45,1,1,0);
  test2.matrix.scale(0.5,0.5,0.5);
  test2.normalMatrix.setInverseOf(test2.matrix).transpose();
  shapeList.push(test2);
  
  // Draw the sky
  let sky = new Cube();
  sky.color = [1,0,0,1];
  sky.textureNum = 0;
  // if (g_normalOn) sky.textureNum = -3;
  sky.matrix.scale(100, 100, 100);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  shapeList.push(sky);
  
  // Draw the floor
  let floor = new Cube();
  floor.color = [1.0,0,0,1];
  floor.textureNum = 1;
  // if (g_normalOn) floor.textureNum = -3;
  floor.matrix.translate(0, -1, 0);
  floor.matrix.scale(16, 0.25, 16);
  floor.matrix.translate(-0.5, 0, -0.5);
  shapeList.push(floor);

  // Stuck in a cube
  let box = new Cube();
  box.color = [1.0,0,0,1];
  box.textureNum = -2;
  if (g_normalOn) box.textureNum = -3;
  box.matrix.translate(0,1,1);
  box.matrix.scale(-4,-4,-4);
  box.matrix.translate(-0.5,-0.5,-0.5);
  shapeList.push(box);

  // Sphere test
  let sphere1 = new Sphere();
  sphere1.textureNum = 0;
  if (g_normalOn) sphere1.textureNum = -3;
  sphere1.matrix.translate(0,0,0);
  sphere1.matrix.scale(0.5,0.5,0.5);
  sphere1.matrix.translate(2.5,0.4,0.5);
  sphere1.normalMatrix.setInverseOf(sphere1.matrix).transpose();
  shapeList.push(sphere1);

  for (shape of shapeList) {
    shape.render();
  }

  // drawMap();

  // Performance
  let duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration)
                 + " fps: " + Math.floor(10000/duration)/10, 'performance');

}

function sendTextToHTML(text, htmlID) {
  let h_element = document.getElementById(htmlID);
  if (!h_element) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  h_element.innerHTML = text;
}
