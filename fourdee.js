/****************
 * Object4D API *
 ****************/

function Object4D()
{
  this.position = new THREE.Vector4();
  this.rotation = new Euler4D();
  this.scale = 1.;
  this.geometry = undefined;
  this.material = undefined;
  this.projection = undefined; // use your own 3D projection
}

Object4D.prototype.buildMatrix5 = function ()
{
  var mat = new Matrix5();
  
  mat.scale(this.scale, this.scale, this.scale, this.scale);
  mat.translate(this.position.x, this.position.y, this.position.z, this.position.w);
  // Handle rotations following the order described in this.rotation.order
  for(var i = 0; i + 1 < this.rotation.order.length; i += 2)
  {
    var rotationPlane = this.rotation.order.slice(i, i + 2);
    var theta = this.rotation[rotationPlane.toLowerCase()];
    if(theta != 0)
      mat.rotate(rotationPlane, theta);
  }
  return mat;
}

/**************
 * Proj4D API *
 **************/

// Mostly aesthetic ...
function Proj4D() { }

// Override this in your own projection
// Vector4 v
Proj4D.prototype.project = function (v) { }

// Linear algebra projection : (x, y, z, w) -> (x, y, z, 0)
function OrthoProj()
{
  Proj4D.call(this);
}

OrthoProj.prototype = new Proj4D();

OrthoProj.prototype.project = function (v)
{
  return new THREE.Vector3(v.x, v.y, v.z);
}
