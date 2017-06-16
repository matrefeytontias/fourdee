/***************
 * Euler4D API *
 ***************/

// float xy, float xz, float xw, float yz, float yw, float zw, String order
function Euler4D(xy = 0, xz = 0, xw = 0, yz = 0, yw = 0, zw = 0, order = "xyxzxwyzywzw")
{
  this.xy = xy;
  this.xz = xz;
  this.xw = xw;
  this.yz = yz;
  this.yw = yw;
  this.zw = zw;
  this.order = order;
  this.center = new THREE.Vector4(0, 0, 0, 0);
}

/******************
 * Geometry4D API *
 ******************/

function Geometry4D()
{
  this.vertices4D = [];
  this.faces = [];
}

function BoxGeometry4D(width, height, depth, duth)
{
  Geometry4D.call(this);
  var x = width / 2, y = height / 2, z = depth / 2, w = duth / 2;
  this.vertices4D = [
    new THREE.Vector4(-x, -y, -z, -w),
    new THREE.Vector4(x, -y, -z, -w),
    new THREE.Vector4(x, y, -z, -w),
    new THREE.Vector4(-x, y, -z, -w),
    new THREE.Vector4(-x, y, z, -w),
    new THREE.Vector4(x, y, z, -w),
    new THREE.Vector4(x, -y, z, -w),
    new THREE.Vector4(-x, -y, z, -w), //7
    new THREE.Vector4(-x, -y, -z, w),
    new THREE.Vector4(x, -y, -z, w),
    new THREE.Vector4(x, y, -z, w),
    new THREE.Vector4(-x, y, -z, w),
    new THREE.Vector4(-x, y, z, w),
    new THREE.Vector4(x, y, z, w),
    new THREE.Vector4(x, -y, z, w),
    new THREE.Vector4(-x, -y, z, w), //7
  ];
  
  /*
  this.edges = [
     [1, 9], [2, 10], [3, 11], [4, 12], [5, 13], [6, 14], [7, 15],
     
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [0, 8],
    [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 8],
    [8, 11],
    
    [0, 3], [1, 6], [2, 5], [4, 7],  [9, 14], [10, 13], [12, 15]
  ] */
  
  this.faces = [
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
    
    new THREE.Face3(8, 9, 10, null, null, 1),
    new THREE.Face3(3+8, 0+8, 2+8, null, null, 1),
    
    new THREE.Face3(0+8, 7+8, 6+8, null, null, 1),
    new THREE.Face3(1+8, 0+8, 6+8, null, null, 1),
    
    new THREE.Face3(0+8, 7+8, 4+8, null, null, 1),
    new THREE.Face3(3+8, 0+8, 4+8, null, null, 1),
    
    new THREE.Face3(2+8, 3+8, 4+8, null, null, 1),
    new THREE.Face3(5+8, 2+8, 4+8, null, null, 1),
    
    new THREE.Face3(1+8, 2+8, 6+8, null, null, 1),
    new THREE.Face3(5+8, 2+8, 6+8, null, null, 1),
    
    new THREE.Face3(4+8, 5+8, 7+8, null, null, 1),
    new THREE.Face3(6+8, 5+8, 7+8, null, null, 1),
    
    
    new THREE.Face3(5, 13, 10, null, null, 2),
    new THREE.Face3(5, 2, 10, null, null, 2), 
    
    new THREE.Face3(11, 12, 4, null, null, 2),
    new THREE.Face3(11, 3, 4, null, null, 2), 
    
    new THREE.Face3(4, 12, 13, null, null, 2),
    new THREE.Face3(4, 5, 13, null, null, 2), 
    
    new THREE.Face3(11, 10, 2, null, null, 2), 
    new THREE.Face3(11, 3, 2, null, null, 2), 
    
    new THREE.Face3(0, 1, 8, null, null, 2),
    new THREE.Face3(1, 9, 8, null, null, 2),
    
    new THREE.Face3(0, 7, 15, null, null, 2),
    new THREE.Face3(0, 8, 15, null, null, 2),

    new THREE.Face3(6, 7, 15, null, null, 2),
    new THREE.Face3(6, 14, 15, null, null, 2),
    
    new THREE.Face3(1, 6, 14, null, null, 2),
    new THREE.Face3(1, 9, 14, null, null, 2), 
  ]
}




BoxGeometry4D.prototype = new Geometry4D();
BoxGeometry4D.prototype.constructor = BoxGeometry4D;

/****************
 * Object4D API *
 ****************/

function Object4D()
{
  this.position = new THREE.Vector4(0, 0, 0 ,0);
  this.scale = 1.;
  this.geometry = undefined;
  this.material = undefined;
  this.projected = undefined; // use your own 3D projection
}

// String plane (ex : "xz"), float theta
Object4D.prototype.rotate = function(plane, theta){
  if(!this.geometry) throw "Trying to rotate a non-geometrical object";
  
  for(var i = 0; i < this.geometry.vertices4D.length; i++){
    this.geometry.vertices4D[i].rotate(plane, theta);
  }
}


function MultipleObject4D()
{
  Object4D.call(this);
  this.children = [];
}

/****************
 * Points4D API *
 ****************/

// Geometry4D geometry, THREE.Material material
function Points4D(geometry, material)
{
  Object4D.call(this);
  this.geometry = geometry;
  this.material = material;
  this.projection = new THREE.Points(new THREE.Geometry(), material);
}

Points4D.prototype = new Object4D();
Points4D.prototype.constructor = Points4D;


/****************
 * Points4D API *
 ****************/

// Geometry4D geometry, THREE.Material material
function Mesh4D(geometry, material)
{
  Object4D.call(this);
  this.geometry = geometry;
  var geom3D = new THREE.Geometry();
  geom3D.faces = geometry.faces;
  geom3D.elementsNeedUpdate = true;
  this.projection = new THREE.Mesh(geom3D, material);
}

Mesh4D.prototype = new Object4D();
Mesh4D.prototype.constructor = Points4D;

/****************
 * Line4D API *
 ****************/


// Geometry4D geometry, THREE.Material material
function Line4D(geometry, material)
{
  Object4D.call(this);
  this.geometry = geometry;
  this.material = material;
  this.projection = new THREE.Line(new THREE.Geometry(), material);
}

Line4D.prototype = new Object4D();
Line4D.prototype.constructor = Line4D;

/*
function Edges4D(geometry, material)
{
  var edgesGeometry = new Geometry4D();
  for(var i = 0; i < edgesGeometry.length; i++){
    edgesGeometry.vertices4D.push( new Vector4()
  }
  Object4D.call(this);
  
} */