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
// Eyelid y-size
let g_eyelidSize = 0;

// Animation Select
// '', 'idleAnimation', 'walkAnimation', 'sitAnimation'
let g_animationSelect = '';

// Global mouseDown check
let g_isMouseDown = '';
// Global shiftKeyHeld check over <canvas>
let isShiftKeyHeld = false;

// Global HTML elements
let h_angleSlide = document.getElementById('angleSlide');
let h_headSlide = document.getElementById('headSlide');
let h_frontBodySlide = document.getElementById('frontBodySlide');
let h_backBodySlide = document.getElementById('backBodySlide');
let h_tailSlide = document.getElementById('tailSlide');
let h_rightFrontSlide = document.getElementById('rightFrontSlide');
let h_leftFrontSlide = document.getElementById('leftFrontSlide');
let h_rightBackSlide = document.getElementById('rightBackSlide');
let h_leftBackSlide = document.getElementById('leftBackSlide');
let h_animationSelect = document.getElementById('animationSelect');
let h_resetButton = document.getElementById('resetAnimationButton');

// Test performance
let isTestPerformance = false;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  // Angle Slider Events
  h_angleSlide.addEventListener('input',
    function() {
      g_globalAngle = this.value;
      renderAllShapes();
    }
  );
  h_headSlide.addEventListener('input',
    function() {
      g_headAngle = this.value;
      renderAllShapes();
    }
  );
  h_frontBodySlide.addEventListener('input',
    function() {
      g_frontBody = this.value;
      renderAllShapes();
    }
  );
  h_backBodySlide.addEventListener('input',
    function() {
      g_backBody = this.value;
      renderAllShapes();
    }
  );
  h_tailSlide.addEventListener('input',
    function() {
      g_tail = this.value;
      renderAllShapes();
    }
  );
  h_rightFrontSlide.addEventListener('input',
    function() {
      g_rightFrontAngle = this.value;
      renderAllShapes();
    }
  );
  h_leftFrontSlide.addEventListener('input',
    function() {
      g_leftFrontAngle = this.value;
      renderAllShapes();
    }
  );
  h_rightBackSlide.addEventListener('input',
    function() {
      g_rightBackAngle = this.value;
      renderAllShapes();
    }
  );
  h_leftBackSlide.addEventListener('input',
    function() {
      g_leftBackAngle = this.value;
      renderAllShapes();
    }
  );

  // Select Animation Event
  h_animationSelect.onchange = function() {
    g_animationSelect = this.value;
    if (g_animationSelect == '') {
      h_resetButton.style.display = 'inline-block';
    } else {
      h_resetButton.style.display = 'none';
  
    }
    renderAllShapes();
  };

  // Reset Animation if None
  h_resetButton.onclick = function() {
    g_headAngle = 0;
    g_frontBody = 0;
    g_backBody = 0;
    g_tail = 45;
    g_rightFrontAngle = 0;
    g_leftFrontAngle = 0;
    g_rightBackAngle = 0;
    g_leftBackAngle = 0;
    renderAllShapes();
  };

  // Shift check (+click for an animation)
  document.addEventListener('keyup',
    function(ev) {
      isShiftKeyHeld = false;
    }
  );
  document.addEventListener('keydown',
    function(ev) {
      isShiftKeyHeld = true;
    }
  );

  document.getElementById('offPerformanceMode').onclick = function() {
    isTestPerformance = false;
  };
  document.getElementById('onPerformanceMode').onclick = function() {
    isTestPerformance = true;
  };

}

function main() {
  // Set up canvas and gl variables
  setupWebGL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Do camera movement
  canvas.onmousedown = handleCamera;
  canvas.onmousemove = handleCamera;

  // Do shift+click for an animation
  canvas.onmousedown = shiftClickAnimation;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.3,0.75,0.8, 1.0);

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
function handleCamera(ev) {
  [x,y] = convertCoordinatesEventToGL(ev);
  if (ev.buttons == 1) {
    // Fix bug for NaN
    if (!g_globalAngle) {
      g_globalAngle = 0;
    }
    // Actual calculation
    g_globalAngle = (g_globalAngle + 200 * (g_prevX - x)) % 359;
    // Convert negative angles to positive
    if (g_globalAngle < 0.0) {
      g_globalAngle = 358.9 - g_globalAngle;
    }
    h_angleSlide.value = g_globalAngle;
  }
  [g_prevX,g_prevY] = [x,y];
}

// Shift+click animation
function shiftClickAnimation(ev) {
  if (ev.buttons == 1 && isShiftKeyHeld) {
    switch (g_animationSelect) {
      case '':
        g_animationSelect = 'sitAnimation';
        h_animationSelect.value = 'sitAnimation';
        break;
      case 'idleAnimation':
        g_animationSelect = 'walkAnimation';
        h_animationSelect.value = 'walkAnimation';
        break;
      case 'walkAnimation':
        g_animationSelect = 'sitAnimation';
        h_animationSelect.value = 'sitAnimation';
        break;
      case 'sitAnimation':
        g_animationSelect = 'idleAnimation';
        h_animationSelect.value = 'idleAnimation';
        break;
    }
  }
}

// Update the angles of everything if currently animated
function updateAnimationAngles() {
  if (g_animationSelect === 'idleAnimation') {
    g_headAngle = 0.25*Math.sin(g_seconds*1);
    g_frontBody = -0.5*Math.sin(g_seconds*1);
    g_backBody  = 0.5*Math.sin(g_seconds*1)+0.5;
    g_tail      = 2*Math.sin(g_seconds*1)+45;
    g_rightFrontAngle = 0.25*Math.sin(g_seconds*1);
    g_leftFrontAngle  = -0.25*Math.sin(g_seconds*1);
    g_rightBackAngle  = 0.25*Math.sin(g_seconds*1);
    g_leftBackAngle   = -0.25*Math.sin(g_seconds*1);
  } else if (g_animationSelect === 'walkAnimation') {
    g_headAngle = 0.25*Math.sin(g_seconds*-10);
    g_frontBody = -0.5*Math.sin(g_seconds*2);
    g_backBody  = 0.5*Math.sin(g_seconds*2)+0.5;
    g_tail      = 2*Math.sin(g_seconds*10)+28;
    g_rightFrontAngle = 30*Math.sin(g_seconds*10);
    g_leftFrontAngle  = -30*Math.sin(g_seconds*10);
    g_rightBackAngle  = 30*Math.sin(g_seconds*10);
    g_leftBackAngle   = -30*Math.sin(g_seconds*10);
  } else if (g_animationSelect === 'sitAnimation') {
    g_headAngle = 0.25*Math.sin(g_seconds*1);
    g_frontBody = -0.5*Math.sin(g_seconds*1)+20;
    g_backBody  = 0.5*Math.sin(g_seconds*1)+30;
    g_tail      = 5*Math.sin(g_seconds*7)-75;
    g_rightFrontAngle = 0.25*Math.sin(g_seconds*1)+0;
    g_leftFrontAngle  = -0.25*Math.sin(g_seconds*1)+0;
    g_rightBackAngle  = 0.25*Math.sin(g_seconds*1)-30;
    g_leftBackAngle   = -0.25*Math.sin(g_seconds*1)-30;
  }
  h_headSlide.value       = g_headAngle;
  h_frontBodySlide.value  = g_frontBody;
  h_backBodySlide.value   = g_backBody;
  h_tailSlide.value       = g_tail;
  h_rightFrontSlide.value = g_rightFrontAngle;
  h_leftFrontSlide.value  = g_leftFrontAngle;
  h_rightBackSlide.value  = g_rightBackAngle;
  h_leftBackSlide.value   = g_leftBackAngle;
  // Animate blinking
  if (g_seconds % 3 < 0.07) {
    g_eyelidSize = 0.06 + Math.sin(g_seconds*50)*0.06;
  } else {
    g_eyelidSize = 0.01;
  }
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

  // ----------------------------------
  // WOLF FROM MINECRAFT  
  // ----------------------------------
  {
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
    }
  
    // Head
    {
    // Head base
    let head = new Cube();
    head.color = [0.87,0.87,0.87,1]; // light gray 0.87
    head.matrix.setTranslate(-0.2,-0.2,0); // move base
    head.matrix.translate(0.041,0.015,-0.1);
    head.matrix.translate(0.12,0.12,0.16);

    // Different rotation pivots for different animations
    if (g_animationSelect === 'idleAnimation') {
      if (g_seconds % 10 < 3) {
        head.matrix.rotate(-g_headAngle+15,0,0,1);
      } else {
        head.matrix.rotate(-g_headAngle,0,0,1);
      }
    } else if (g_animationSelect === 'walkAnimation') {
      head.matrix.rotate(-g_headAngle,1,0,0);
    } else if (g_animationSelect === 'sitAnimation') {
      if (g_seconds % 10 < 3) {
        head.matrix.rotate(-g_headAngle-15,0,0,1);
      } else {
        head.matrix.rotate(-g_headAngle,0,0,1);
      }
    } else {
      head.matrix.rotate(-g_headAngle,1,0,0);
    }

    head.matrix.translate(-0.12,-0.12,-0.16);
    var headCoordinatesMat = new Matrix4(head.matrix);
    head.matrix.scale(0.4,0.4,0.4); // scalar
    head.matrix.scale(0.6,0.6,0.3);
    wolfBlocks.push(head);
    
    // Lower head
    let lowerHead = new Cube();
    lowerHead.color = [0.72,0.63,0.6,1]; // light brownish
    lowerHead.matrix.setTranslate(-0.2,-0.2,0); // move base
    lowerHead.matrix = new Matrix4(headCoordinatesMat);
    lowerHead.matrix.translate(0.059,0.04,-0.0001);
    lowerHead.matrix.scale(0.4,0.4,0.4); // scalar
    lowerHead.matrix.scale(0.3,0.3,0.15);
    wolfBlocks.push(lowerHead);
  
    // Hat
    let hat = new Pyramid();
    hat.color = [0.65,0.3,0.2,1]; // red
    hat.matrix.setTranslate(-0.2,-0.2,0); // move base
    hat.matrix = new Matrix4(headCoordinatesMat);
    hat.matrix.translate(0.02,0.24,-0.05);
    hat.matrix.scale(0.4,0.4,0.4); // scalar
    hat.matrix.scale(0.5,0.8,0.5);
    wolfBlocks.push(hat);

    // Upper mouth
    let upperMouth = new Cube();
    upperMouth.color = [0.85,0.73,0.6,1]; // light light brownish
    upperMouth.matrix.setTranslate(-0.2,-0.2,0); // move base
    upperMouth.matrix = new Matrix4(headCoordinatesMat);
    upperMouth.matrix.translate(0.059,0.041,-0.14);
    upperMouth.matrix.scale(0.4,0.4,0.4); // scalar
    upperMouth.matrix.scale(0.3,0.2,0.4);
    wolfBlocks.push(upperMouth);
  
    // Lower mouth
    let lowerMouth = new Cube();
    lowerMouth.color = [0.1,0.1,0.1,1]; // light black
    lowerMouth.matrix.setTranslate(-0.2,-0.2,0); // move base
    lowerMouth.matrix = new Matrix4(headCoordinatesMat);
    lowerMouth.matrix.translate(0.059,0.001,-0.14);
    lowerMouth.matrix.scale(0.4,0.4,0.4); // scalar
    lowerMouth.matrix.scale(0.3,0.1,0.4);
    wolfBlocks.push(lowerMouth);
    
    // Nose
    let nose = new Cube();
    nose.color = [0.1,0.1,0.1,1]; // light black
    nose.matrix.setTranslate(-0.2,-0.2,0); // move base
    nose.matrix = new Matrix4(headCoordinatesMat);
    nose.matrix.translate(0.1,0.085,-0.141);
    nose.matrix.scale(0.4,0.4,0.4); // scalar
    nose.matrix.scale(0.1,0.1,0.1);
    wolfBlocks.push(nose);
    
    // Right eye
    let rightEye = new Cube();
    rightEye.color = [1,1,1,1]; // white
    rightEye.matrix.setTranslate(-0.2,-0.2,0); // move base
    rightEye.matrix = new Matrix4(headCoordinatesMat);
    rightEye.matrix.translate(0.001,0.121,-0.01);
    rightEye.matrix.scale(0.4,0.4,0.4); // scalar
    rightEye.matrix.scale(0.2,0.1,0.1);
    wolfBlocks.push(rightEye);
  
    // Right lid
    let rightLid = new Cube();
    rightLid.color = [0.95,0.95,0.95,1]; // light gray 0.95
    rightLid.matrix.setTranslate(-0.2,-0.2,0); // move base
    rightLid.matrix = new Matrix4(headCoordinatesMat);
    rightLid.matrix.translate(0.001,0.17,-0.01);
    rightLid.matrix.translate(0,0,0);
    rightLid.matrix.rotate(180,1,0,0);
    rightLid.matrix.translate(0,0,0);
    rightLid.matrix.scale(0.4,0.4,0.4); // scalar
    rightLid.matrix.scale(0.21,g_eyelidSize,0.01);
    wolfBlocks.push(rightLid);
    
    // Right pupil
    let rightPupil = new Cube();
    rightPupil.color = [0.05,0.05,0.05,1]; // black
    rightPupil.matrix.setTranslate(-0.2,-0.2,0); // move base
    rightPupil.matrix = new Matrix4(headCoordinatesMat);
    rightPupil.matrix.translate(0.04,0.12,-0.011);
    rightPupil.matrix.scale(0.4,0.4,0.4); // scalar
    rightPupil.matrix.scale(0.11,0.11,0.11);
    wolfBlocks.push(rightPupil);
    
    // Left eye
    let leftEye = new Cube();
    leftEye.color = [1,1,1,1]; // white
    leftEye.matrix.setTranslate(-0.2,-0.2,0); // move base
    leftEye.matrix = new Matrix4(headCoordinatesMat);
    leftEye.matrix.translate(0.159,0.121,-0.01);
    leftEye.matrix.scale(0.4,0.4,0.4); // scalar
    leftEye.matrix.scale(0.2,0.1,0.1);
    wolfBlocks.push(leftEye);
    
    // Left lid
    let leftLid = new Cube();
    leftLid.color = [0.95,0.95,0.95,1]; // light gray 0.95
    leftLid.matrix.setTranslate(-0.2,-0.2,0); // move base
    leftLid.matrix = new Matrix4(headCoordinatesMat);
    leftLid.matrix.translate(0.158,0.17,-0.01);
    leftLid.matrix.translate(0,0,0);
    leftLid.matrix.rotate(180,1,0,0);
    leftLid.matrix.translate(0,0,0);
    leftLid.matrix.scale(0.4,0.4,0.4); // scalar
    leftLid.matrix.scale(0.21,g_eyelidSize,0.01);
    wolfBlocks.push(leftLid);
    // Left pupil
    let leftPupil = new Cube();
    leftPupil.color = [0.05,0.05,0.05,1]; // black
    leftPupil.matrix.setTranslate(-0.2,-0.2,0); // move base
    leftPupil.matrix = new Matrix4(headCoordinatesMat);
    leftPupil.matrix.translate(0.158,0.12,-0.011);
    leftPupil.matrix.scale(0.4,0.4,0.4); // scalar
    leftPupil.matrix.scale(0.11,0.11,0.11);
    wolfBlocks.push(leftPupil);
  
    // Right ear
    let rightEar = new Cube();
    rightEar.color = [0.85,0.85,0.85,1] // light gray 0.85
    rightEar.matrix.setTranslate(-0.2,-0.2,0); // move base
    rightEar.matrix = new Matrix4(headCoordinatesMat);
    rightEar.matrix.translate(0.01,0.23,0.06);
    rightEar.matrix.scale(0.4,0.4,0.4); // scalar
    rightEar.matrix.scale(0.2,0.3,0.1);
    wolfBlocks.push(rightEar);
  
    // Left ear
    let leftEar = new Cube();
    leftEar.color = [0.85,0.85,0.85,1] // light gray 0.85
    leftEar.matrix.setTranslate(-0.2,-0.2,0); // move base
    leftEar.matrix = new Matrix4(headCoordinatesMat);
    leftEar.matrix.translate(0.158,0.23,0.06);
    leftEar.matrix.scale(0.4,0.4,0.4); // scalar
    leftEar.matrix.scale(0.2,0.3,0.1);
    wolfBlocks.push(leftEar);
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
    }
    
    // Scale down and render wolf (ENABLE THIS INSTEAD MAYBE LATER)
    for (block of wolfBlocks) {
      block.render();
    }
  }

  // ----------------------------------
  // TEST CUBES (from video)
  // ----------------------------------
  if (isTestPerformance) {
    let n = 300;
    for (let i = 1; i < n; i++) {
      let c = new Cube();
      c.matrix.translate(-0.8,1.9*i/n-1.0,0);
      c.matrix.rotate(g_seconds*100,1,1,1);
      c.matrix.scale(0.1, 0.5/n,1/n);
      c.render();
    }
  }

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
