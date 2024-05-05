class Cube {
    
  // Constructor
  constructor(position=[0.0,0.0,0.0],
              color=[1.0,1.0,1.0,1.0],
              size=5.0) {
      this.type = 'cube';
      this.color = color;
      this.matrix = new Matrix4();
  }

  // Render shape
  render() {
      var rgba = this.color;
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0]*0.95, rgba[1]*0.95, rgba[2]*0.95, rgba[3]);

      // Pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // Front of cube
      drawTriangle3DUV( [0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0] , [0,0,  1,1,  1,0] );
      drawTriangle3DUV( [0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0] , [0,0,  0,1,  1,1] );
      
      // Pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
      
      // Top of cube
      drawTriangle3DUV( [0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0] , [0,0,  0,1,  1,1] );
      drawTriangle3DUV( [0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0] , [0,0,  1,1,  1,0] );
      
      // Pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);
      
      // Right of cube
      drawTriangle3DUV( [1.0,0.0,0.0,  1.0,1.0,0.0,  1.0,1.0,1.0] , [0,0,  0,1,  1,1] );
      drawTriangle3DUV( [1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0] , [0,0,  1,1,  1,0] );
      
      // Pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*1.05, rgba[1]*1.05, rgba[2]*1.05, rgba[3]);
      
      // Left of cube
      drawTriangle3DUV( [0.0,0.0,1.0,  0.0,1.0,1.0,  0.0,1.0,0.0] , [0,0,  0,1,  1,1] );
      drawTriangle3DUV( [0.0,0.0,1.0,  0.0,0.0,0.0,  0.0,1.0,0.0] , [0,0,  1,0,  1,1] );
      
      // Pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]);
      
      // Back of cube
      drawTriangle3DUV( [0.0,1.0,1.0,  1.0,1.0,1.0,  1.0,0.0,1.0] , [1,1,  0,1,  0,0] );
      drawTriangle3DUV( [0.0,1.0,1.0,  0.0,0.0,1.0,  1.0,0.0,1.0] , [1,1,  1,0,  0,0] );
      
      // Pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
      
      // Bottom of cube
      drawTriangle3DUV( [0.0,0.0,1.0,  0.0,0.0,0.0,  1.0,0.0,0.0] , [0,0,  0,1,  1,1] );
      drawTriangle3DUV( [0.0,0.0,1.0,  1.0,0.0,1.0,  1.0,0.0,0.0] , [0,0,  1,0,  1,1] );
  }
}


