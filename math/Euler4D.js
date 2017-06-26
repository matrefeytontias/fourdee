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

Euler4D.prototype.clone = function()
{
  var clone = new Euler4D(this.xy, this.xz, this.xw, this.yz, this.yw, this.zw, this.order);
  clone.center = this.center.clone();
  return clone;
}

Euler4D.prototype.difference = function(euler4d)
{
  return Math.sqrt(
    Math.pow((this.xy - euler4d.xy)%(2*Math.PI), 2) +
    Math.pow((this.xz - euler4d.xz)%(2*Math.PI), 2) + 
    Math.pow((this.xw - euler4d.xw)%(2*Math.PI), 2) + 
    Math.pow((this.yz - euler4d.yz)%(2*Math.PI), 2) + 
    Math.pow((this.yw - euler4d.yw)%(2*Math.PI), 2) +  
    Math.pow((this.zw - euler4d.zw)%(2*Math.PI), 2)
  )
}

Euler4D.prototype.isEqualTo = function(euler4d, precision = 0.2)
{
  return this.difference(euler4d) <= precision;
}

THREE.Vector4.prototype.applyEuler4D = function(euler)
{
  var mat = new Matrix5();

  // Handle rotations following the order described in euler.order
  for(var i = 0; i + 1 < euler.order.length; i += 2)
  {
    var rotationPlane = euler.order.slice(i, i + 2);
    var theta = euler[rotationPlane.toLowerCase()];
    if(theta != 0)
      mat.rotate(rotationPlane, theta);
  }

  return this.applyMatrix5(mat);
}


