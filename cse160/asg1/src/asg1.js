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

// Constants
const POINT    = 0;
const TRIANGLE = 1;
const CIRCLE   = 2;

const WHITE    = [1.0, 1.0, 1.0, 1.0];
const BLACK    = [0.0, 0.0, 0.0, 1.0];

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
  canvas.onmousemove = function(ev) { if (ev.buttons == 1) { handleClicks(ev) } };

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
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segment = g_selectedSeg;
  }

  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
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

function bufferBorder() {
  // Points outline canvas
  for (let x = -0.950; x < 1; x += 0.050) {
    let pt1 = new Point();
    let pt2 = new Point();
    let pt3 = new Point();
    let pt4 = new Point();
    pt1.size = pt2.size = pt3.size = pt4.size = 10.0;
    pt1.color = pt2.color = pt3.color = pt4.color = WHITE;
    pt1.position = [x, -0.950];
    pt2.position = [x,  0.950];
    pt3.position = [-0.950, x];
    pt4.position = [ 0.950, x];

    g_shapesList.push(pt1);
    g_shapesList.push(pt2);
    g_shapesList.push(pt3);
    g_shapesList.push(pt4);
  }
  // Debug: ruler
  for (let x = 0; x < 1; x += 0.2) {
    let pt = new Point();
    pt.size = 20.0;
    pt.color = [x+0.2, 0.0, 0.0, 1.0];
    pt.position = [x, 0];
    g_shapesList.push(pt);
  }

  // Debug: Center point
  let center = new Point();
  center.size = 1;
  center.color = WHITE;
  center.position = [0, 0];
  g_shapesList.push(center);
}

function generatePicture() {
  // Clear <canvas>
  g_shapesList = [];
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Border
  bufferBorder();

  // Triangles of dog


  // Render picture
  renderAllShapes();

}
