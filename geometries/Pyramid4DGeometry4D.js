// Constructs a solid constructed as a pyramid in 4D dimensions 
// String dimension float width, float height, float depth
function Pyramid4DGeometry4D(width, height, depth, duth)
{
  Geometry4D.call(this);

  var v = new THREE.Vector4(0, 0, 0, -1/8*duth);

  for(var i = -1/2; i < 1; i++)
  {
    v.x = i * width
    for(var j = -1/2; j < 1; j++)
    {
      v.y = j * height;
      for(var k = -1/2; k < 1; k++)
      {
        v.z = k * depth;
        this.vertices4D.push(v.clone());
      }
    }
  }
  this.vertices4D.push(new THREE.Vector4(0, 0, 0, 7/8*duth));

  for(var i = 0; i < pyramid4DFaces.length; i++)
    this.faces.push(pyramid4DFaces[i].clone());;

  this.faceGroups = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13, 14, 15, 16, 17, 18, 19]];
}

Pyramid4DGeometry4D.prototype = new Geometry4D();
Pyramid4DGeometry4D.prototype.constructor = Pyramid4DGeometry4D;

/* cube vertices
- - -
- - +
- + -
- + +

+ - -
+ - +
+ + -
+ + +
*/

const pyramid4DFaces = [
  new THREE.Face3(5, 7, 3),
  new THREE.Face3(3, 1, 5),
  new THREE.Face3(4, 6, 7),
  new THREE.Face3(7, 5, 4),
  new THREE.Face3(7, 6, 2),
  new THREE.Face3(2, 3, 7),
  new THREE.Face3(1, 3, 2),
  new THREE.Face3(2, 0, 1),
  new THREE.Face3(0, 4, 5),
  new THREE.Face3(5, 1, 0),
  new THREE.Face3(2, 6, 4),
  new THREE.Face3(4, 0, 2),
  new THREE.Face3(6, 8, 7),
  new THREE.Face3(7, 8, 5),
  new THREE.Face3(5, 8, 4),
  new THREE.Face3(4, 8, 6),
  new THREE.Face3(3, 8, 2),
  new THREE.Face3(2, 8, 0),
  new THREE.Face3(0, 8, 1),
  new THREE.Face3(1, 8, 3),
  new THREE.Face3(7, 8, 3),
  new THREE.Face3(1, 8, 5),
  new THREE.Face3(2, 8, 6),
  new THREE.Face3(4, 8, 0)
];
