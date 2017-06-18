/*********************
 * BoxGeometry4D API *
 *********************/

// Constructs a 4-cube from 4D dimensions
function BoxGeometry4D(width, height, depth, duth)
{
  Geometry4D.call(this);
  var mat = new Matrix5();
  mat.scale(width, height, depth, duth);
  for(var i = 0; i < tesseractVertices.length; i++)
    this.vertices4D.push(tesseractVertices[i].clone().applyMatrix5(mat));
  for(var i = 0; i < tesseractFaces.length; i++)
    this.faces.push(tesseractFaces[i].clone());;
}

BoxGeometry4D.prototype = new Geometry4D();
BoxGeometry4D.prototype.constructor = BoxGeometry4D;
