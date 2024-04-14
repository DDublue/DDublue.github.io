// asg1.js

// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform float u_Size;
void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
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

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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
}

// Shape constants
const POINT    = 0;
const TRIANGLE = 1;
const CIRCLE   = 2;

// Global related UI variables
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize  = 5.0;
let g_selectedType  = POINT;
let g_selectedSeg   = 10.0;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  // Button Events
  document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };
  document.getElementById('squButton').onclick   = function() { g_selectedType = POINT; };
  document.getElementById('triButton').onclick   = function() { g_selectedType = TRIANGLE; };
  document.getElementById('cirButton').onclick   = function() { g_selectedType = CIRCLE; };

  // Generate Picture Button Event
  document.getElementById('genButton').onclick = function() { generatePicture(); };

  // Color Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });
  
  // Size and Segment Slider Event
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  document.getElementById('segmentSlide').addEventListener('mouseup', function() { g_selectedSeg = this.value; });
}

function main() {
  // Set up canvas and gl variables
  setupWebGL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = handleClicks;
  canvas.onmousemove = function(ev) {
                          if (ev.buttons == 1) { handleClicks(ev) }
                       };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = []; // The array of points
function handleClicks(ev) {

  // Extract the event click and return it in WebGL coordinates
  [x,y] = convertCoordinatesEventToGL(ev);

  // Create new point
  let point;
  switch (g_selectedType) {
    case POINT:
      point = new Point([x,y], g_selectedColor.slice(), g_selectedSize);
      break;
    case TRIANGLE:
      point = new Triangle([x,y], g_selectedColor.slice(), g_selectedSize);
      break;
    case CIRCLE:
      point = new Circle([x,y], g_selectedColor.slice(), g_selectedSize,
                         g_selectedSeg);
      break;
  }
  g_shapesList.push(point);

  // Draw every shape in g_points with respective color in g_colors
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

// Color constants
const WHITE = [1.0, 1.0, 1.0, 1.0];
const BLACK = [0.0, 0.0, 0.0, 1.0];
const RED   = [1.0, 0.0, 0.0, 1.0];
const GREEN = [0.0, 1.0, 0.0, 1.0];
const BLUE  = [0.0, 0.0, 1.0, 1.0];

function bufferBorder() {
  // Points outline canvas
  for (let x = -0.925; x < 0.975; x += 0.050) {
    g_shapesList.push(new Point([x,-0.925], WHITE, 10.0));
    g_shapesList.push(new Point([x, 0.925], WHITE, 10.0));
    g_shapesList.push(new Point([-0.925,x], WHITE, 10.0));
    g_shapesList.push(new Point([0.925, x], WHITE, 10.0));
  }
}

function bufferTriangleDog() {
  function bufferTail() {
    let t1 = (new Triangle({color: RED, points: [-0.76,-0.14,  -0.80,-0.27,  -0.79,-0.30]}));
    drawTriangle([-0.76,-0.14,  -0.80,-0.27,  -0.79,-0.30], RED);
    drawTriangle([-0.81,-0.35,  -0.80,-0.27,  -0.78,-0.33], GREEN);
    drawTriangle([-0.81,-0.35,  -0.75,-0.38,  -0.78,-0.33], BLUE);
    drawTriangle([-0.81,-0.35,  -0.75,-0.38,  -0.81,-0.40], RED);
    drawTriangle([-0.81,-0.40,  -0.75,-0.38,  -0.77,-0.42], GREEN);
    drawTriangle([-0.81,-0.40,  -0.81,-0.43,  -0.77,-0.42], BLUE);
    drawTriangle([-0.79,-0.45,  -0.81,-0.43,  -0.77,-0.42], RED);
    g_shapesList.push(t1);
  }

  function bufferBody() {
    // Big triangles
    drawTriangle([ 0.00,-0.18,  -0.76,-0.14,  -0.43, 0.00], RED);
    drawTriangle([ 0.00,-0.18,  -0.76,-0.14,  -0.79,-0.30], GREEN);
    drawTriangle([ 0.00,-0.18,  -0.79,-0.30,  -0.53,-0.44], BLUE);
    drawTriangle([ 0.00,-0.18,  -0.19,-0.44,  -0.53,-0.44], RED);
    drawTriangle([ 0.00,-0.18,  -0.19,-0.44,   0.04,-0.44], GREEN);
    drawTriangle([ 0.00,-0.18,   0.27,-0.38,   0.04,-0.44], BLUE);
    drawTriangle([ 0.00,-0.18,   0.27,-0.38,   0.36,-0.21], RED);
    drawTriangle([ 0.00,-0.18,   0.36,-0.04,   0.36,-0.21], GREEN);
    drawTriangle([ 0.00,-0.18,   0.42,-0.02,   0.23, 0.07], BLUE);
    drawTriangle([ 0.00,-0.18,   0.07, 0.15,   0.23, 0.07], RED);
    drawTriangle([ 0.00,-0.18,   0.07, 0.15,   -0.09,0.09], GREEN);
    drawTriangle([ 0.00,-0.18,  -0.43, 0.00,   -0.09,0.09], BLUE);
    
    // Small detailed triangles
    drawTriangle([-0.62,-0.04,  -0.76,-0.14,  -0.43, 0.00], BLUE);
    drawTriangle([-0.73,-0.42,  -0.79,-0.30,  -0.53,-0.44], RED);
    drawTriangle([ 0.36,-0.13,   0.36,-0.04,   0.42,-0.02], RED);
    
  }

  function bufferBackLeg() {

  }

  function bufferFrontLeg() {

  }

  function bufferHead() {

  }

  function bufferEar() {

  }

  function bufferEyes() {

  }
  bufferTail();
  bufferBody();
  bufferBackLeg();
  bufferFrontLeg();
  bufferHead();
  bufferEar();
  bufferEyes();
}

function generatePicture() {
  // Clear <canvas>
  g_shapesList = [];
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Border
  bufferBorder();
  
  // Triangles of dog
  bufferTriangleDog();
  // Render border
  renderAllShapes();
  
  

}
