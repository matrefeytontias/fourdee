/***************
 * Space4D API *
 ***************/

// Proj4D projector
function Space4D(projector)
{
  Object4D.call(this);
  this.projector = projector;
  this.children = [];
}

Space4D.prototype = new Object4D();
Space4D.prototype.constructor = Space4D;

// Object4D obj
Space4D.prototype.add = function (obj)
{
  for(var i = 0; i < this.children.length; i++)
    if(this.children[i] === obj)
      throw "Can't add same Object4D to Space4D twice";
  this.children.push(obj);
}

// Updates the children Object4D with their 3D projection
Space4D.prototype.project = function ()
{
  var mat = this.buildMatrix5();

  for(var i = 0; i < this.children.length; i++)
  {
    var child = this.children[i], geom4 = child.geometry;
    if(geom4 === undefined)
      throw "Pushed Object4D with undefined geometry";
    else
    {
      var proj = child.projection;
      if(proj === undefined)
        throw "Pushed Object4D with undefined target 3D render type";
      else
      {
        var objMat = child.buildMatrix5();
        console.log(objMat.elements);
        var geom3 = proj.geometry;
        geom3.vertices.length = 0;
        for(var vi = 0; vi < geom4.vertices4D.length; vi++)
        {
          var localVertex = geom4.vertices4D[vi].clone();
          localVertex.applyMatrix5(objMat).applyMatrix5(mat);
          geom3.vertices.push(this.projector.project(localVertex));
        }
        geom3.verticesNeedUpdate = true;
        if(child.projection.isLineSegments || child.material.isLineDashedMaterial)
          geom3.computeLineDistances();
      }
    }
  }
}
