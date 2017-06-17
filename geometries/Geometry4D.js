/******************
 * Geometry4D API *
 ******************/

function Geometry4D()
{
  this.vertices4D = [];
  this.faces = [];
}

const tesseractVertices = [
    new THREE.Vector4(-0.5, -0.5, -0.5, -0.5),
    new THREE.Vector4(0.5, -0.5, -0.5, -0.5),
    new THREE.Vector4(0.5, 0.5, -0.5, -0.5),
    new THREE.Vector4(-0.5, 0.5, -0.5, -0.5),
    new THREE.Vector4(-0.5, 0.5, 0.5, -0.5),
    new THREE.Vector4(0.5, 0.5, 0.5, -0.5),
    new THREE.Vector4(0.5, -0.5, 0.5, -0.5),
    new THREE.Vector4(-0.5, -0.5, 0.5, -0.5),
    new THREE.Vector4(-0.5, -0.5, -0.5, 0.5),
    new THREE.Vector4(0.5, -0.5, -0.5, 0.5),
    new THREE.Vector4(0.5, 0.5, -0.5, 0.5),
    new THREE.Vector4(-0.5, 0.5, -0.5, 0.5),
    new THREE.Vector4(-0.5, 0.5, 0.5, 0.5),
    new THREE.Vector4(0.5, 0.5, 0.5, 0.5),
    new THREE.Vector4(0.5, -0.5, 0.5, 0.5),
    new THREE.Vector4(-0.5, -0.5, 0.5, 0.5)
];
const tesseractEdges = [
  0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 7, 1, 6, 2, 5, 3, 4, // 1st cube : 12 edges
  8, 9, 9, 10, 10, 11, 11, 8, 12, 13, 13, 14, 14, 15, 15, 12, 8, 15, 9, 14, 10, 13, 11, 12, // 2nd cube : 12 edges
  0, 8, 1, 9, 2, 10, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15 // link both : 8 edges
];
const tesseractFaces = [
  // First cube
  new THREE.Face3(0, 1, 2),
  new THREE.Face3(3, 0, 2),
  new THREE.Face3(0, 7, 6),
  new THREE.Face3(1, 0, 6),
  new THREE.Face3(0, 7, 4),
  new THREE.Face3(3, 0, 4),
  new THREE.Face3(2, 3, 4),
  new THREE.Face3(5, 2, 4),
  new THREE.Face3(1, 2, 6),
  new THREE.Face3(5, 2, 6),
  new THREE.Face3(4, 5, 7),
  new THREE.Face3(6, 5, 7),
  // Second cube
  new THREE.Face3(0+8, 1+8, 2+8),
  new THREE.Face3(3+8, 0+8, 2+8),
  new THREE.Face3(0+8, 7+8, 6+8),
  new THREE.Face3(1+8, 0+8, 6+8),
  new THREE.Face3(0+8, 7+8, 4+8),
  new THREE.Face3(3+8, 0+8, 4+8),
  new THREE.Face3(2+8, 3+8, 4+8),
  new THREE.Face3(5+8, 2+8, 4+8),
  new THREE.Face3(1+8, 2+8, 6+8),
  new THREE.Face3(5+8, 2+8, 6+8),
  new THREE.Face3(4+8, 5+8, 7+8),
  new THREE.Face3(6+8, 5+8, 7+8),
  // Top face 1 -> top face 2
  new THREE.Face3(5, 13, 10),
  new THREE.Face3(5, 2, 10),
  new THREE.Face3(11, 12, 4),
  new THREE.Face3(11, 3, 4),
  new THREE.Face3(4, 12, 13),
  new THREE.Face3(4, 5, 13),
  new THREE.Face3(11, 10, 2),
  new THREE.Face3(11, 3, 2),
  // Bottom face 1 -> bottom face 2
  new THREE.Face3(0, 1, 8),
  new THREE.Face3(1, 9, 8),
  new THREE.Face3(0, 7, 15),
  new THREE.Face3(0, 8, 15),
  new THREE.Face3(6, 7, 15),
  new THREE.Face3(6, 14, 15),
  new THREE.Face3(1, 6, 14),
  new THREE.Face3(1, 9, 14),
  // Side faces 1 -> side faces 2
  new THREE.Face3(0, 3, 11),
  new THREE.Face3(0, 8, 11),
  new THREE.Face3(1, 2, 10),
  new THREE.Face3(1, 9, 10),
  new THREE.Face3(13, 6, 14),
  new THREE.Face3(13, 6, 5),
  new THREE.Face3(7, 4, 12),
  new THREE.Face3(7, 15, 12)
];
