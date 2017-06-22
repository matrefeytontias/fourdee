// Constructs a 3-cube from 4D dimensions
// String dimension float width, float height, float depth
function Box3DGeometry4D(dimension, width, height, depth)
{
  Geometry4D.call(this);
  
  var d1 = dimension.charAt(0), d2 = dimension.charAt(1), d3 = dimension.charAt(2);
  
   
  var v = new THREE.Vector4(0, 0, 0, 0);
   
  for(var i = -1/2; i < 1; i++)
  {
    v[d1] = i * width
    for(var j = -1/2; j < 1; j++)
    {
      v[d2] = j * height;
      for(var k = -1/2; k < 1; k++)
      {
        v[d3] = k * depth;
        this.vertices4D.push(v.clone()); 
      }
    }
  }
  
  for(var i = 0; i < cubeFaces.length; i++)
    this.faces.push(cubeFaces[i].clone());;
  
}

Box3DGeometry4D.prototype = new Geometry4D();
Box3DGeometry4D.prototype.constructor = Box3DGeometry4D;

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

const cubeFaces = [ 
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
  new THREE.Face3(4, 0, 2) 
];