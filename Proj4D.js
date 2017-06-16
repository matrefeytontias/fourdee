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

// experimental perspective projetcion
function PerspectProj(offset)
{
  Proj4D.call(this);
  this.offset = offset;
}

PerspectProj.prototype = new Proj4D();

PerspectProj.prototype.project = function (v)
{
  var f = (this.offset*2+v.w)/(this.offset*2);
  return new THREE.Vector3(f*v.x, f*v.y, f*v.z);
}