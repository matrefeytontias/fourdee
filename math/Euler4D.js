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
