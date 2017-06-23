function Cylinder4DGeometry4D(radius=1, height=1, duth=1, precision=10)
{
  Geometry4D.call(this);
  var mat = new Matrix5();
  mat.scale(radius, height, radius, duth);
  
  //vertices construction
  //bottom circle w=-1/2, top circle w=-1/2, bottom circle w=1/2, top circle w=1/2
  var precision = 10;
  for(var w = -1/2; w < 1; w++)
  {
    for(var y = -1/2; y < 1; y++)
    {
      this.vertices4D.push(new THREE.Vector4(0, y, 0, w))
      for(var i = 0; i < precision; i++)
        this.vertices4D.push(new THREE.Vector4(Math.cos(i/precision*2*Math.PI), y, Math.sin(i/precision*2*Math.PI), w));
    }
  }
  
  for(var f = 0; f < 4; f++)
  {
    var d = (precision + 1) * f;
    console.log(d);
    for(var i = 0; i < precision - 1; i++)
      this.faces.push(new THREE.Face3(0 + d, i + 1 + d, i + 2 + d));
    this.faces.push(new THREE.Face3(0 + d, precision + d, 1 + d));
  }
  
  
  
  var gap = 2 * (precision + 1);
  for(var f = 0; f < 2; f++)
  {
    var d = gap * f;
    console.log(d);
    for(var i = 0; i < precision - 1; i++)
      this.faces.push(new THREE.Face3(i + 1 + d, i + 2 + d, i + 2 + d + precision + 1));
      //this.faces.push(new THREE.Face3(i + 2 + d + precision + 1, i + 1 + d + precision + 1, i + 1 + d));
    //this.faces.push(new THREE.Face3(0 + d, precision + d, 1 + d));
  }

}
