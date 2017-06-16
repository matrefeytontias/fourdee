/***************
 * Vector5 API *
 ***************/

function Vector5(x = 0, y = 0, z = 0, w = 0, t = 0)
{
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
  this.t = t;
}

/***************
 * Matrix5 API *
 ***************/

function Matrix5()
{
 this.elements = [
   1, 0, 0, 0, 0,
   0, 1, 0, 0, 0,
   0, 0, 1, 0, 0,
   0, 0, 0, 1, 0,
   0, 0, 0, 0, 1
 ];
}

// float[25] elements
Matrix5.prototype.set = function (elements)
{
    this.elements = elements.slice(0);
}

Matrix5.prototype.identity = function ()
{
  this.elements = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0,
    0, 0, 0, 0, 1
  ];
}

// Matrix5 mat
Matrix5.prototype.multiply = function (mat)
{
  var temp = new Matrix5();
  temp.set(this.elements);
  for(var i = 0; i < 5; i++)
  {
    for(var j = 0; j < 5; j++)
    {
        var r = 0;
        for(var k = 0; k < 5; k++)
            r += temp.elements[i * 5 + k] * mat.elements[k * 5 + j];
        this.elements[i * 5 + j] = r;
    }
  }
}

// String plane (ex : "xz"), float theta
Matrix5.prototype.rotate = function (plane, theta)
{
  const axes = "xyzw";
  var c = Math.cos(theta), s = Math.sin(theta);
  var i = axes.indexOf(plane.charAt(0)), j = axes.indexOf(plane.charAt(1));
  
  if(i == -1 || j == -1)
      throw "The given plane is not reconized. Possible planes are : xy, xz, xw, yz, yw, zw";
  else
  {
    // Optimized multiplication of the current matrix by the new rotation matrix
    for(var k = 0; k < 5; k++)
    {
      var mik5 = this.elements[i + k * 5], mjk5 = this.elements[j + k * 5];
      this.elements[i + k * 5] = c * mik5 - s * mjk5;
      this.elements[j + k * 5] = s * mik5 + c * mjk5;
    }
  }
}

Matrix5.prototype.translate = function (x = 0, y = 0, z = 0, w = 0)
{
  this.elements[4] += x;
  this.elements[9] += y;
  this.elements[14] += z;
  this.elements[19] += w;
}

Matrix5.prototype.scale = function (x = 1, y = 1, z = 1, w = 1)
{
  this.elements[0] *= x;
  this.elements[6] *= y;
  this.elements[12] *= z;
  this.elements[18] *= w;
}

// Matrix5 m
THREE.Vector4.prototype.applyMatrix5 = function (m)
{
  var temp = new Vector5(this.x, this.y, this.z, this.w, 1);
  this.x = m.elements[0] * temp.x + m.elements[1] * temp.y + m.elements[2] * temp.z + m.elements[3] * temp.w + m.elements[4] * temp.t;
  this.y = m.elements[5] * temp.x + m.elements[6] * temp.y + m.elements[7] * temp.z + m.elements[8] * temp.w + m.elements[9] * temp.t;
  this.z = m.elements[10] * temp.x + m.elements[11] * temp.y + m.elements[12] * temp.z + m.elements[13] * temp.w + m.elements[14] * temp.t;
  this.w = m.elements[15] * temp.x + m.elements[16] * temp.y + m.elements[17] * temp.z + m.elements[18] * temp.w + m.elements[19] * temp.t;
  var t = m.elements[20] * temp.x + m.elements[21] * temp.y + m.elements[22] * temp.z + m.elements[23] * temp.w + m.elements[24] * temp.t;
  this.divideScalar(t);
}

/***************
 * Euler4D API *
 ***************/

// float xy, float xz, float xw, float yz, float yw, float zw, String order
function Euler4D(xy = 0, xz = 0, xw = 0, yz = 0, yw = 0, zw = 0, order = "XYXZXWYZYWZW")
{
  this.xy = xy;
  this.xz = xz;
  this.xw = xw;
  this.yz = yz;
  this.yw = yw;
  this.zw = zw;
  this.order = order;
  this.center = new THREE.Vector4();
}

/******************
 * Geometry4D API *
 ******************/

function Geometry4D()
{
  this.vertices4D = [];
}

function BoxGeometry4D(width, height, depth, duth)
{
  Geometry4D.call(this);
  var x = width / 2, y = height / 2, z = depth / 2, w = duth / 2;
  this.vertices4D = [
    new THREE.Vector4(-x, -y, -z, -w),
    new THREE.Vector4(x, -y, -z, -w),
    new THREE.Vector4(x, y, -z, -w),
    new THREE.Vector4(-x, y, -z, -w),
    new THREE.Vector4(-x, y, z, -w),
    new THREE.Vector4(x, y, z, -w),
    new THREE.Vector4(x, -y, z, -w),
    new THREE.Vector4(-x, -y, z, -w),
    new THREE.Vector4(-x, -y, z, w),
    new THREE.Vector4(x, -y, z, w),
    new THREE.Vector4(x, y, z, w),
    new THREE.Vector4(-x, y, z, w),
    new THREE.Vector4(-x, y, -z, w),
    new THREE.Vector4(x, y, -z, w),
    new THREE.Vector4(x, -y, -z, w),
    new THREE.Vector4(-x, -y, -z, w),
  ];
}

BoxGeometry4D.prototype = new Geometry4D();
BoxGeometry4D.prototype.constructor = BoxGeometry4D;

/****************
 * Object4D API *
 ****************/

function Object4D()
{
  this.position = new THREE.Vector4();
  this.rotation = new Euler4D();
  this.scale = 1.;
  this.geometry = undefined;
  this.material = undefined;
  this.projected = undefined; // use your own 3D projection
}

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
  
  //Handle rotations following the order described in this.rotation.order
  for(var i=0; i+1<this.rotation.order.length; i+=2){
    var rotationPlan = this.rotation.order.slice(i, i+2).toLowerCase();
    mat.rotate(rotationPlan, this.rotation[rotationPlan]);
  }
  
  mat.scale(this.scale, this.scale, this.scale, this.scale);
  mat.translate(this.position.x, this.position.y, this.position.z, this.position.w);

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

/**************
 * Proj4D API *
 **************/

// Mostly aesthetic ...
function Proj4D() { }

// Override this in your own projection
// Vector4 v
Proj4D.prototype.project = function (v) { }

// Linear algebra projection : (x, y, z, w) -> (x, y, z, 0)
function OrthoProj()
{
  Proj4D.call(this);
}

OrthoProj.prototype = new Proj4D();

OrthoProj.prototype.project = function (v)
{
  return new THREE.Vector3(v.x, v.y, v.z);
}

/****************
 * Points4D API *
 ****************/

// Geometry4D geometry, THREE.Material material
function Points4D(geometry, material)
{
  Object4D.call(this);
  this.geometry = geometry;
  this.material = material;
  this.projection = new THREE.Points(new THREE.Geometry(), material);
}

Points4D.prototype = new Object4D();
Points4D.prototype.constructor = Points4D;
