// ImageGenDog.js
// Functions to generate a dog picture on the <canvas>

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
      var t1 = (new Triangle(points=[-0.76,-0.14,  -0.80,-0.27,  -0.79,-0.30], MID));
      var t2 = (new Triangle(points=[-0.81,-0.35,  -0.80,-0.27,  -0.78,-0.33], LIGHT));
      var t3 = (new Triangle(points=[-0.81,-0.35,  -0.75,-0.38,  -0.78,-0.33], DARK1));
      var t4 = (new Triangle(points=[-0.81,-0.35,  -0.75,-0.38,  -0.81,-0.40], MID));
      var t5 = (new Triangle(points=[-0.81,-0.40,  -0.75,-0.38,  -0.77,-0.42], LIGHT));
      var t6 = (new Triangle(points=[-0.81,-0.40,  -0.81,-0.43,  -0.77,-0.42], DARK1));
      var t7 = (new Triangle(points=[-0.79,-0.45,  -0.81,-0.43,  -0.77,-0.42], MID));
      
      for (var i=1; i<7+1; i++) {
        var x = eval(`t${i}`);
        g_shapesList.push(x);
      }
    }
  
    function bufferBody() {
      // Big triangles
      var t1  = (new Triangle([ 0.00,-0.18,  -0.76,-0.14,  -0.43, 0.00], MID));
      var t2  = (new Triangle([ 0.00,-0.18,  -0.76,-0.14,  -0.79,-0.30], LIGHT));
      var t3  = (new Triangle([ 0.00,-0.18,  -0.79,-0.30,  -0.53,-0.44], DARK1));
      var t4  = (new Triangle([ 0.00,-0.18,  -0.19,-0.44,  -0.53,-0.44], MID));
      var t5  = (new Triangle([ 0.00,-0.18,  -0.19,-0.44,   0.04,-0.44], LIGHT));
      var t6  = (new Triangle([ 0.00,-0.18,   0.27,-0.38,   0.04,-0.44], DARK1));
      var t7  = (new Triangle([ 0.00,-0.18,   0.27,-0.38,   0.36,-0.21], MID));
      var t8  = (new Triangle([ 0.00,-0.18,   0.36,-0.04,   0.36,-0.21], LIGHT));
      var t9  = (new Triangle([ 0.00,-0.18,   0.42,-0.02,   0.23, 0.07], DARK1));
      var t10 = (new Triangle([ 0.00,-0.18,   0.07, 0.15,   0.23, 0.07], MID));
      var t11 = (new Triangle([ 0.00,-0.18,   0.07, 0.15,   -0.09,0.09], LIGHT));
      var t12 = (new Triangle([ 0.00,-0.18,  -0.43, 0.00,   -0.09,0.09], DARK1));
      
      // Small detailed triangles
      var t13 = (new Triangle([-0.62,-0.04,  -0.76,-0.14,  -0.43, 0.00], DARK1));
      var t14 = (new Triangle([-0.73,-0.42,  -0.79,-0.30,  -0.53,-0.44], LIGHT));
      var t15 = (new Triangle([ 0.36,-0.13,   0.36,-0.04,   0.42,-0.02], MID));
  
      for (var i=1; i<15+1; i++) {
        var x = eval(`t${i}`);
        g_shapesList.push(x);
      }
    }
  
    function bufferBackLeg() {
      // Lower leg
      var t1  = (new Triangle([-0.07,-0.50,  -0.12,-0.48,  -0.09,-0.46], WHITE));
      var t2  = (new Triangle([-0.07,-0.50,  -0.12,-0.48,  -0.16,-0.52], GRAY1));
      var t3  = (new Triangle([-0.18,-0.50,  -0.09,-0.46,  -0.16,-0.52], GRAY2));
      var t4  = (new Triangle([-0.18,-0.50,  -0.09,-0.46,  -0.14,-0.44], GRAY3));
      var t5  = (new Triangle([-0.18,-0.50,  -0.24,-0.44,  -0.14,-0.44], GRAY1));
      var t6  = (new Triangle([-0.16,-0.52,  -0.25,-0.52,  -0.20,-0.48], WHITE));
      var t7  = (new Triangle([-0.29,-0.48,  -0.25,-0.52,  -0.20,-0.48], GRAY3));
      var t8  = (new Triangle([-0.29,-0.48,  -0.24,-0.44,  -0.20,-0.48], GRAY2));
      var t9  = (new Triangle([-0.29,-0.48,  -0.24,-0.44,  -0.35,-0.44], WHITE));
      var t10 = (new Triangle([-0.29,-0.48,  -0.38,-0.48,  -0.35,-0.44], GRAY1));
      var t11 = (new Triangle([-0.29,-0.48,  -0.38,-0.48,  -0.25,-0.52], GRAY2));
      var t12 = (new Triangle([-0.41,-0.52,  -0.38,-0.48,  -0.25,-0.52], GRAY3));
      var t13 = (new Triangle([-0.41,-0.52,  -0.35,-0.44,  -0.46,-0.49], WHITE));
      var t14 = (new Triangle([-0.45,-0.41,  -0.35,-0.44,  -0.46,-0.49], GRAY2));
      var t15 = (new Triangle([-0.41,-0.52,  -0.54,-0.50,  -0.46,-0.49], GRAY1));
      var t16 = (new Triangle([-0.52,-0.42,  -0.54,-0.50,  -0.46,-0.49], GRAY3));
      var t17 = (new Triangle([-0.52,-0.42,  -0.43,-0.31,  -0.46,-0.49], WHITE));
      var t18 = (new Triangle([-0.52,-0.42,  -0.43,-0.31,  -0.50,-0.36], GRAY1));
      

      // Thigh
      var t19 = (new Triangle([-0.45,-0.41,  -0.43,-0.31,  -0.40,-0.428], GRAY1));
      var t20 = (new Triangle([-0.30,-0.38,  -0.43,-0.31,  -0.40,-0.428], GRAY2));
      var t21 = (new Triangle([-0.30,-0.38,  -0.32,-0.41,  -0.40,-0.428], GRAY3));
      var t22 = (new Triangle([-0.30,-0.38,  -0.32,-0.41,  -0.27,-0.37], GRAY1));
      var t23 = (new Triangle([-0.30,-0.38,  -0.23,-0.27,  -0.27,-0.37], GRAY2));
      var t24 = (new Triangle([-0.30,-0.38,  -0.23,-0.27,  -0.43,-0.31], WHITE));
      var t25 = (new Triangle([-0.27,-0.12,  -0.23,-0.27,  -0.43,-0.31], GRAY1));
      var t26 = (new Triangle([-0.27,-0.12,  -0.23,-0.27,  -0.23,-0.19], GRAY2));
      var t27 = (new Triangle([-0.27,-0.12,  -0.59,-0.08,  -0.43,-0.31], WHITE));
      var t28 = (new Triangle([-0.27,-0.12,  -0.59,-0.08,  -0.42,-0.07], GRAY2));
      var t29 = (new Triangle([-0.62,-0.37,  -0.55,-0.13,  -0.43,-0.31], GRAY1));
      var t30 = (new Triangle([-0.62,-0.37,  -0.58,-0.42,  -0.43,-0.31], GRAY2));
      var t31 = (new Triangle([-0.50,-0.36,  -0.58,-0.42,  -0.52,-0.41], GRAY3));
      var t32 = (new Triangle([-0.62,-0.37,  -0.58,-0.42,  -0.69,-0.39], GRAY3));
      var t33 = (new Triangle([-0.64,-0.09,  -0.55,-0.13,  -0.59,-0.08], GRAY2));
      var t34 = (new Triangle([-0.64,-0.09,  -0.55,-0.13,  -0.62,-0.37], WHITE));
      var t35 = (new Triangle([-0.64,-0.09,  -0.69,-0.39,  -0.62,-0.37], GRAY2));
      

      for (var i=1; i<35+1; i++) {
        var x = eval(`t${i}`);
        g_shapesList.push(x);
      }
    }
  
    function bufferFrontLeg() {
      var t1  = (new Triangle([ 0.36,-0.21,  0.30,-0.32,  0.37,-0.35], WHITE));
      var t2  = (new Triangle([ 0.27,-0.38,  0.30,-0.32,  0.37,-0.35], GRAY1));
      var t3  = (new Triangle([ 0.27,-0.38,  0.32,-0.46,  0.37,-0.35], GRAY2));
      var t4  = (new Triangle([ 0.27,-0.38,  0.32,-0.46,  0.23,-0.46], GRAY1));
      var t5  = (new Triangle([ 0.27,-0.38,  0.21,-0.36,  0.23,-0.46], GRAY3));
      var t6  = (new Triangle([ 0.34,-0.40,  0.39,-0.40,  0.37,-0.35], WHITE));
      var t7  = (new Triangle([ 0.34,-0.40,  0.39,-0.40,  0.32,-0.46], GRAY3));
      var t8  = (new Triangle([ 0.44,-0.35,  0.39,-0.40,  0.37,-0.35], GRAY2));
      var t9  = (new Triangle([ 0.44,-0.35,  0.39,-0.40,  0.495,-0.40], GRAY1));
      var t10 = (new Triangle([ 0.44,-0.35,  0.52,-0.35,  0.495,-0.40], GRAY3));
      var t11 = (new Triangle([ 0.32,-0.46,  0.39,-0.40,  0.495,-0.40], GRAY2));
      var t12 = (new Triangle([ 0.32,-0.46,  0.46,-0.46,  0.495,-0.40], WHITE));
      var t13 = (new Triangle([ 0.51,-0.43,  0.46,-0.46,  0.52,-0.35], GRAY1));
      var t14 = (new Triangle([ 0.51,-0.43,  0.60,-0.37,  0.52,-0.35], GRAY3));
      var t15 = (new Triangle([ 0.46,-0.46,  0.60,-0.37,  0.58,-0.46], GRAY2));
      var t16 = (new Triangle([ 0.67,-0.42,  0.60,-0.37,  0.58,-0.46], WHITE));
      var t17 = (new Triangle([ 0.67,-0.42,  0.60,-0.37,  0.68,-0.38], GRAY1));
      var t18 = (new Triangle([ 0.67,-0.42,  0.75,-0.38,  0.68,-0.38], GRAY2));
      var t19 = (new Triangle([ 0.75,-0.38,  0.67,-0.46,  0.58,-0.46], GRAY3));
      var t20 = (new Triangle([ 0.75,-0.38,  0.71,-0.42,  0.79,-0.40], GRAY1));
      var t21 = (new Triangle([ 0.75,-0.46,  0.71,-0.42,  0.79,-0.40], GRAY2));
      var t22 = (new Triangle([ 0.75,-0.46,  0.71,-0.42,  0.67,-0.46], WHITE));
      var t23 = (new Triangle([ 0.75,-0.46,  0.79,-0.46,  0.79,-0.40], GRAY3));
      var t24 = (new Triangle([ 0.84,-0.46,  0.79,-0.46,  0.79,-0.40], WHITE));
      
      for (var i=1; i<24+1; i++) {
        var x = eval(`t${i}`);
        g_shapesList.push(x);
      }
    }
  
    function bufferHead() {
      var t1  = (new Triangle([ 0.07,0.15,  0.23,0.07,  0.50,0.14], LIGHT));
      var t2  = (new Triangle([ 0.23,0.07,  0.35,0.01,  0.50,0.14], MID));
      var t3  = (new Triangle([ 0.42,-0.02, 0.35,0.01,  0.50,0.14], GRAY1));
      var t4  = (new Triangle([ 0.07,0.15,  0.46,0.27,  0.36,0.14], GRAY1));
      var t5  = (new Triangle([ 0.50,0.14,  0.46,0.27,  0.36,0.14], MID));
      var t6  = (new Triangle([ 0.50,0.14,  0.46,0.27,  0.53,0.23], GRAY1));
      var t7  = (new Triangle([ 0.50,0.14,  0.59,0.23,  0.53,0.23], MID));
      var t8  = (new Triangle([ 0.54,0.24,  0.59,0.23,  0.53,0.23], WHITE));
      var t9  = (new Triangle([ 0.54,0.24,  0.53,0.23,  0.49,0.25], LIGHT));
      var t10 = (new Triangle([ 0.54,0.24,  0.52,0.27,  0.49,0.25], WHITE));
      var t11 = (new Triangle([ 0.46,0.27,  0.52,0.27,  0.49,0.25], LIGHT));
      var t12 = (new Triangle([ 0.54,0.24,  0.52,0.27,  0.57,0.27], GRAY2));
      var t13 = (new Triangle([ 0.54,0.24,  0.59,0.23,  0.57,0.27], GRAY3));
      var t14 = (new Triangle([ 0.50,0.14,  0.59,0.23,  0.63,0.20], GRAY1));
      var t15 = (new Triangle([ 0.50,0.14,  0.59,0.23,  0.63,0.20], GRAY1));
      var t16 = (new Triangle([ 0.50,0.14,  0.69,0.13,  0.63,0.20], MID));
      var t17 = (new Triangle([ 0.69,0.19,  0.59,0.23,  0.63,0.20], WHITE));
      var t18 = (new Triangle([ 0.71,0.19,  0.66,0.16,  0.63,0.20], LIGHT));
      var t19 = (new Triangle([ 0.50,0.14,  0.69,0.13,  0.55,0.06], GRAY1));
      var t20 = (new Triangle([ 0.70,0.11,  0.69,0.13,  0.55,0.06], GRAY2));
      var t21 = (new Triangle([ 0.50,0.14,  0.46,0.06,  0.55,0.06], MID));
      var t22 = (new Triangle([ 0.48,0.02,  0.46,0.06,  0.55,0.06], GRAY2));
      var t23 = (new Triangle([ 0.48,0.02,  0.46,0.06, 0.42,-0.02], MID));
      var t24 = (new Triangle([ 0.48,0.02,  0.57,0.03, 0.42,-0.02], DARK2));
      var t25 = (new Triangle([ 0.48,0.02,  0.57,0.03,  0.55,0.06], GRAY3));
      var t26 = (new Triangle([ 0.63,0.09,  0.57,0.03,  0.55,0.06], DARK2));
      var t27 = (new Triangle([ 0.63,0.09,  0.57,0.03,  0.65,0.06], GRAY3));
      var t28 = (new Triangle([ 0.63,0.09,  0.70,0.11,  0.65,0.06], DARK1));
      var t29 = (new Triangle([ 0.71,0.08,  0.70,0.11,  0.65,0.06], DARK2));
      var t30 = (new Triangle([ 0.71,0.08,  0.70,0.11,  0.73,0.14], GRAY2));
      var t31 = (new Triangle([ 0.71,0.13,  0.70,0.11,  0.73,0.14], DARK2));
      var t32 = (new Triangle([ 0.71,0.13,  0.70,0.11,  0.69,0.13], GRAY3));
      var t33 = (new Triangle([ 0.71,0.13,  0.71,0.16,  0.69,0.13], DARK2));
      var t34 = (new Triangle([ 0.71,0.13,  0.71,0.16,  0.73,0.14], GRAY3));
      var t35 = (new Triangle([ 0.69,0.16,  0.71,0.16,  0.69,0.13], DARK1));
      var t36 = (new Triangle([ 0.69,0.16,  0.71,0.16,  0.69,0.18], GRAY3));
      var t37 = (new Triangle([ 0.69,0.13,  0.66,0.16,  0.69,0.18], DARK2));
      var t38 = (new Triangle([ 0.69,0.18,  0.71,0.16,  0.73,0.18], DARK2));
      var t39 = (new Triangle([ 0.69,0.18,  0.71,0.19,  0.73,0.18], GRAY3));
      var t40 = (new Triangle([ 0.73,0.16,  0.71,0.16,  0.73,0.18], DARK1));
      var t41 = (new Triangle([ 0.73,0.16,  0.71,0.16,  0.73,0.14], GRAY2));
      var t42 = (new Triangle([ 0.73,0.18,  0.75,0.16,  0.73,0.14], DARK2));
      var t43 = (new Triangle([ 0.07,0.15,  0.33,0.23,  0.28,0.40], MID));
      var t44 = (new Triangle([ 0.46,0.27,  0.33,0.23,  0.28,0.40], LIGHT));
      var t45 = (new Triangle([ 0.46,0.27,  0.40,0.40,  0.28,0.40], MID));
      var t46 = (new Triangle([ 0.46,0.27,  0.40,0.40,  0.47,0.39], GRAY1));
      var t47 = (new Triangle([ 0.46,0.27,  0.53,0.35,  0.47,0.39], LIGHT));
      var t48 = (new Triangle([ 0.46,0.27,  0.53,0.35,  0.57,0.27], GRAY1));

      for (var i=1; i<48+1; i++) {
        var x = eval(`t${i}`);
        g_shapesList.push(x);
      }
    }
  
    function bufferEar() {
      var t1  = (new Triangle([ 0.28,0.40,  0.26,0.41,  0.26,0.37], DARK2));
      var t2  = (new Triangle([ 0.20,0.38,  0.26,0.41,  0.15,0.31], GRAY3));
      var t3  = (new Triangle([ 0.21,0.29,  0.26,0.41,  0.15,0.31], DARK1));
      var t4  = (new Triangle([ 0.21,0.29,  0.26,0.41,  0.25,0.28], GRAY2));
      var t5  = (new Triangle([ 0.19,0.26,  0.15,0.31,  0.25,0.28], GRAY1));
      var t6  = (new Triangle([ 0.19,0.26,  0.25,0.19,  0.25,0.28], GRAY2));
      var t7  = (new Triangle([ 0.24,0.12,  0.25,0.19,  0.19,0.09], GRAY2));
      var t8  = (new Triangle([ 0.20,0.25,  0.25,0.19,  0.19,0.09], MID));
      var t9  = (new Triangle([ 0.20,0.25,  0.25,0.19,  0.19,0.09], MID));
      var t10 = (new Triangle([ 0.20,0.25,  0.13,0.17,  0.19,0.09], GRAY2));
      var t11 = (new Triangle([ 0.15,0.11,  0.13,0.17,  0.19,0.09], DARK1));
      var t12 = (new Triangle([ 0.20,0.25,  0.13,0.17,  0.15,0.31], DARK1));

      for (var i=1; i<12+1; i++) {
        var x = eval(`t${i}`);
        g_shapesList.push(x);
      }
    }
  
    function bufferEyes() {
      // Left eye
      var t1  = (new Triangle([ 0.39,0.29,  0.45,0.29,  0.42,0.25], WHITE));
      var t2  = (new Triangle([ 0.40,0.27,  0.42,0.29,  0.44,0.27], DARK2));
      
      // Right eye
      var t3  = (new Triangle([ 0.54,0.29,  0.60,0.29,  0.57,0.25], WHITE));
      var t4  = (new Triangle([ 0.55,0.27,  0.57,0.29,  0.59,0.27], DARK2));

      for (var i=1; i<4+1; i++) {
        var x = eval(`t${i}`);
        g_shapesList.push(x);
      }
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
  