/****************
 * Object4D API *
 ****************/

function Object4D()
{
  this.position = new THREE.Vector4();
  this.rotation = new Euler4D();
  this.scale = 1.;
  this.geometry = undefined;
  this.projection = undefined; // use your own 3D projection
  this.position3D = new THREE.Vector3();
  this.children3D = [];
  this.dirty = true;
  this.positionalOnly = false;
  this.selectable = false;
  this.seleted = false;
  this.wireframeIndexes = [];
}

// int[] faces, int[] materials
Object4D.prototype.setFaceMaterial = function(faces, materials)
{
  for(var i = 0; i < materials.length; i++)
    this.geometry.faces[faces[i]].materialIndex = materials[i];
}

// int [][] faces
Object4D.prototype.setFaceGroupMaterial = function(facesGroups)
{
  for(var i = 0; i < facesGroups.length; i++)
  {
    for(var j = 0; j < facesGroups[i].length; j++)
    {
      this.geometry.faces[facesGroups[i][j]].materialIndex = i;
    }
  }
}

//boolean b, THREE.Material wireframeMaterial
Object4D.prototype.setSelectable = function(b)
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
          materials.push( this.children3D[i].material[j].clone() );
          materials[j].transparent = true;
          materials[j].opacity = 0.2;
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

Object4D.prototype.addWireframeMaterial = function(material = new THREE.MeshBasicMaterial({
        color : 0xffffff,
        wireframe : true,
        wireframeLinewidth : 5}))
{
  this.wireframeIndexes.push(this.children3D.length);
  var wmesh = this.add3DMeshMaterial(material);
  wmesh.visible = false;
}

Object4D.prototype.toggleWireframe = function (){
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

Object4D.prototype.addChildrenToScene = function(scene)
{
  for(var i = 0; i < this.children3D.length; i++)
  {
    scene.add(this.children3D[i]);
  }
}

/**************
 * Proj4D API *
 **************/

// Mostly aesthetic ...
function Proj4D() { }

// Override this in your own projection
// Vector4 v
Proj4D.prototype.project = function(v) { }

//
// Linear algebra projection : (x, y, z, w) -> (x, y, z, 0)
//
function OrthoProj()
{
  Proj4D.call(this);
}

OrthoProj.prototype = new Proj4D();
OrthoProj.prototype.project = function(v)
{
  return new THREE.Vector3(v.x, v.y, v.z);
}

//
// Stereographical projection : uses a 3-sphere to project the 4D point onto the hyperplane w = 0
//
// THREE.Vector4 center, float radius, THREE.Vector4 planeNormal, THREE.Vector4 planePoint
function StereoProj(center, radius)
{
  Proj4D.call(this);
  this.sphereCenter = center;
  this.sphereRadius = radius;
  // The pole is the sphere's furthest point from the hyperplane w = 0
  this.spherePole = (new THREE.Vector4(0, 0, 0, radius * ((center.w > 0) * 2 - 1))).add(center);
}

StereoProj.prototype = new Proj4D();
StereoProj.prototype.project = function(v)
{
  // Projection of the point on the 3-sphere
  var sphereProj = v.clone().sub(this.sphereCenter);
  sphereProj.multiplyScalar(this.sphereRadius / sphereProj.length()).add(this.sphereCenter);

  var u = sphereProj.clone().sub(this.spherePole).normalize();
  if(u.w != 0)
  {
    var t = -this.spherePole.w / u.w;
    u = u.multiplyScalar(t).add(this.spherePole);
  }
  return new THREE.Vector3(u.x, u.y, u.z);
}
