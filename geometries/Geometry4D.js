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
  new THREE.Face3(2, 1, 0),
  new THREE.Face3(0, 3, 2),
  new THREE.Face3(6, 7, 0),
  new THREE.Face3(0, 1, 6),
  new THREE.Face3(0, 7, 4),
  new THREE.Face3(4, 3, 0),
  new THREE.Face3(4, 5, 2),
  new THREE.Face3(2, 3, 4),
  new THREE.Face3(6, 1, 2),
  new THREE.Face3(2, 5, 6),
  new THREE.Face3(6, 5, 4),
  new THREE.Face3(4, 7, 6), 
  // Second cube
  new THREE.Face3(10, 9, 8),
  new THREE.Face3(8, 11, 10),
  new THREE.Face3(14, 15, 8),
  new THREE.Face3(8, 9, 14),
  new THREE.Face3(8, 15, 12),
  new THREE.Face3(12, 11, 8),
  new THREE.Face3(12, 13, 10),
  new THREE.Face3(10, 11, 12),
  new THREE.Face3(14, 9, 10),
  new THREE.Face3(10, 13, 14),
  new THREE.Face3(14, 13, 12),
  new THREE.Face3(12, 15, 14),
  // Top face 1 -> top face 2
  new THREE.Face3(13, 5, 2),
  new THREE.Face3(2, 10, 13),
  new THREE.Face3(12, 4, 3),
  new THREE.Face3(3, 11, 12),
  new THREE.Face3(12, 13, 5),
  new THREE.Face3(5, 4, 12),
  new THREE.Face3(3, 11, 10),
  new THREE.Face3(10, 2, 3),  
  // Bottom face 1 -> bottom face 2
  new THREE.Face3(8, 0, 1),
  new THREE.Face3(1, 9, 8), 
  new THREE.Face3(7, 15, 8),
  new THREE.Face3(8, 0, 7), 
  new THREE.Face3(14, 15, 7),
  new THREE.Face3(7, 6, 14),
  new THREE.Face3(14, 6, 1),
  new THREE.Face3(1, 9, 14), 
  // Side faces 1 -> side faces 2
  new THREE.Face3(0, 3, 11),
  new THREE.Face3(11, 8, 0),
  new THREE.Face3(1, 2, 10),
  new THREE.Face3(10, 9, 1),
  new THREE.Face3(5, 13, 14),
  new THREE.Face3(14, 6, 5),
  new THREE.Face3(15, 12, 4),
  new THREE.Face3(4, 7, 15) 
];

const tesseractFacesGroups = {
  faces : [
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 28, 29, 30, 31,
    32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47
  ],
  materials : [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 
    3, 3, 3, 3, 3, 3, 3, 3,
    4, 4, 4, 4, 4, 4, 4, 4
  ]
  
}


