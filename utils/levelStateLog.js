function levelStateLog()
{
  var str = "";
  for(var i = 0; i < D4_space.children.length; i++)
  {
    str += "["
    str += D4_space.children[i].rotation.xy + " ,";
    str += D4_space.children[i].rotation.xz + " ,";
    str += D4_space.children[i].rotation.xw + " ,";
    str += D4_space.children[i].rotation.yz + " ,";
    str += D4_space.children[i].rotation.yw + " ,";
    str += D4_space.children[i].rotation.zw + "],\n";
  }
  return str;
}