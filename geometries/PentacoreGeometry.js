const PentacoreVertices = [
    new THREE.Vector4(-1/2,  -1/4*Math.sqrt(2/3), -Math.sqrt(3)/6, 0),
    new THREE.Vector4(1/2, -1/4*Math.sqrt(2/3), -Math.sqrt(3)/6, 0),
    new THREE.Vector4(0, -1/4*Math.sqrt(2/3), Math.sqrt(3)/3, 0),
    new THREE.Vector4(0, 3/4*Math.sqrt(2/3), 0, 0),
    new THREE.Vector4(0, 0, 0, Math.sqrt(5/2)/2)
];

const PentacoreFaces = [
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

// Constructs a pentacore : it's the equivalent of a thetrahedron in 3D : it's the 4-simplex 
function PentacoreGeometry(scale = 1, width=null, height=null, depth=null, duth=null)
{
  Geometry4D.call(this);
  
  var mat = new Matrix5();
  if(width === null)
    mat.scale(scale, scale, scale, scale);
  else 
    mat.scale(width, height, depth, duth);
  
  for(var i = 0; i < PentacoreVertices.length; i++)
    this.vertices4D.push(PentacoreVertices[i].clone().applyMatrix5(mat));
  for(var i = 0; i < PentacoreFaces.length; i++)
    this.faces.push(PentacoreFaces[i].clone());;
}

PentacoreGeometry.prototype = new Geometry4D();
PentacoreGeometry.prototype.constructor = PentacoreGeometry;