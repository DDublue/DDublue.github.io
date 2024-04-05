// asgn0.js

// Retrieve <canvas> element
const canvas = document.getElementById('example');

// Get the rendering context for 2DCG
const ctx = canvas.getContext('2d');

function main() {
    // Assert canvas exists
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Draw black canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // New Vector3 object
    const v1 = new Vector3([2.25,2.25,0]);
    drawVector(v1, "red");
}

function drawVector(v=Vector3, color=String) {
    const p = v.elements;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(200+p[0]*20, 200+p[1]*-1*20);
    ctx.stroke();
}

function handleDrawEvent() {
    let v1 = new Vector3();
    let v2 = new Vector3();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get v1 coordinates
    v1.elements[0] = document.getElementById("v1_x").value;
    v1.elements[1] = document.getElementById("v1_y").value;

    // Draw v1 on canvas
    drawVector(v1, "red");

    // Get v2 coordinates
    v2.elements[0] = document.getElementById("v2_x").value;
    v2.elements[1] = document.getElementById("v2_y").value;

    // Draw v2 on canvas
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    let v1 = new Vector3();
    let v2 = new Vector3();
    let v3 = new Vector3();
    let v4 = new Vector3();
    let op = document.getElementById("operations").value;
    let scalar = document.getElementById("scalar").value;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get v1 coordinates
    v1.elements[0] = document.getElementById("v1_x").value;
    v1.elements[1] = document.getElementById("v1_y").value;

    // Draw v1 on canvas
    drawVector(v1, "red");

    // Get v2 coordinates
    v2.elements[0] = document.getElementById("v2_x").value;
    v2.elements[1] = document.getElementById("v2_y").value;

    // Draw v2 on canvas
    drawVector(v2, "blue");

    // Handle operations
    if (op == "add") {
        v3 = v1.add(v2);        
    } else if (op == "sub") {
        v3 = v1.sub(v2);
    } else if (op == "mul") {
        v3 = v1.mul(scalar);
        v4 = v2.mul(scalar);
    } else if (op == "div") {
        v3 = v1.div(scalar);
        v4 = v2.div(scalar);
    } else if (op == "mag") {
        console.log(v1.magnitude());
        console.log(v2.magnitude());
    } else if (op == "nor") {
        v3 = v1.normalize();
        v4 = v2.normalize();
    } else if (op == "dot") {
        console.log(angleBetween(v1, v2));
    } else if (op == "area") {
        console.log(areaTriangle(v1, v2));
    }
    drawVector(v3, "green");
    drawVector(v4, "green");
}

function angleBetween(v1=Vector3, v2=Vector3) {
    let angle = Math.acos(Vector3.dot(v1,v2)/(v1.magnitude()*v2.magnitude()))*180/Math.PI;
    return angle;
}

function areaTriangle(v1, v2) {
    let area = 0.5 * (Vector3.cross(v1,v2)).magnitude();
    return area;
}
