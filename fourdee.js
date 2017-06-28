/****************
 * Object4D API *
 ****************/

function Object4D()
{
  this.position = new THREE.Vector4(0, 0, 0, 0);
  this.rotation = new Euler4D();
  this.scale = 1.;
  this.geometry = undefined; // Geometry4D
  this.projection = undefined; // projection is the THREE.Geometry 3D created by projection of the object
  this.children3D = [];
  this.dirty = true;
}

Object4D.prototype.getCellVertices = function(i)
{
  var c = this.geometry.cells[i];
  
}

Object4D.prototype.getAABB = function()
{
  var vertices = this.geometry.vertices;
  var minx = 123456789, maxx = -123456789,
      miny = 123456789, maxy = -123456789,
      minz = 123456789, maxz = -123456789,
      minw = 123456789, maxw = -123456789;
  for(var i = 0; i < vertices.length; i++)
  {
    var v = vertices[i];
    minx = Math.min(v.x, minx);
    maxx = Math.max(v.x, maxx);
    miny = Math.min(v.y, miny);
    maxy = Math.max(v.y, maxy);
    minz = Math.min(v.z, minz);
    maxz = Math.max(v.z, maxz);
    minw = Math.min(v.w, minw);
    maxw = Math.max(v.w, maxw);
  }
  return new AABB4(this.position, new THREE.Vector4(maxx - minx, maxy - miny, maxz - minz, maxw - minw));
}

// int[] faces, int[] materials
Object4D.prototype.setCellMaterial = function(cells, materials)
{
  for(var i = 0; i < materials.length; i++)
    this.geometry.cells[cells[i]].materialIndex = materials[i];
}

// int [][] faces
Object4D.prototype.setCellGroupMaterial = function(cellGroups)
{
  for(var i = 0; i < cellGroups.length; i++)
  {
    for(var j = 0; j < cellGroups[i].length; j++)
    {
      this.geometry.cells[cellGroups[i][j]].materialIndex = i;
    }
  }
}

Object4D.prototype.buildMatrix5 = function()
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

Object4D.prototype.add3DChild = function(object3D)
{
  this.children3D.push(object3D);
  object3D.parent4D = this;
  object3D.frustumCulled = false;
  return object3D;
}

Object4D.prototype.add3DMeshMaterial = function(material)
{
  var mesh3d = new THREE.Mesh(this.projection, material);

  return this.add3DChild(mesh3d);
}

Object4D.prototype.get3DBody = function ()
{
  return this.children3D[0];
}
