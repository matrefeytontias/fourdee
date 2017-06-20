const D4hedronVertices = [
    new THREE.Vector4(-1/2,  -1/4*Math.sqrt(2/3), -Math.sqrt(3)/6, 0),
    new THREE.Vector4(1/2, -1/4*Math.sqrt(2/3), -Math.sqrt(3)/6, 0),
    new THREE.Vector4(0, -1/4*Math.sqrt(2/3), Math.sqrt(3)/3, 0),
    new THREE.Vector4(0, 3/4*Math.sqrt(2/3), 0, 0),
    new THREE.Vector4(0, 0, 0, Math.sqrt(5/2)/2)
];

const D4hedronFaces = [
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(0, 1, 3),
    new THREE.Face3(0, 2, 3),
    new THREE.Face3(1, 2, 3),
    new THREE.Face3(0, 1, 4),
    new THREE.Face3(0, 2, 4),
    new THREE.Face3(0, 3, 4),
    new THREE.Face3(1, 2, 4),
    new THREE.Face3(1, 3, 4),
    new THREE.Face3(2, 3, 4) 
];

// Constructs a decahedron in 4D : it's the equivalent of a thetrahedron in 3D : it is the simplest solid with a non null 4-volume in 4D
function D4hedronGeometry(scale = 1, width=null, height=null, depth=null, duth=null)
{
  Geometry4D.call(this);
  
  var mat = new Matrix5();
  if(width === null)
    mat.scale(scale, scale, scale, scale);
  else 
    mat.scale(width, height, depth, duth);
  
  for(var i = 0; i < D4hedronVertices.length; i++)
    this.vertices4D.push(D4hedronVertices[i].clone().applyMatrix5(mat));
  for(var i = 0; i < D4hedronFaces.length; i++)
    this.faces.push(D4hedronFaces[i].clone());;
}

D4hedronGeometry.prototype = new Geometry4D();
D4hedronGeometry.prototype.constructor = D4hedronGeometry;