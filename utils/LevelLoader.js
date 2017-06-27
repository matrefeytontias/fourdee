LevelLoader = {};

// String filename, Space4D levelObject
LevelLoader.loadFile = function(filename, levelObject)
{
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
    {
      LevelLoader.result = LevelLoader.loadJSON(xmlhttp.responseText, levelObject);
      window.dispatchEvent(new Event("levelLoaded"));
    }
    LevelLoader.loadFinished = (xmlhttp.readyState == 4);
  }.bind(this);
  xmlhttp.overrideMimeType("application/json");
  xmlhttp.open("GET", filename, true);
  xmlhttp.send();
}

LevelLoader.loadFinished = false;
LevelLoader.result = undefined;

// Returns { THREE.Vector4 startPos, String title },
// builds the level and adds it to levelObject.
// String level, Space4D levelObject
LevelLoader.loadJSON = function(level, levelObject)
{
  var data = JSON.parse(level);

  // Read and construct the level's materials
  var materials = {};
  for(var i = 0; i < data.materials.length; i++)
  {
    var mat = data.materials[i];
    // Construct the material from the class name and the options
    if(mat.options.side) mat.options.side = THREE[mat.options.side];

    materials[mat.name] = new window.THREE["Mesh" + mat.type + "Material"](mat.options);
  }

  // Build material packages for using several materials per mesh
  for(var name in data.materialPackages)
  {
    var mats = [];
    for(var i = 0; i < data.materialPackages[name].length; i++)
      mats.push(materials[data.materialPackages[name][i]].clone());
    mats.clone = function(){ var m = []; for(var i=0; i < this.length; i++) m.push(this[i]); return m; };
    materials[name] = mats;
  }
  
  //Read and constructs the level's projectors
  var projectors = {};
  if(data.projectors)
  {
    for(var i = 0; i < data.projectors.length; i++)
    {
      var proj = data.projectors[i].type == "StereoProj" ? 
        new StereoProj(new THREE.Vector4(data.projectors[i].options[0], data.projectors[i].options[1], data.projectors[i].options[2], data.projectors[i].options[3]), data.projectors[i].options[4] ) :
        new OrthoProj();
      projectors[data.projectors[i].name] = proj;   
    }
  }

  // Read and construct the level's objects
  var objects = {};
  for(var i = 0; i < data.objects.length; i++)
  {
    var objData = data.objects[i];
    var type = window[objData.geometry + "Geometry4D"];
    var geom = new (type.bind.apply(type, [type].concat(objData.options)))();

    var obj;
    if(Array.isArray(objData.material))
    {
      obj = new LevelObject(geom, materials[objData.material[0]].clone());
      for(var j = 1; j < objData.material.length; j++)
        obj.add3DMeshMaterial(materials[objData.material[j]].clone());
    }
    else
      obj = new LevelObject(geom, materials[objData.material].clone());

    objects[objData.name] = obj;

    if(objData.rotation)
    {
      for(var plane in objData.rotation)
      {
        obj.rotation[plane] = objData.rotation[plane];
      }
    }

    if(objData.selectable)
    {
      obj.setSelectable(true);
      if(objData.rotationLocks)
        obj.rotationLocks = objData.rotationLocks;
    }
    
    if(objData.projector)
      obj.geometry.projector = projectors[objData.projector];

  }
  
  for(var i in data.levelStructure)
  {
    var element = objects[data.levelStructure[i][0]].clone();
    element.position.x = data.levelStructure[i][1];
    element.position.y = data.levelStructure[i][2];
    element.position.z = data.levelStructure[i][3];
    if(data.endLocks[i])
      element.endRotation = new Euler4D(data.endLocks[i][0], data.endLocks[i][1], data.endLocks[i][2], data.endLocks[i][3], data.endLocks[i][4], data.endLocks[i][5]);
    if(objects[data.levelStructure[i][0]].rotationLocks) 
      element.lockRotations(objects[data.levelStructure[i][0]].rotationLocks);
    levelObject.add(element);
  }

  function makeArgs(cmdLine, start, end, converter)
  {
    var r = [];
    for(var i = start; i < end; i++)
      r.push(converter(cmdLine[i]));
    return r;
  }

  // Execute the script commands
  if(data.scripts)
  {
    for(var i = 0; i < data.scripts.length; i++)
    {
      var cmd = data.scripts[i].split(/ *, */); // split on commas and ignore spaces around them
      switch(cmd[0])
      {
        case "removeFaceGroups":
          objects[cmd[1]].geometry.removeFaceGroups(makeArgs(cmd, 2, cmd.length, parseInt));
          break;
        case "filterFaceGroups":
          objects[cmd[1]].geometry.filterFaceGroups(makeArgs(cmd, 2, cmd.length, parseInt));
          break;
        case "linkObjects":
          objects[cmd[2]].rotation = objects[cmd[1]].rotation;
          break;
      }
    }
  }
  
  if(data.jump == false)
    D4_JUMP = 0;

  var startPos = new THREE.Vector4();
  for(var coord in data.startingPosition)
    startPos[coord] = data.startingPosition[coord];

  return { 
    startPos : startPos, 
    title : data.title, 
    userRotations : data.userRotations, 
    startText : data.startText, 
    endText : data.endText,
    levelEnd : data.levelEnd
  };
}
