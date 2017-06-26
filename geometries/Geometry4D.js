/******************
 * Geometry4D API *
 ******************/

function Geometry4D()
{
  this.vertices4D = [];
  this.faces = [];
  this.faceGroups = [[]];
  this.projector = null;
}

//int [] faces
Geometry4D.prototype.filterFaces = function(faces)
{
  var initialLength = this.faces.length;
  for(var i = 0; i < faces.length; i++)
    this.faces.push(this.faces[faces[i]]);
  this.faces.splice(0, initialLength);
}

//int [][] facesGroups
Geometry4D.prototype.filterFaceGroups = function(groups)
{
  var initialLength = this.faces.length;
  for(var i = 0; i < groups.length; i++)
    for(var j = 0; j < this.faceGroups[groups[i]].length; j++)
      this.faces.push(this.faces[this.faceGroups[groups[i]][j]]);
  this.faces.splice(0, initialLength);
}


Geometry4D.prototype.removeFaces = function(faces)
{
  var base = this.faces.splice(0);
  this.faces.length = 0;
  for(var i = 0; i < base.length; i++)
    if(faces.indexOf(i) == -1)
      this.faces.push(base[i]);
}

Geometry4D.prototype.removeFaceGroups = function(groups)
{
  var fg = this.faceGroups;
  var f = groups.reduce(function(acc, x) { return acc.concat(fg[x]); }, []);
  this.removeFaces(f);
}
