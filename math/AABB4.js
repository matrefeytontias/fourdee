/*************
 * AABB4 API *
 *************/

// 4D Axis-Aligned Bounding Box. Used for rough collision checking
// this.p is the position of the center
function AABB4(position = new THREE.Vector4(0, 0, 0, 0), dimensions = new THREE.Vector4(0, 0, 0, 0))
{
  this.p = position;
  this.d = dimensions;
}

// Check if two boxes intersect
AABB4.prototype.intersects = function(other)
{
  var cwidth = Math.max(Math.abs(this.p.x + this.d.x / 2 - (other.p.x - other.d.x / 2)), Math.abs(other.p.x + other.d.x / 2 - (this.p.x - this.d.x / 2)));
  var cheight = Math.max(Math.abs(this.p.y + this.d.y / 2 - (other.p.y - other.d.y / 2)), Math.abs(other.p.y + other.d.y / 2 - (this.p.y - this.d.y / 2)));
  var cdepth = Math.max(Math.abs(this.p.z + this.d.z / 2 - (other.p.z - other.d.z / 2)), Math.abs(other.p.z + other.d.z / 2 - (this.p.z - this.d.z / 2)));
  var cduth = Math.max(Math.abs(this.p.w + this.d.w / 2 - (other.p.w - other.d.w / 2)), Math.abs(other.p.w + other.d.w / 2 - (this.p.w - this.d.w / 2)));
  return cwidth < this.d.x + other.d.x && cheight < this.d.y + other.d.y && cdepth < this.d.z + other.d.z && cduth < this.d.w + other.d.w;
}
