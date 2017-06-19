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
Space4D.prototype.add = function(obj)
{
  for(var i = 0; i < this.children.length; i++)
    if(this.children[i] === obj)
      throw "Can't add same Object4D to Space4D twice";
  this.children.push(obj);
  // Temporary fix. Invalidate bounding box upon rotation ?
  obj.projection.frustumCulled = false;
}

// Rotates the whole 4D space around a point
// Vector4 center, String plane (eg "xw"), float theta
Space4D.prototype.rotateAround = function(center, plane, theta)
{
  var rot = new Matrix5();
  rot["makeRotate" + plane.toUpperCase()](theta);
  rot.translate(center.x, center.y, center.z, center.w);
  for(var i = 0; i < this.children.length; i++)
  {
    var obj = this.children[i];
    obj.position.sub(center).applyMatrix5(rot);
    obj.rotation[plane] += theta;
    obj.dirty = true;
  }
}

// Updates the children Object4D with their 3D projection
Space4D.prototype.project = function()
{
  var spaceMat = this.buildMatrix5();

  for(var i = 0; i < this.children.length; i++)
  {
    var child = this.children[i], geom4 = child.geometry;
    if(child.dirty)
    {
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
          var geom3 = proj.geometry;
          geom3.vertices.length = 0;
          for(var vi = 0; vi < geom4.vertices4D.length; vi++)
          {
            var localVertex = geom4.vertices4D[vi].clone().sub(child.rotation.center);
            localVertex.applyMatrix5(objMat).add(child.rotation.center).sub(this.rotation.center).applyMatrix5(spaceMat);
            geom3.vertices.push(this.projector.project(localVertex.add(this.rotation.center)));
          }
          geom3.faces = geom4.faces;
          geom3.verticesNeedUpdate = true;
          geom3.elementsNeedUpdate = true;
          geom3.computeFaceNormals();
          geom3.computeVertexNormals();
          geom3.computeFlatVertexNormals();
          if(child.projection.isLineSegments || child.material.isLineDashedMaterial)
            geom3.computeLineDistances();
        }
      }
      child.dirty = false;
    }
  }
}
