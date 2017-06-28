//Vertices of a 0,0,0,0-centred regular pentachore
const PentachoreVertices = [
    new THREE.Vector4(-1/2,  -1/4*Math.sqrt(2/3), -Math.sqrt(3)/6, -1/4*Math.sqrt(2/5)),
    new THREE.Vector4(1/2, -1/4*Math.sqrt(2/3), -Math.sqrt(3)/6, -1/4*Math.sqrt(2/5)),
    new THREE.Vector4(0, -1/4*Math.sqrt(2/3), Math.sqrt(3)/3, -1/4*Math.sqrt(2/5)),
    new THREE.Vector4(0, 3/4*Math.sqrt(2/3), 0, -1/4*Math.sqrt(2/5)),
    new THREE.Vector4(0, 0, 0, Math.sqrt(5/2)/2 -1/4*Math.sqrt(2/5))
];

const PentachoreFaces = [
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

// Constructs a pentachore : it's the equivalent of a thetrahedron in 3D : it's the 4-simplex 
function PentachoreGeometry4D(scale = 1, width=null, height=null, depth=null, duth=null)
{
  Geometry4D.call(this);
  
  var mat = new Matrix5();
  if(width === null)
    mat.scale(scale, scale, scale, scale);
  else 
    mat.scale(width, height, depth, duth);
  
  for(var i = 0; i < PentachoreVertices.length; i++)
    this.vertices4D.push(PentachoreVertices[i].clone().applyMatrix5(mat));
  for(var i = 0; i < PentachoreFaces.length; i++)
    this.faces.push(PentachoreFaces[i].clone());;
    
  this.faceGroups = [
    [0, 1, 2, 3],
    [4, 5, 6, 7, 8, 9]
  ]
  
  this.edges = [
    0, 1, 0, 2, 0, 3, 0, 4, 1, 2, 1, 3, 1, 4, 2, 3, 2, 4, 3, 4
  ]
}

PentachoreGeometry4D.prototype = new Geometry4D();
PentachoreGeometry4D.prototype.constructor = PentachoreGeometry4D;