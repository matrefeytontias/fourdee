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
