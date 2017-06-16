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

// float theta
Matrix5.prototype.makeRotateXY = function (theta)
{
 var c = Math.cos(theta), s = Math.sin(theta);
 this.elements = [
   c,  s, 0, 0, 0,
   -s, c, 0, 0, 0,
   0,  0, 1, 0, 0,
   0,  0, 0, 1, 0,
   0,  0, 0, 0, 1
 ];
 return this;
}

Matrix5.prototype.makeRotateXZ = function (theta)
{
 var c = Math.cos(theta), s = Math.sin(theta);
 this.elements = [
   c,  0, s, 0, 0,
   0,  1, 0, 0, 0,
   -s, 0, c, 0, 0,
   0,  0, 0, 1, 0,
   0,  0, 0, 0, 1
 ];
 return this;
}

Matrix5.prototype.makeRotateXW = function (theta)
{
 var c = Math.cos(theta), s = Math.sin(theta);
 this.elements = [
   c,  0, 0, s, 0,
   0,  1, 0, 0, 0,
   0,  0, 1, 0, 0,
   -s, 0, 0, c, 0,
   0,  0, 0, 0, 1
 ];
 return this;
}

Matrix5.prototype.makeRotateYZ = function (theta)
{
 var c = Math.cos(theta), s = Math.sin(theta);
 this.elements = [
   1,  0, 0, 0, 0,
   0,  c, s, 0, 0,
   0, -s, c, 0, 0,
   0,  0, 0, 1, 0,
   0,  0, 0, 0, 1
 ];
 return this;
}

Matrix5.prototype.makeRotateYW = function (theta)
{
 var c = Math.cos(theta), s = Math.sin(theta);
 this.elements = [
   1,  0, 0, 0, 0,
   0,  c, 0, s, 0,
   0,  0, 1, 0, 0,
   0, -s, 0, c, 0,
   0,  0, 0, 0, 1
 ];
 return this;
}

Matrix5.prototype.makeRotateZW = function (theta)
{
 var c = Math.cos(theta), s = Math.sin(theta);
 this.elements = [
   1, 0,  0, 0, 0,
   0, 1,  0, 0, 0,
   0, 0,  c, s, 0,
   0, 0, -s, c, 0,
   0, 0,  0, 0, 1
 ];
 return this;
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
  
  return this;
}

// String plane (ex : "XZ"), float theta
Matrix5.prototype.rotate = function (plane, theta)
{
  var rot = new Matrix5();
  return this.multiply(rot["makeRotate" + plane.toUpperCase()](theta));
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
  return this;
}
