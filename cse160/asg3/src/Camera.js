class Camera {
  constructor() {
    this.fov = 60;
    this.eye = new Vector3([0,0,0]);
    this.at = new Vector3([0,0,-1]);
    this.up = new Vector3([0,1,0]);
  }

  forward() {
    let f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    f.normalize();
    f.mul(1);
    this.eye.add(f);
    this.at.add(f);
  }

  back() {
    let f = new Vector3();
    f.set(this.eye);
    f.sub(this.at);
    f.normalize();
    f.mul(1);
    this.eye.add(f);
    this.at.add(f);
  }

  left() {
    let f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    let s = Vector3.cross(this.up, f);
    s.normalize();
    s.mul(1);
    this.eye.add(s);
    this.at.add(s);
  }
  
  right() {
    let f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    let s = Vector3.cross(f, this.up);
    s.normalize();
    s.mul(1);
    this.eye.add(s);
    this.at.add(s);
  }

  panLeft() {
    let f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    let rotMat = new Matrix4();
    rotMat.setRotate(10, this.up.elements[0],
                        this.up.elements[1],
                        this.up.elements[2]);
    f = rotMat.multiplyVector3(f);
    let additive = new Vector3();
    additive.set(this.eye);
    additive.add(f);
    this.at.set(additive);
  }

  panRight() {
    let f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    let rotMat = new Matrix4();
    rotMat.setRotate(-1*10, this.up.elements[0],
                        this.up.elements[1],
                        this.up.elements[2]);
    f = rotMat.multiplyVector3(f);
    let additive = new Vector3();
    additive.set(this.eye);
    additive.add(f);
    this.at.set(additive);
  }

}
