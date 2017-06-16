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
  var mat = new Matrix5();
  
  mat.scale(this.scale, this.scale, this.scale, this.scale);
  mat.translate(this.position.x, this.position.y, this.position.z, this.position.w);
  //Handle rotations following the order described in this.rotation.order
  for(var i = 0; i + 1 < this.rotation.order.length; i += 2)
  {
    var rotationPlane = this.rotation.order.slice(i, i + 2);
    var theta = this.rotation[rotationPlane.toLowerCase()];
    if(theta != 0)
      mat.rotate(rotationPlane, theta);
  }

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
        var geom3 = proj.geometry;
        geom3.vertices.length = 0;
        for(var vi = 0; vi < geom4.vertices4D.length; vi++)
        {
          var localVertex = geom4.vertices4D[vi].clone();
          localVertex.add(child.position).applyMatrix5(mat);
          geom3.vertices.push(this.projector.project(localVertex));
        }
        geom3.verticesNeedUpdate = true;
      }
    }
  }
}