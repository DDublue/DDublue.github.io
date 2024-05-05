// asg3.js

// Vertex shader program
var VSHADER_SOURCE = `
precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_UV;
varying vec2 v_UV;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    // gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
    gl_FragColor = vec4(v_UV,1.0,1.0);
  }`

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;

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

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  // Angle Slider Events
  h_angleSlide.addEventListener('input',
    function() {
      g_globalAngle = this.value;
      renderAllShapes();
    }
  );
}

function main() {
  // Set up canvas and gl variables
  setupWebGL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

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

  // Update animation angles
  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

// // Globally store previous x and y values
// let g_prevX = 0;
// let g_prevY = 0;
// // From asg1
// function convertCoordinatesEventToGL(ev) {
//   let x = ev.clientX; // x coordinate of a mouse pointer
//   let y = ev.clientY; // y coordinate of a mouse pointer
//   let rect = ev.target.getBoundingClientRect();

//   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
//   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

//   return([x,y]);
// }


// Update the angles of everything if currently animated
function updateAnimationAngles() {

}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

  // Check time at the start of this function
  let startTime = performance.now();

  // Pass matrix to u_ModelMatrix attribute
  let globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Drawing

  let test = new Cube();
  test.matrix.setTranslate(-0.2,-0.2,0);
  test.matrix.rotate(-20,1,0,0);
  test.matrix.scale(0.5,0.5,0.5);
  test.render();

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
