const prism4DVertices = 
[
    //Prism 1 centered in 0,0,0,-1/2
    new THREE.Vector4(-1/2,  -1/4*Math.sqrt(2/3), -Math.sqrt(3)/6, -1/2),
    new THREE.Vector4(1/2, -1/4*Math.sqrt(2/3), -Math.sqrt(3)/6, -1/2),
    new THREE.Vector4(0, -1/4*Math.sqrt(2/3), Math.sqrt(3)/3, -1/2),
    new THREE.Vector4(0, 3/4*Math.sqrt(2/3), 0, -1/2),
    
    //Prism 2 centered in 0,0,0,1/2
    new THREE.Vector4(-1/2,  -1/4*Math.sqrt(2/3), -Math.sqrt(3)/6, 1/2),
    new THREE.Vector4(1/2, -1/4*Math.sqrt(2/3), -Math.sqrt(3)/6, 1/2),
    new THREE.Vector4(0, -1/4*Math.sqrt(2/3), Math.sqrt(3)/3, 1/2),
    new THREE.Vector4(0, 3/4*Math.sqrt(2/3), 0, 1/2),
];

const prism4DFaces = [
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(0, 1, 3),
    new THREE.Face3(0, 2, 3),
    new THREE.Face3(1, 2, 3),
    
    new THREE.Face3(4, 5, 6),
    new THREE.Face3(4, 5, 7),
    new THREE.Face3(4, 6, 7),
    new THREE.Face3(5, 6, 7),
    
    new THREE.Face3(0, 1, 5),
    new THREE.Face3(5, 4, 0),
    
    new THREE.Face3(0, 2, 6),
    new THREE.Face3(6, 4, 0),
    
    new THREE.Face3(0, 3, 7),
    new THREE.Face3(7, 4, 0),
    
    new THREE.Face3(1, 2, 6),
    new THREE.Face3(6, 5, 1),
    
    new THREE.Face3(1, 3, 7),
    new THREE.Face3(7, 5, 1),
    
    new THREE.Face3(2, 3, 7),
    new THREE.Face3(7, 6, 2),
];

const prism4DGroups = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
]


// Constructs a Prism4D : it's the equivalent of a thetrahedron in 3D : it's the 4-simplex 
function Prism4DGeometry4D(scale = 1, width=null, height=null, depth=null, duth=null)
{
  Geometry4D.call(this);
  
  var mat = new Matrix5();
  if(width === null)
    mat.scale(scale, scale, scale, scale);
  else 
    mat.scale(width, height, depth, duth);
  
  for(var i = 0; i < prism4DVertices.length; i++)
    this.vertices4D.push(prism4DVertices[i].clone().applyMatrix5(mat));
  for(var i = 0; i < prism4DFaces.length; i++)
    this.faces.push(prism4DFaces[i].clone());;
    
  this.faceGroups = prism4DGroups;
}

Prism4DGeometry4D.prototype = new Geometry4D();
Prism4DGeometry4D.prototype.constructor = Prism4DGeometry4D;