/***************
 * Vector4 API *
 ***************/

function Vector4(x = 0, y = 0, z = 0, w = 0)
{
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
}

Vector4.prototype.add = function (v)
{
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  this.w += v.w;
  return this;
}

Vector4.prototype.mult = function (f)
{
  this.x *= f;
  this.y *= f;
  this.z *= f;
  this.w *= f;
  return this;
}

Vector4.prototype.dot = function (v)
{
  return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
}

Vector4.prototype.length = function ()
{
  return Math.sqrt(this.dot(this));
}

Vector4.prototype.normalize = function ()
{
  return this.mult(1.0 / this.length());
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

}

Object4D.prototype.constructor = Object4D;
