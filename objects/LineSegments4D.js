/**********************
 * LineSegments4D API *
 **********************/
 
// Geometry4D geometry, THREE.Material material
function LineSegments4D(geometry, material)
{
  Object4D.call(this);
  this.geometry = geometry;
  this.material = material;
  this.projection = new THREE.LineSegments(new THREE.Geometry(), material);
}

LineSegments4D.prototype = new Object4D();
LineSegments4D.prototype.constructor = LineSegments4D;
