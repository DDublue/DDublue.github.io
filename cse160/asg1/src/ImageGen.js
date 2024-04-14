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
      var t1 = (new Triangle(points=[-0.76,-0.14,  -0.80,-0.27,  -0.79,-0.30], RED));
      var t2 = (new Triangle(points=[-0.81,-0.35,  -0.80,-0.27,  -0.78,-0.33], GREEN));
      var t3 = (new Triangle(points=[-0.81,-0.35,  -0.75,-0.38,  -0.78,-0.33], BLUE));
      var t4 = (new Triangle(points=[-0.81,-0.35,  -0.75,-0.38,  -0.81,-0.40], RED));
      var t5 = (new Triangle(points=[-0.81,-0.40,  -0.75,-0.38,  -0.77,-0.42], GREEN));
      var t6 = (new Triangle(points=[-0.81,-0.40,  -0.81,-0.43,  -0.77,-0.42], BLUE));
      var t7 = (new Triangle(points=[-0.79,-0.45,  -0.81,-0.43,  -0.77,-0.42], RED));
      
      for (var i=1; i<7+1; i++) {
        var x = eval(`t${i}`);
        g_shapesList.push(x);
      }
    }
  
    function bufferBody() {
      // Big triangles
      var t1  = (new Triangle([ 0.00,-0.18,  -0.76,-0.14,  -0.43, 0.00], RED));
      var t2  = (new Triangle([ 0.00,-0.18,  -0.76,-0.14,  -0.79,-0.30], GREEN));
      var t3  = (new Triangle([ 0.00,-0.18,  -0.79,-0.30,  -0.53,-0.44], BLUE));
      var t4  = (new Triangle([ 0.00,-0.18,  -0.19,-0.44,  -0.53,-0.44], RED));
      var t5  = (new Triangle([ 0.00,-0.18,  -0.19,-0.44,   0.04,-0.44], GREEN));
      var t6  = (new Triangle([ 0.00,-0.18,   0.27,-0.38,   0.04,-0.44], BLUE));
      var t7  = (new Triangle([ 0.00,-0.18,   0.27,-0.38,   0.36,-0.21], RED));
      var t8  = (new Triangle([ 0.00,-0.18,   0.36,-0.04,   0.36,-0.21], GREEN));
      var t9  = (new Triangle([ 0.00,-0.18,   0.42,-0.02,   0.23, 0.07], BLUE));
      var t10 = (new Triangle([ 0.00,-0.18,   0.07, 0.15,   0.23, 0.07], RED));
      var t11 = (new Triangle([ 0.00,-0.18,   0.07, 0.15,   -0.09,0.09], GREEN));
      var t12 = (new Triangle([ 0.00,-0.18,  -0.43, 0.00,   -0.09,0.09], BLUE));
      
      // Small detailed triangles
      var t13 = (new Triangle([-0.62,-0.04,  -0.76,-0.14,  -0.43, 0.00], BLUE));
      var t14 = (new Triangle([-0.73,-0.42,  -0.79,-0.30,  -0.53,-0.44], GREEN));
      var t15 = (new Triangle([ 0.36,-0.13,   0.36,-0.04,   0.42,-0.02], RED));
  
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
      var t33 = (new Triangle([-0.64,-0.09,  -0.55,-0.13,  -0.59,-0.08], GRAY1));
      var t34 = (new Triangle([-0.64,-0.09,  -0.55,-0.13,  -0.62,-0.37], WHITE));
      var t35 = (new Triangle([-0.64,-0.09,  -0.69,-0.39,  -0.62,-0.37], GRAY2));
      

      for (var i=1; i<35+1; i++) {
        var x = eval(`t${i}`);
        g_shapesList.push(x);
      }
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
  