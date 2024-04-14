class Triangle {
    
    // Constructor
    constructor(points=null,
                color=[1.0,1.0,1.0,1.0],
                position=[0.0,0.0,0.0],
                size=5.0) {
        this.type = 'triangle';
        this.position = position;
        this.color = color;
        this.size = size;
        this.points = points;
    }

    // Render shape
    render() {
        var xy   = this.position;
        var rgba = this.color;
        var size = this.size;
        var pts  = this.points;

        // Pass the color of a triangle to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        if (!pts) { // Brush
          // Pass the size of a triangle to u_Size variable
          gl.uniform1f(u_Size, size);
          // Draw
          var d = size/200.0; // delta
          drawTriangle([xy[0], xy[1],
                        xy[0]+d, xy[1],
                        xy[0], xy[1]+d]);
        } else { // Custom triangle
          drawTriangle(pts);
        }
    }
}


function drawTriangle(vertices) {
  var n = 3; // The number of vertices
  
  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
