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

// String plane (ex : "xz"), float theta
Space4D.prototype.rotate = function(plane, theta){
  
  for(var i = 0; i < this.children.length; i++){
    this.children[i].position.rotate(plane, theta);
    if(this.children[i].geometry) this.children[i].rotate(plane, theta);
  }
  
}

// Updates the children Object4D with their 3D projection
// Does not take space position into consideration
Space4D.prototype.project = function ()
{

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
          var tempVert =  geom4.vertices4D[vi].clone();
          geom3.vertices.push( this.projector.project( tempVert.add(child.position) ) );
          //if(vi == 0) console.log(geom3.vertices[0].x, geom4.vertices4D[vi].add(child.position).x, geom4.vertices4D[vi].x, child.position.x);
        }
        geom3.verticesNeedUpdate = true;
        geom3.elementsNeedUpdate = true
      }
    }
  }
}
