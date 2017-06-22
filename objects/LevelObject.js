function LevelObject(geometry, material)
{
  Mesh4D.call(this, geometry, material);
  this.selectable = false;
  this.seleted = false;
  this.wireframeIndexes = [];
}

LevelObject.prototype = new Mesh4D();
LevelObject.prototype.constructor = LevelObject;

// String[] rotations
LevelObject.prototype.lockRotations = function(rotations)
{
  for(var i = 0; i < rotations.length; i++)
  {
    var property = rotations[i], r = this.rotation;
    var backup = r[property];
    delete r[property];
    Object.defineProperty(r, property, { get: function() { return backup; } });
  }
}

//boolean b, THREE.Material wireframeMaterial
LevelObject.prototype.setSelectable = function(b)
{
  this.selectable = b;
  if(b && this.wireframeIndexes.length == 0)
  {
    var l = this.children3D.length;
    for(var i = 0; i < l; i++)
    {


      if(Array.isArray(this.children3D[i].material))
      {
        var materials = [];
        for(var j = 0; j < this.children3D[i].material.length; j++)
        {
          var mat = this.children3D[i].material[j];
          if(mat !== null)
          {
            materials.push(mat.clone());
            materials[j].transparent = true;
            materials[j].opacity = 0.2;
          }
          else
            materials.push(null);
        }
        this.addWireframeMaterial(materials);
      }
      else{
        var m = this.children3D[i].material.clone();
        m.transparent = true;
        m.opacity = 0.2;
        this.addWireframeMaterial(m);
      }
    }
    this.addWireframeMaterial()
  }
}

LevelObject.prototype.addWireframeMaterial = function(material = new THREE.MeshBasicMaterial({
        color : 0xffffff,
        wireframe : true,
        wireframeLinewidth : 5}))
{
  this.wireframeIndexes.push(this.children3D.length);
  var wmesh = this.add3DMeshMaterial(material);
  wmesh.visible = false;
}

LevelObject.prototype.toggleWireframe = function (){
  if(this.wireframeIndexes.length == 0)
    throw "no defined wireframe materials (tried to toggleWireframe)";
  this.selected = !this.selected;
  if(this.selected)
  {
    for(var i = 0; i < this.children3D.length; i++)
      this.children3D[i].visible = false;
    for(var i = 0; i < this.wireframeIndexes.length; i++)
      this.children3D[this.wireframeIndexes[i]].visible = true;
  }
  else{
    for(var i = 0; i < this.children3D.length; i++)
      this.children3D[i].visible = true;
    for(var i = 0; i < this.wireframeIndexes.length; i++)
      this.children3D[this.wireframeIndexes[i]].visible = false;
  }
}
