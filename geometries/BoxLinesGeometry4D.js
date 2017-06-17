/**************************
 * BoxLinesGeometry4D API *
 **************************/

// Constructs a 4-cube to be used with LineSegments4D
function BoxLinesGeometry4D(width, height, depth, duth)
{
  Geometry4D.call(this);
  var mat = new Matrix5();
  mat.scale(width, height, depth, duth);
  for(var i = 0; i < tesseractEdges.length; i++)
    this.vertices4D.push(tesseractVertices[tesseractEdges[i]].clone().applyMatrix5(mat));
}

BoxLinesGeometry4D.prototype = new Geometry4D();
BoxLinesGeometry4D.prototype.constructor = BoxLinesGeometry4D;
