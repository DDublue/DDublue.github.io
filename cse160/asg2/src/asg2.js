// asg1.js

// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global variables
let canvas;
let gl;
let a_Position;
let u_Size;
let u_FragColor;
let u_ModelMatrix;
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

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Global related UI variables
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize  = 5.0;
// Camera
let g_globalAngle = 0;
// Body part angles
let g_headAngle = 0;
let g_frontBody = 0;
let g_backBody = 0;
let g_tail = 0;
let g_rightFrontAngle = 0;
let g_leftFrontAngle = 0;
let g_rightBackAngle = 0;
let g_leftBackAngle = 0;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  // Size and Segment Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById('headSlide').addEventListener('mousemove', function() { g_headAngle = this.value; renderAllShapes(); });
  document.getElementById('frontBodySlide').addEventListener('mousemove', function() { g_frontBody = this.value; renderAllShapes(); });
  document.getElementById('backBodySlide').addEventListener('mousemove', function() { g_backBody = this.value; renderAllShapes(); });
  document.getElementById('tailSlide').addEventListener('mousemove', function() { g_tail = this.value; renderAllShapes(); });
  document.getElementById('rightFrontSlide').addEventListener('mousemove', function() { g_rightFrontAngle = this.value; renderAllShapes(); });
  document.getElementById('leftFrontSlide').addEventListener('mousemove', function() { g_leftFrontAngle = this.value; renderAllShapes(); });
  document.getElementById('rightBackSlide').addEventListener('mousemove', function() { g_rightBackAngle = this.value; renderAllShapes(); });
  document.getElementById('leftBackSlide').addEventListener('mousemove', function() { g_leftBackAngle = this.value; renderAllShapes(); });
}

function main() {
  // Set up canvas and gl variables
  setupWebGL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  renderAllShapes();
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

  // Pass matrix to u_ModelMatrix attribute
  let globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // ----------------------------------
  // WOLF FROM MINECRAFT  
  // ----------------------------------

  // Hold all the blocks of wolf in an array
  let wolfBlocks = [];
  
  // Body
  {
  // Front body
  let front = new Cube();
  front.color = [0.9,0.9,0.9,1]; // Light gray 0.9
  front.matrix.setTranslate(-0.2,-0.2,0); // move base
  front.matrix.translate(0,0.14,0);
  front.matrix.rotate(g_frontBody,1,0,0);
  front.matrix.translate(0,-0.14,0);
  var frontCoordinatesMat = new Matrix4(front.matrix);
  front.matrix.scale(0.4,0.4,0.4); // scalar
  front.matrix.scale(0.8,0.7,0.6);
  wolfBlocks.push(front);
  front.render();
  
  // Back body
  let back = new Cube();
  back.color = [0.87,0.87,0.87,1]; // Light gray 0.87
  back.matrix.setTranslate(-0.2,-0.2,0); // move base
  back.matrix = new Matrix4(frontCoordinatesMat);
  back.matrix.translate(0.036,0,0.22);
  back.matrix.translate(0,0.24,0);
  back.matrix.rotate(g_backBody,1,0,0);
  back.matrix.translate(0,-0.24,0);
  var backCoordinatesMat = new Matrix4(back.matrix);
  back.matrix.scale(0.4,0.4,0.4); // scalar
  back.matrix.scale(0.6,0.6,1);
  wolfBlocks.push(back);
  back.render();
  
  // Tail
  let tail = new Cube();
  tail.color = [0.9,0.9,0.9,1]; // Light gray 0.9
  tail.matrix.setTranslate(-0.2,-0.2,0); // move baseback
  tail.matrix = new Matrix4(backCoordinatesMat);
  tail.matrix.translate(0.085,0.15,0.37);
  tail.matrix.translate(0,0.04,0.01);
  tail.matrix.rotate(g_tail,1,0,0);
  tail.matrix.translate(0,-0.04,-0.01);
  tail.matrix.scale(0.4,0.4,0.4); // scalar
  tail.matrix.scale(0.2,0.2,0.8);
  wolfBlocks.push(tail);
  tail.render();
  }

  // Head
  {
  // Head base
  let head = new Cube();
  head.color = [0.87,0.87,0.87,1]; // light gray 0.87
  head.matrix.setTranslate(-0.2,-0.2,0); // move base
  head.matrix.translate(0.041,0.015,-0.1);
  head.matrix.translate(0,0.12,0.16);
  head.matrix.rotate(-g_headAngle,1,0,0);
  head.matrix.translate(0,-0.12,-0.16);
  var headCoordinatesMat = new Matrix4(head.matrix);
  head.matrix.scale(0.4,0.4,0.4); // scalar
  head.matrix.scale(0.6,0.6,0.3);
  wolfBlocks.push(head);
  // head.render();
  
  // Lower head
  let lowerHead = new Cube();
  lowerHead.color = [0.72,0.63,0.6,1]; // light brownish
  lowerHead.matrix.setTranslate(-0.2,-0.2,0); // move base
  lowerHead.matrix = new Matrix4(headCoordinatesMat);
  lowerHead.matrix.translate(0.059,0.04,-0.0001);
  lowerHead.matrix.scale(0.4,0.4,0.4); // scalar
  lowerHead.matrix.scale(0.3,0.3,0.15);
  wolfBlocks.push(lowerHead);
  // lowerHead.render();

  // Upper mouth
  let upperMouth = new Cube();
  upperMouth.color = [0.85,0.73,0.6,1]; // light light brownish
  upperMouth.matrix.setTranslate(-0.2,-0.2,0); // move base
  upperMouth.matrix = new Matrix4(headCoordinatesMat);
  upperMouth.matrix.translate(0.059,0.04,-0.14);
  upperMouth.matrix.scale(0.4,0.4,0.4); // scalar
  upperMouth.matrix.scale(0.3,0.2,0.4);
  wolfBlocks.push(upperMouth);
  // upperMouth.render();

  // Lower mouth
  let lowerMouth = new Cube();
  lowerMouth.color = [0.1,0.1,0.1,1]; // light black
  lowerMouth.matrix.setTranslate(-0.2,-0.2,0); // move base
  lowerMouth.matrix = new Matrix4(headCoordinatesMat);
  lowerMouth.matrix.translate(0.059,0,-0.14);
  lowerMouth.matrix.scale(0.4,0.4,0.4); // scalar
  lowerMouth.matrix.scale(0.3,0.1,0.4);
  wolfBlocks.push(lowerMouth);
  // lowerMouth.render();
  
  // Nose
  let nose = new Cube();
  nose.color = [0.1,0.1,0.1,1]; // light black
  nose.matrix.setTranslate(-0.2,-0.2,0); // move base
  nose.matrix = new Matrix4(headCoordinatesMat);
  nose.matrix.translate(0.1,0.081,-0.141);
  nose.matrix.scale(0.4,0.4,0.4); // scalar
  nose.matrix.scale(0.1,0.1,0.1);
  wolfBlocks.push(nose);
  // nose.render();
  
  // Right eye
  let rightEye = new Cube();
  rightEye.color = [1,1,1,1]; // white
  rightEye.matrix.setTranslate(-0.2,-0.2,0); // move base
  rightEye.matrix = new Matrix4(headCoordinatesMat);
  rightEye.matrix.translate(0.001,0.121,-0.01);
  rightEye.matrix.scale(0.4,0.4,0.4); // scalar
  rightEye.matrix.scale(0.2,0.1,0.1);
  wolfBlocks.push(rightEye);
  // rightEye.render();

  // Right pupil
  let rightPupil = new Cube();
  rightPupil.color = [0.05,0.05,0.05,1]; // black
  rightPupil.matrix.setTranslate(-0.2,-0.2,0); // move base
  rightPupil.matrix = new Matrix4(headCoordinatesMat);
  rightPupil.matrix.translate(0.04,0.12,-0.011);
  rightPupil.matrix.scale(0.4,0.4,0.4); // scalar
  rightPupil.matrix.scale(0.11,0.11,0.11);
  wolfBlocks.push(rightPupil);
  // rightPupil.render();
  
  // Left eye
  let leftEye = new Cube();
  leftEye.color = [1,1,1,1]; // white
  leftEye.matrix.setTranslate(-0.2,-0.2,0); // move base
  leftEye.matrix = new Matrix4(headCoordinatesMat);
  leftEye.matrix.translate(0.159,0.121,-0.01);
  leftEye.matrix.scale(0.4,0.4,0.4); // scalar
  leftEye.matrix.scale(0.2,0.1,0.1);
  wolfBlocks.push(leftEye);
  // leftEye.render();

  // Left pupil
  let leftPupil = new Cube();
  leftPupil.color = [0.05,0.05,0.05,1]; // black
  leftPupil.matrix.setTranslate(-0.2,-0.2,0); // move base
  leftPupil.matrix = new Matrix4(headCoordinatesMat);
  leftPupil.matrix.translate(0.158,0.12,-0.011);
  leftPupil.matrix.scale(0.4,0.4,0.4); // scalar
  leftPupil.matrix.scale(0.11,0.11,0.11);
  wolfBlocks.push(leftPupil);
  // leftPupil.render();

  // Right ear
  let rightEar = new Cube();
  rightEar.color = [0.85,0.85,0.85,1] // light gray 0.85
  rightEar.matrix.setTranslate(-0.2,-0.2,0); // move base
  rightEar.matrix = new Matrix4(headCoordinatesMat);
  rightEar.matrix.translate(0.01,0.23,0.06);
  rightEar.matrix.scale(0.4,0.4,0.4); // scalar
  rightEar.matrix.scale(0.2,0.3,0.1);
  wolfBlocks.push(rightEar);
  // rightEar.render();

  // Left ear
  let leftEar = new Cube();
  leftEar.color = [0.85,0.85,0.85,1] // light gray 0.85
  leftEar.matrix.setTranslate(-0.2,-0.2,0); // move base
  leftEar.matrix = new Matrix4(headCoordinatesMat);
  leftEar.matrix.translate(0.158,0.23,0.06);
  leftEar.matrix.scale(0.4,0.4,0.4); // scalar
  leftEar.matrix.scale(0.2,0.3,0.1);
  wolfBlocks.push(leftEar);
  // leftEar.render();

  }

  // Limbs
  {
  // Right front leg
  let rightFrontLeg = new Cube();
  rightFrontLeg.color = [0.85,0.85,0.85,1] // light gray 0.85
  rightFrontLeg.matrix.setTranslate(-0.2,-0.2,0); // move base
  rightFrontLeg.matrix = new Matrix4(frontCoordinatesMat);
  rightFrontLeg.matrix.translate(0.055,-0.30,0.03);
  rightFrontLeg.matrix.translate(0,0.4,0.04);
  rightFrontLeg.matrix.rotate(-g_rightFrontAngle,1,0,0);
  rightFrontLeg.matrix.translate(0,-0.4,-0.04);
  rightFrontLeg.matrix.scale(0.4,0.4,0.4); // scalar
  rightFrontLeg.matrix.scale(0.2,0.8,0.2);
  wolfBlocks.push(rightFrontLeg);
  // rightFrontLeg.render();
  
  // Left front leg
  let leftFrontLeg = new Cube();
  leftFrontLeg.color = [0.85,0.85,0.85,1] // light gray 0.85
  leftFrontLeg.matrix.setTranslate(-0.2,-0.2,0); // move base
  leftFrontLeg.matrix = new Matrix4(frontCoordinatesMat);
  leftFrontLeg.matrix.translate(0.185,-0.30,0.03);
  leftFrontLeg.matrix.translate(0,0.4,0.04);
  leftFrontLeg.matrix.rotate(-g_leftFrontAngle,1,0,0);
  leftFrontLeg.matrix.translate(0,-0.4,-0.04);
  leftFrontLeg.matrix.scale(0.4,0.4,0.4); // scalar
  leftFrontLeg.matrix.scale(0.2,0.8,0.2);
  wolfBlocks.push(leftFrontLeg);
  // leftFrontLeg.render();
  
  // Right back leg
  let rightBackLeg = new Cube();
  rightBackLeg.color = [0.85,0.85,0.85,1] // light gray 0.85
  rightBackLeg.matrix.setTranslate(-0.2,-0.2,0); // move base
  rightBackLeg.matrix = new Matrix4(backCoordinatesMat);
  rightBackLeg.matrix.translate(0.02,-0.3,0.29);
  rightBackLeg.matrix.translate(0,0.4,0.04);
  rightBackLeg.matrix.rotate(-g_rightBackAngle,1,0,0);
  rightBackLeg.matrix.translate(0,-0.4,-0.04);
  rightBackLeg.matrix.scale(0.4,0.4,0.4); // scalar
  rightBackLeg.matrix.scale(0.2,0.8,0.2);
  wolfBlocks.push(rightBackLeg);
  // rightBackLeg.render();
  
  // Left back leg
  let leftBackLeg = new Cube();
  leftBackLeg.color = [0.85,0.85,0.85,1] // light gray 0.85
  leftBackLeg.matrix.setTranslate(-0.2,-0.2,0); // move base
  leftBackLeg.matrix = new Matrix4(backCoordinatesMat);
  leftBackLeg.matrix.translate(0.15,-0.30,0.29);
  leftBackLeg.matrix.translate(0,0.4,0.04);
  leftBackLeg.matrix.rotate(-g_leftBackAngle,1,0,0);
  leftBackLeg.matrix.translate(0,-0.4,-0.04);
  leftBackLeg.matrix.scale(0.4,0.4,0.4); // scalar
  leftBackLeg.matrix.scale(0.2,0.8,0.2);
  wolfBlocks.push(leftBackLeg);
  // leftBackLeg.render();
  
  }
  
  // Scale down and render wolf (ENABLE THIS INSTEAD MAYBE LATER)
  for (block of wolfBlocks) {
    block.render();
  }


}
