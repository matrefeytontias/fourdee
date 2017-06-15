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
  this.center = new Vector4();
}

/******************
 * Geometry4D API *
 ******************/

function Geometry4D()
{
  THREE.Geometry.call(this);
  this.vertices4D = [];
}

Geometry4D.prototype = new THREE.Geometry();
Geometry4D.prototype.constructor = Geometry4D;
Geometry4D.prototype.invalidate = function ()
{
  // Refresh the 3D vertices from the 4D vertices
  // TODO
  this.verticesNeedUpdate = true;
}

/****************
 * Object4D API *
 ****************/

function Object4D()
{
  this.position = new Vector4();
  this.rotation = new Euler4D();
  this.scale = 1.;
  this.projected = undefined; // use your own 3D projection
}

/***************
 * Space4D API *
 ***************/

// Proj4D projector
function Space4D(projector)
{
  Object4D.prototype.call(this);
  this.projector = projector;
  this.children = [];
}

Space4D.prototype = new Object4D();
Space4D.prototype.constructor = Space4D;

/**************
 * Proj4D API *
 **************/

function Proj4D { }

// Override this in your own projection
// Vector4 v
Proj4D.prototype.project = function (v) { }
