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
  D4_scene.add(obj.projection);
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

// (Object4D -> void) callback
Space4D.prototype.visitObjects = function(callback)
{
  for(var i = 0; i < this.children.length; i++)
    callback.bind(this)(this.children[i]);
}

// Updates the children Object4D with their 3D projection if need be
Space4D.prototype.project = function()
{
  var spaceMat = this.buildMatrix5();

  this.visitObjects(function(child)
  {
    var geom4 = child.geometry;
    if(child.dirty && !child.positionalOnly)
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
  });
}

// /!\ Bind to Space4D instance before using
// Partial collision resolution with AA cylinder hitboxes. Axis is either "xz" or "y".
function tryMoveInternal(previousPos, amount, collisionRadius, collisionHeight, axis)
{
  // Check for null movement first
  if(amount.length() == 0)
  {
    // console.log("Movement along " + axis + " is null");
    return { collided: false, movement: amount };
  }

  var collisions = [];
  var sqr = collisionRadius * collisionRadius;
  var nextPos = previousPos.clone().add(amount);
  var h = collisionHeight / 2;

  // Find all faces that collide with the camera's new position
  var i = 0;
  this.visitObjects(function(child)
  {
    var geom3 = child.projection.geometry, vertices = geom3.vertices, faces = geom3.faces;
    for(var j = 0; j < faces.length; j++)
    {
      var face = faces[j];
      var proj = projOnTriangle(nextPos, vertices[face.a], vertices[face.b], vertices[face.c]);
      var dSq = dist2(proj, nextPos);
      // Objects have cylinder hitboxes
      if(Math.abs(proj.y - nextPos.y) < h && dSq < sqr)
        // There has been a collision
        collisions.push({ proj: proj, dSq: dSq, obj: child, face: face});
    }
  });

  if(collisions.length == 0)
    return { collided: false, movement: amount };
  // There has been one or more collisions
  collisions.sort(function (x, y) { return y.dSq - x.dSq; });
  // Only resolve collision with the closest face for now
  var proj = collisions[0].proj;
  var child = collisions[0].obj, vertices = child.projection.geometry.vertices;
  var face = collisions[0].face;
  var faceNorm = cross(sub(vertices, face.b, face.a), sub(vertices, face.a, face.c)).normalize();
  // The movement brings the object right on the intersection point ...
  var distProj = proj.clone().sub(previousPos);
  var newAmount = distProj.clone().normalize();
  var spentAmount;
  if(axis == "xz")
  {
    // We do that by completing the movement and moving the object along the face's normal
    // until it's out of the surface
    var n = dot(proj.clone().sub(previousPos), faceNorm) > 0 ? faceNorm.clone().negate() : faceNorm.clone();
    newAmount = distProj.add(mult(n, collisionRadius));
    newAmount.y = 0;
    spentAmount = amount.clone();
  }
  else // axis == "y"
  {
    // We know for a fact that the intersection point has the required XZ so ...
    newAmount.multiplyScalar(Math.max(0, Math.abs(distProj.y) - h));
    // Here distProj is always colinear to amount
    spentAmount = newAmount.clone();
  }
  var movRemainder = amount.clone().sub(spentAmount);
  // ... and the rest of the movement is carried along the surface by subtracting the projection on the normal
  newAmount.add(movRemainder.sub(faceNorm.multiplyScalar(movRemainder.dot(faceNorm))));
  return { collided: true, movement: newAmount };
}

// Assumes that the player cannot get pinched and that the previousPos is valid
// Player player
// Returns the maximum-length amount that keeps a valid position
// THREE.Vector3 previousPos, THREE.Vector3 amount, float collisionRadius, float collisionHeight
Space4D.prototype.tryForMove = function(previousPos, amount, collisionRadius, collisionHeight)
{
  /*
   * Implementation details
   * We say here that objects have a cylindrical hitbox. It's cool because it's rotation-independent.
   * The movement test is then a 2-pass process : first compute the collisions for the movement along Y,
   * then do the same thing for the movement along the XZ plane.
   * The clever ones probably noticed that this is because the cylinder is invariant along Y.
   */
  var tryMoveInternalBound = tryMoveInternal.bind(this);
  var collided = false;
  var newAmount = new THREE.Vector3(0, amount.y, 0);
  var resultY = tryMoveInternalBound(previousPos, newAmount, collisionRadius, collisionHeight, "y");
  collided = collided || resultY.collided;
  newAmount = amount.clone().sub(resultY.movement);
  newAmount.y = 0;
  var resultXZ =
    tryMoveInternalBound(add(previousPos, resultY.movement), newAmount, collisionRadius, collisionHeight, "xz");
  return { collided: collided || resultXZ.collided, movement: add(resultY.movement, resultXZ.movement) };
}

// Projection of point on triangle
// Code adapted from http://iquilezles.org/www/articles/triangledistance/triangledistance.htm
// Thanks to Íñigo Quílez
// All arguments are THREE.Vector3
function projOnTriangle(p, v1, v2, v3)
{
  var v21 = v2.clone().sub(v1), p1 = p.clone().sub(v1);
  var v32 = v3.clone().sub(v2), p2 = p.clone().sub(v2);
  var v13 = v1.clone().sub(v3), p3 = p.clone().sub(v3);
  var nor = v21.clone().cross(v13);

  if(sign(dot(cross(v21,nor),p1)) +
     sign(dot(cross(v32,nor),p2)) +
     sign(dot(cross(v13,nor),p3))<2.0)
  {
    // 3 edges
    var proj1 = add(v1, mult(v21, clamp(dot(p1, v21) / dot2(v21), 0, 1))),
        proj2 = add(v2, mult(v32, clamp(dot(p2, v32) / dot2(v32), 0, 1))),
        proj3 = add(v3, mult(v13, clamp(dot(p3, v13) / dot2(v13), 0, 1)));

    var d1 = dist2(p, proj1),
        d2 = dist2(p, proj2),
        d3 = dist2(p, proj3);

    if(d1 <= d2 && d1 <= d3)
      return proj1;
    if(d2 <= d1 && d2 <= d3)
      return proj2;
    return proj3;
  }
  // 1 face
  return p.clone().sub(mult(nor, p1.dot(nor) / dot2(nor)));
}

// Convenience functions
var sign = Math.sign;
var min = Math.min;
function dot(a, b) { return a.dot(b); }
function cross(a, b) { return a.clone().cross(b); }
function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
function dot2(a) { return a.dot(a); }
function add(a, b) { return new THREE.Vector3(a.x + b.x, a.y + b.y, a.z + b.z); }
function sub(v, a, b) { return v[a].clone().sub(v[b]); }
function mult(v, f) { return new THREE.Vector3(v.x * f, v.y * f, v.z * f); }
function dist2(a, b) { return dot2(a.clone().sub(b)); }
