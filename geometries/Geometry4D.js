/******************
 * Geometry4D API *
 ******************/

function Geometry4D()
{
  this.vertices = [];
  this.cells = [];
}

//int [] cells
Geometry4D.prototype.filterCells = function(cells)
{
  var initialLength = this.cells.length;
  for(var i = 0; i < cells.length; i++)
    this.cells.push(this.cells[cells[i]]);
  this.cells.splice(0, initialLength);
}

Geometry4D.prototype.removeCells = function(cells)
{
  var base = this.cells.splice(0);
  this.cells.length = 0;
  for(var i = 0; i < base.length; i++)
    if(cells.indexOf(i) == -1)
      this.cells.push(base[i]);
}

Geometry4D.prototype.extrude3DGeometry = function(geom3, duth)
{
  var vertices3D = geom3.vertices, faces3D = geom3.faces;
  var vertices4D = this.vertices, cells = this.cells;
  var extraVertexOffset = vertices3D.length;
  var d = duth / 2;
  var v = new THREE.Vector4();
  for(var i = 0; i < vertices3D.length; i++)
  {
    // Copy the "normal" vectors
    v.copy(vertices3D[i]);
    v.w = -d;
    vertices4D.push(v.clone());
  }
  // Extrude all vertices along w
  for(var i = 0; i < vertices3D.length; i++)
  {
    v.copy(vertices4D[i]);
    v.w = d;
    vertices4D.push(v.clone());
  }
  // Make a 4D prism by extruding triangles along w
  // A prism is made of 3 tetrahedra ; those are the 4D model's cells
  for(var f3 = 0; f3 < faces3D.length; f3++)
  {
    var face = faces3D[f3];
    var a = face.a, b = face.b, c = face.c,
        d = face.a + extraVertexOffset, e = face.b + extraVertexOffset, f = face.c + extraVertexOffset;
    // Draw it if you don't believe me
    cells.push(new Cell4(a, c, e, d));
    cells.push(new Cell4(b, e, c, a));
    cells.push(new Cell4(c, e, f, d));
  }
}

// Some functions to add vertices and faces while going easy on the GC
// Takes an index and a limit above which we push instead of setting
// Also, does not take in duplicate and returns the index of the vertex
// To be used in Space4D.project
// int i, int l, THREE.Vector4 v / THREE.Face3 f
THREE.Geometry.prototype.addVertexP = function(index, limit, v)
{
  for(var i = 0; i < index; i++)
  {
    var vtx = this.vertices[i];
    if(v.x == vtx.x && v.y == vtx.y && v.z == vtx.z)
      return i;
  }
  if(index < limit)
    this.vertices[index].copy(v);
  else
    this.vertices.push(v);
  return index;
}

Geometry4D.prototype.addVertexP = function(index, limit, v)
{
  for(var i = 0; i < index; i++)
  {
    var vtx = this.vertices[i];
    if(v.x == vtx.x && v.y == vtx.y && v.z == vtx.z && v.w == vtx.w)
      return i;
  }
  if(index < limit)
    this.vertices[index].copy(v);
  else
    this.vertices.push(v);
  return index;
}

THREE.Face3.prototype.setABC = function(a, b, c)
{
  this.a = a; this.b = b; this.c = c;
}

// Returns whether the face was actually added
THREE.Geometry.prototype.addFaceP = function(index, limit, a, b, c)
{
  for(var i = 0; i < index; i++)
  {
    var face = this.faces[i];
    if(face.a == a && face.b == b && face.c == c)
      return false;
  }
  if(index < limit)
    this.faces[index].setABC(a, b, c);
  else
    this.faces.push(new THREE.Face3(a, b, c));
  return true;
}
