class Sphere {
    
  // Constructor
  constructor(position=[0.0,0.0,0.0],
              color=[1.0,1.0,1.0,1.0],
              size=5.0) {
      this.type = 'sphere';
      this.color = color;
      this.matrix = new Matrix4();
      this.normalMatrix = new Matrix4();
      this.textureNum = -2;
      this.vertexBuffer = null;
      this.uvBuffer = null;
  }

  // Render shape
  render() {
      var rgba = this.color;

      // Pass the texture number
      gl.uniform1i(u_whichTexture, this.textureNum);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

      let d  = Math.PI / 10;
      let dd = Math.PI / 10;

      for (let t = 0; t < Math.PI; t += d) {
        for (let r = 0; r < (2*Math.PI); r += d) {
          let p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];

          let p2 = [sin(t+dd)*cos(r), sin(t+dd)*sin(r), cos(t+dd)];
          let p3 = [sin(t)*cos(r+dd), sin(t)*sin(r+dd), cos(t)];
          let p4 = [sin(t+dd)*cos(r+dd), sin(t+dd)*sin(r+dd), cos(t+dd)];

          let uv1 = [t/Math.PI, r/(2*Math.PI)];
          let uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
          let uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
          let uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];

          let v  = [];
          let uv = [];
          v = v.concat(p1); uv=uv.concat(uv1);
          v = v.concat(p2); uv=uv.concat(uv2);
          v = v.concat(p4); uv=uv.concat(uv4);
          gl.uniform4f(u_FragColor, 1,1,1,1);
          drawTriangle3DUVNormal(v, uv, v);

          v = []; uv = [];
          v = v.concat(p1); uv=uv.concat(uv1);
          v = v.concat(p4); uv=uv.concat(uv4);
          v = v.concat(p3); uv=uv.concat(uv3);
          gl.uniform4f(u_FragColor, 1,0,0,1);
          drawTriangle3DUVNormal(v, uv, v);
        }
      }

  }

  // Render shape
  renderfast() {
      var rgba = this.color;

      // Pass the texture number
      gl.uniform1i(u_whichTexture, this.textureNum);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0]*0.95, rgba[1]*0.95, rgba[2]*0.95, rgba[3]);

      // Pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      let allVertices = [];
      let allUVs = [];
      // Front of cube
      // drawTriangle3DUV( [0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0] , [0,0,  1,1,  1,0] );
      // drawTriangle3DUV( [0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0] , [0,0,  0,1,  1,1] );
      allVertices = allVertices.concat([0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0]);
      allVertices = allVertices.concat([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0]);
      allUVs = allUVs.concat([0,0,  1,1,  1,0]);
      allUVs = allUVs.concat([0,0,  0,1,  1,1]);
      
      // Pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
      
      // Top of cube
      // drawTriangle3DUV( [0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0] , [0,0,  0,1,  1,1] );
      // drawTriangle3DUV( [0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0] , [0,0,  1,1,  1,0] );
      allVertices = allVertices.concat([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);
      allVertices = allVertices.concat([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0]);
      allUVs = allUVs.concat([0,0,  0,1,  1,1]);
      allUVs = allUVs.concat([0,0,  1,1,  1,0]);
      
      // Pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);
      
      // Right of cube
      // drawTriangle3DUV( [1.0,0.0,0.0,  1.0,1.0,0.0,  1.0,1.0,1.0] , [0,0,  0,1,  1,1] );
      // drawTriangle3DUV( [1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0] , [0,0,  1,1,  1,0] );
      allVertices = allVertices.concat([1.0,0.0,0.0,  1.0,1.0,0.0,  1.0,1.0,1.0]);
      allVertices = allVertices.concat([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
      allUVs = allUVs.concat([0,0,  0,1,  1,1]);
      allUVs = allUVs.concat([0,0,  1,1,  1,0]);
      
      // Pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*1.05, rgba[1]*1.05, rgba[2]*1.05, rgba[3]);
      
      // Left of cube
      // drawTriangle3DUV( [0.0,0.0,1.0,  0.0,1.0,1.0,  0.0,1.0,0.0] , [0,0,  0,1,  1,1] );
      // drawTriangle3DUV( [0.0,0.0,1.0,  0.0,0.0,0.0,  0.0,1.0,0.0] , [0,0,  1,0,  1,1] );
      allVertices = allVertices.concat([0.0,0.0,1.0,  0.0,1.0,1.0,  0.0,1.0,0.0]);
      allVertices = allVertices.concat([0.0,0.0,1.0,  0.0,0.0,0.0,  0.0,1.0,0.0]);
      allUVs = allUVs.concat([0,0,  0,1,  1,1]);
      allUVs = allUVs.concat([0,0,  1,0,  1,1]);
      
      // Pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]);
      
      // Back of cube
      // drawTriangle3DUV( [0.0,1.0,1.0,  1.0,1.0,1.0,  1.0,0.0,1.0] , [1,1,  0,1,  0,0] );
      // drawTriangle3DUV( [0.0,1.0,1.0,  0.0,0.0,1.0,  1.0,0.0,1.0] , [1,1,  1,0,  0,0] );
      allVertices = allVertices.concat([0.0,1.0,1.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
      allVertices = allVertices.concat([0.0,1.0,1.0,  0.0,0.0,1.0,  1.0,0.0,1.0]);
      allUVs = allUVs.concat([1,1,  0,1,  0,0]);
      allUVs = allUVs.concat([1,1,  1,0,  0,0]);
      
      // Pass the color of a point to u_FragColor uniform variable
      gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
      
      // Bottom of cube
      // drawTriangle3DUV( [0.0,0.0,1.0,  0.0,0.0,0.0,  1.0,0.0,0.0] , [0,0,  0,1,  1,1] );
      // drawTriangle3DUV( [0.0,0.0,1.0,  1.0,0.0,1.0,  1.0,0.0,0.0] , [0,0,  1,0,  1,1] );
      allVertices = allVertices.concat([0.0,0.0,1.0,  0.0,0.0,0.0,  1.0,0.0,0.0]);
      allVertices = allVertices.concat([0.0,0.0,1.0,  1.0,0.0,1.0,  1.0,0.0,0.0]);
      allUVs = allUVs.concat([0,0,  0,1,  1,1]);
      allUVs = allUVs.concat([0,0,  1,0,  1,1]);

      
      drawTriangle3DUV(allVertices, allUVs);
    }
    
  }
  
  function sin(x) {
    return Math.sin(x);
  };

  function cos(x) {
    return Math.cos(x);
  };
