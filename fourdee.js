/****************
 * Object4D API *
 ****************/

function Object4D()
{
  this.position = new THREE.Vector4();
  this.rotation = new Euler4D();
  this.scale = 1.;
  this.geometry = undefined;
  this.projection = undefined; // projection is the THREE.Geometry 3D created by projection of the object
  this.lineProjection = undefined;
  this.position3D = new THREE.Vector3();
  this.children3D = [];
  this.dirty = true;
  this.positionalOnly = false;
}

// int[] faces, int[] materials
Object4D.prototype.setFaceMaterial = function(faces, materials)
{
  for(var i = 0; i < materials.length; i++)
    this.geometry.faces[faces[i]].materialIndex = materials[i];
}

// int [][] faces
Object4D.prototype.setFaceGroupsMaterial = function(faceGroups)
{
  for(var i = 0; i < faceGroups.length; i++)
  {
    for(var j = 0; j < faceGroups[i].length; j++)
    {
      this.geometry.faces[faceGroups[i][j]].materialIndex = i;
    }
  }
}

Object4D.prototype.project = function(defaultProjector, spaceMat, spaceRotationCenter)
{
  if(this.projection === undefined)
    throw "Pushed Object4D with undefined target 3D geometry";
  
  if(this.projection.vertices.length == 0)
    this.initializeProjection();
  
  var objMat = this.buildMatrix5();
  for(var vi = 0; vi < this.geometry.vertices4D.length; vi++)
  {
    var localVertex = this.geometry.vertices4D[vi].clone();
    localVertex.sub(this.rotation.center).applyMatrix5(objMat).add(this.rotation.center);
    localVertex.sub(spaceRotationCenter).applyMatrix5(spaceMat).add(spaceRotationCenter);
              
    if(this.geometry.projector === null)
      this.projection.vertices[vi].copy(defaultProjector.project(localVertex).add(this.position3D));
    else
      this.projection.vertices[vi].copy(this.geometry.projector.project(localVertex).add(this.position3D));
  }
  
  if(this.lineProjection !== undefined)
    this.lineProjection.verticesNeedUpdate = true;
  
  this.projection.verticesNeedUpdate = true;
  this.projection.elementsNeedUpdate = true;
  this.projection.computeFaceNormals();
  this.projection.computeVertexNormals();
  this.projection.computeFlatVertexNormals();
  this.projection.computeBoundingBox();
  this.projection.computeBoundingSphere();
}

Object4D.prototype.initializeProjection = function()
{
  for(var vi = 0; vi < this.geometry.vertices4D.length; vi++)
    this.projection.vertices.push(new THREE.Vector3(0, 0, 0));
  this.projection.faces = this.geometry.faces;
}

Object4D.prototype.createLineProjection = function(){
  
  if(this.geometry.edges === undefined)
    throw "Can't create line projection of a geometry without egdes";
  
  if(this.projection.vertices.length == 0)
    this.initializeProjection();
  
  this.lineProjection = new THREE.Geometry();

  for(var i = 0; i < this.geometry.edges.length; i += 2)
  {
    this.lineProjection.vertices.push(this.projection.vertices[this.geometry.edges[i]]);
    this.lineProjection.vertices.push(this.projection.vertices[this.geometry.edges[i+1]]);
  }
}

Object4D.prototype.buildMatrix5 = function()
{
  var mat = new Matrix5();

  mat.scale(this.scale, this.scale, this.scale, this.scale);

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
  if(this.projection === undefined)
    throw "Can't add Mesh material on an un-projected object";
  
  var mesh3d = new THREE.Mesh(this.projection, material);
  
  if(Array.isArray(material))
    this.setFaceGroupsMaterial(this.geometry.faceGroups);

  return this.add3DChild(mesh3d);
}

Object4D.prototype.add3DLineSegmentsMaterial = function(material)
{
  if(this.projection === undefined)
    throw "Can't add lineSegments material on an un-projected object";

  if(this.lineProjection === undefined)
    this.createLineProjection();
    
  var lines = new THREE.LineSegments(this.lineProjection, material);
  
  return this.add3DChild(lines);
}

Object4D.prototype.get3DBody = function ()
{
  return this.children3D[0];
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
