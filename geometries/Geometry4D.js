/******************
 * Geometry4D API *
 ******************/

function Geometry4D()
{
  this.vertices4D = [];
}

const tesseractVertices = [
  new THREE.Vector4(-0.5, -0.5, -0.5, -0.5),
  new THREE.Vector4(0.5, -0.5, -0.5, -0.5),
  new THREE.Vector4(0.5, 0.5, -0.5, -0.5),
  new THREE.Vector4(-0.5, 0.5, -0.5, -0.5),
  new THREE.Vector4(-0.5, -0.5, 0.5, -0.5),
  new THREE.Vector4(0.5, -0.5, 0.5, -0.5),
  new THREE.Vector4(0.5, 0.5, 0.5, -0.5),
  new THREE.Vector4(-0.5, 0.5, 0.5, -0.5),
  new THREE.Vector4(-0.5, -0.5, -0.5, 0.5),
  new THREE.Vector4(0.5, -0.5, -0.5, 0.5),
  new THREE.Vector4(0.5, 0.5, -0.5, 0.5),
  new THREE.Vector4(-0.5, 0.5, -0.5, 0.5),
  new THREE.Vector4(-0.5, -0.5, 0.5, 0.5),
  new THREE.Vector4(0.5, -0.5, 0.5, 0.5),
  new THREE.Vector4(0.5, 0.5, 0.5, 0.5),
  new THREE.Vector4(-0.5, 0.5, 0.5, 0.5),
];
const tesseractEdges = [
  0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7, // 1st cube : 12 edges
  8, 9, 9, 10, 10, 11, 11, 8, 12, 13, 13, 14, 14, 15, 15, 12, 8, 12, 9, 13, 10, 14, 11, 15, // 2nd cube : 12 edges
  0, 8, 1, 9, 2, 10, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15 // link both : 8 edges
];

function BoxGeometry4D(width, height, depth, duth)
{
  Geometry4D.call(this);
  var mat = new Matrix5();
  mat.scale(width, height, depth, duth);
  for(var i = 0; i < tesseractEdges.length; i++)
    this.vertices4D.push(tesseractVertices[tesseractEdges[i]].clone().applyMatrix5(mat));
}

BoxGeometry4D.prototype = new Geometry4D();
BoxGeometry4D.prototype.constructor = BoxGeometry4D;
