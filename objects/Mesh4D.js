/**************
 * Mesh4D API *
 **************/

// Geometry4D geometry, THREE.Material material
function Mesh4D(geometry, material)
{
  Object4D.call(this);

  this.geometry = geometry;
  this.material = material;
  this.projection = new THREE.Geometry();
  this.add3DMeshMaterial(material);
}

Mesh4D.prototype = new Object4D();
Mesh4D.prototype.constructor = Mesh4D;

function BackSides(mesh4d, material)
{
  material.side = THREE.BackSide;
  THREE.Mesh.call(this, mesh4d.projection, material);
  this.frustumCulled = false;
  mesh4d.add3Dchild(this);
}

BackSides.prototype = new THREE.Mesh();
BackSides.prototype.constructor = BackSides;
