/*******************
 * Intersector API *
 *******************/

// 3D hyperplane to intersect 4D space with
function Intersector()
{
  this.ux = new THREE.Vector4(1, 0, 0, 0);
  this.uy = new THREE.Vector4(0, 1, 0, 0);
  this.uz = new THREE.Vector4(0, 0, 1, 0);
  this.normal = new THREE.Vector4(0, 0, 0, 1);
  this.origin = new THREE.Vector4(0, 0, 0, 0);
  this.angle = 0;
  // "e" term of the cartesian equation
  this.e = this.normal.dot(this.origin);
  // Rotation of the axis system in 4D
  this.rotation = new Euler4D();
  // Local rotation of the axis system in 3D
  this.rotation3D = new THREE.Euler(0, 0, 0, "XYZ");
  this.invRotation3D = new THREE.Euler(0, 0, 0, "ZYX");
  this.camera = null;
}

Intersector.prototype.refresh = function()
{
  // Calculate the local 3D base according to the camera's rotations
  // since those are given in the base of the 3D intersector
  this.rotation3D.copy(this.camera.rotation);
  this.invRotation3D.set(-this.rotation3D.x, -this.rotation3D.y, -this.rotation3D.z, "ZYX");
  var backup = this.origin.clone();
  this.origin.set(0, 0, 0, 0);
  this.ux.set(1, 0, 0, 0);
  this.uy.set(0, 1, 0, 0);
  this.uz.set(0, 0, 1, 0);
  var ux3 = new THREE.Vector3(1, 0, 0),
      uy3 = new THREE.Vector3(0, 1, 0),
      uz3 = new THREE.Vector3(0, 0, 1);
  ux3 = this.switchBase(ux3.applyEuler(this.invRotation3D));
  uy3 = this.switchBase(uy3.applyEuler(this.invRotation3D));
  uz3 = this.switchBase(uz3.applyEuler(this.invRotation3D));
  // Then, apply the actual 4D rotations
  ux3.applyEuler4D(this.rotation);
  uy3.applyEuler4D(this.rotation);
  uz3.applyEuler4D(this.rotation);
  this.normal.applyEuler4D(this.rotation);
  // And finally, revert the 3D rotation
  ux3 = this.switchBase(ux3);
  uy3 = this.switchBase(uy3);
  uz3 = this.switchBase(uz3);
  ux3 = this.switchBase(ux3.applyEuler(this.rotation3D));
  uy3 = this.switchBase(uy3.applyEuler(this.rotation3D));
  uz3 = this.switchBase(uz3.applyEuler(this.rotation3D));
  this.ux.copy(ux3);
  this.uy.copy(uy3);
  this.uz.copy(uz3);
  // And finally, move the origin to the camera
  this.origin.copy(backup);
  this.origin.copy(this.switchBase(this.camera.position));
  this.camera.position.set(0, 0, 0);
}

Intersector.prototype.switchBase = function(v)
{
  if(v.isVector3)
    return (new THREE.Vector4(
      this.ux.x * v.x + this.uy.x * v.y + this.uz.x * v.z,
      this.ux.y * v.x + this.uy.y * v.y + this.uz.y * v.z,
      this.ux.z * v.x + this.uy.z * v.y + this.uz.z * v.z,
      this.ux.w * v.x + this.uy.w * v.y + this.uz.w * v.z
    )).add(this.origin);
  else if(v.isVector4)
    return this.project(v);
  else
    throw "Can only switch base between Vector3 and Vector4.\nWhat even where you trying to switch mate ?";
}

// Express a vector in the intersector's base
Intersector.prototype.project = function(v)
{
  var nv = v.clone().sub(this.origin);
  return new THREE.Vector3(nv.dot(this.ux), nv.dot(this.uy), nv.dot(this.uz));
}

// TEMPORARY
// Takes an angle
// The rotation is always around the origin
Intersector.prototype.rotate = function(a)
{
  var c = Math.cos(a), s = Math.sin(a);
  var t = this.ux.z;
  this.ux.z = this.ux.z * c + this.ux.w * s;
  this.ux.w = -t * s + this.ux.w * c;
  t = this.uy.z;
  this.uy.z = this.uy.z * c + this.uy.w * s;
  this.uy.w = -t * s + this.uy.w * c;
  t = this.uz.z;
  this.uz.z = this.uz.z * c + this.uz.w * s;
  this.uz.w = -t * s + this.uz.w * c;
  t = this.normal.z;
  this.normal.z = this.normal.z * c + this.normal.w * s;
  this.normal.w = -t * s + this.normal.w * c;

  this.angle += a;
}

// This updates the plane's equation's e factor, so the origin
// needs to be updated BEFORE this gets called
Intersector.prototype.applyMatrix5 = function(m)
{
  this.ux.applyMatrix5(m);
  this.uy.applyMatrix5(m);
  this.uz.applyMatrix5(m);
  this.normal.applyMatrix5(m);
  // Update e
  this.e = this.normal.dot(this.origin);
}

// Cartesian equation for the hyperplane
// ax + by + cz + dw + e = 0
Intersector.prototype.hyperplane = function(v)
{
  return this.normal.dot(v) + this.e;
}

Intersector.prototype.lineSpaceIntersect = function(v1, v2)
{
  var u = new THREE.Vector4();
  u.subVectors(v2, v1).normalize();
  //                                                        never zero
  var t = this.origin.clone().sub(v1).dot(this.normal) / u.dot(this.normal);
  return u.multiplyScalar(t).add(v1);
}

// The intersection of a 3-hyperplane and a geom3 is either nothing,
// one of the vertices, one of the edges, a triangle or the whole thing
Intersector.prototype.intersectTetra = function(v1, v2, v3, v4)
{
  // First case : the hyperplane doesn't intersect with the geom3
  // This means that all its vertices are on the same side of the hyperplane
  // which cuts the space in 2
  var s1 = sign(this.hyperplane(v1)),
      s2 = sign(this.hyperplane(v2)),
      s3 = sign(this.hyperplane(v3)),
      s4 = sign(this.hyperplane(v4));
  if(Math.abs(s1 + s2 + s3 + s4) == 4)
    return [];

  // Second case : if one or more vertices are inside the hyperplane, their number alone
  // determines the shape of the intersection
  var r = [];

  if(s1 == 0) r.push(v1.clone());
  if(s2 == 0) r.push(v2.clone());
  if(s3 == 0) r.push(v3.clone());
  if(s4 == 0) r.push(v4.clone());

  // Third case : the hard one, where the intersection is a triangle or a quad.
  // We intersect all edges with the hyperplane to find points.
  // We know that the line cuts the hyperplane
  if(s1 != s2 && s1 + s2 == 0)
    r.push(this.lineSpaceIntersect(v1, v2));
  if(s1 != s3 && s1 + s3 == 0)
    r.push(this.lineSpaceIntersect(v1, v3));
  if(s1 != s4 && s1 + s4 == 0)
    r.push(this.lineSpaceIntersect(v1, v4));
  if(s2 != s3 && s2 + s3 == 0)
    r.push(this.lineSpaceIntersect(v2, v3));
  if(s2 != s4 && s2 + s4 == 0)
    r.push(this.lineSpaceIntersect(v2, v4));
  if(s3 != s4 && s3 + s4 == 0)
    r.push(this.lineSpaceIntersect(v3, v4));
  return r;
}
