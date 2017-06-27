/*************
 * Cell4 API *
 *************/

function Cell4(a, b, c, d)
{
  this.a = a; this.b = b; this.c = c; this.d = d;
  this.materialIndex = 0;
}

Cell4.prototype.toString = function()
{
  return "a: " + this.a + ", b: " + this.b + ", c: " + this.c + ", d: " + this.d + "\n";
}
