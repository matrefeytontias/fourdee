THREE.Matrix4.prototype.print = function(){
  s = "";
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 4; j++){
      var c = ( Math.round(this.elements[i*4+j]*100)/100 ) + "";
      s += c + "      ".slice(c.length);
    }
    if(i < 4) s += "\n";
  }
  console.log(s);
}

// String plane (ex : "xz"), float theta
THREE.Matrix4.prototype.rotate = function(plane, theta){
  var axes = "xyzw";
  var c = Math.cos(theta), s = Math.sin(theta);
  var i = axes.indexOf(plane.charAt(0)), j = axes.indexOf(plane.charAt(1));
  // i / j are the numeral of the 1st / 2nd axe of the plane
  
  if(i == -1 || j == -1) throw "the given plane is not reconized. Possible planes are : xy, xz, xw, yz, yw, zw";
  else{
    //Optimized multiplication of the matrix by the good roation matrix
    for(var k=0; k<4; k++){
      var mik4 = this.elements[i+k*4], mjk4 = this.elements[j+k*4];
      this.elements[i+k*4] = c * mik4 - s * mjk4;
      this.elements[j+k*4] = s * mik4 + c * mjk4;
    }
  }
}


// String plane (ex : "xz"), float theta
THREE.Vector4.prototype.rotate = function(plane, theta){
  var c = Math.cos(theta), s = Math.sin(theta);
  
  var a1 = plane.charAt(0), a2 = plane.charAt(1);

  var c1 = this[a1], c2 = this[a2];
  
  this[a1] = c * c1 - s * c2;
  this[a2] = s * c1 + c * c2;
}