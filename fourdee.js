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
  this.projected = undefined; // use your own 3D projection
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
