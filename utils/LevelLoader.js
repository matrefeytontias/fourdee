LevelLoader = {};

// String filename, Space4D space4D
LevelLoader.loadFile = function(filename, space4D)
{
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function()
  {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
    {
      LevelLoader.result = LevelLoader.loadJSON(xmlhttp.responseText, space4D);
      window.dispatchEvent(new Event("levelLoaded"));
    }
    LevelLoader.loadFinished = (xmlhttp.readyState == 4);
  }.bind(this);
  xmlhttp.open("GET", filename, true);
  xmlhttp.send();
}

LevelLoader.loadFinished = false;
LevelLoader.result = undefined;

// Returns { THREE.Vector4 startPos, String title },
// builds the level and adds it to space4D.
// String level, Space4D space4D
LevelLoader.loadJSON = function(level, space4D)
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
    materials[name] = mats;
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

    if(objData.position)
    {
      for(var coord in objData.position)
        obj.position[coord] = objData.position[coord];
    }
    if(objData.rotation)
    {
      for(var plane in objData.rotation)
        obj.rotation[plane] = objData.rotation[plane];
    }

    if(objData.selectable)
    {
      obj.setSelectable(true);
      if(objData.rotationLocks)
        obj.lockRotations(objData.rotationLocks);
    }

    space4D.add(obj);
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

  var startPos = new THREE.Vector4();
  for(var coord in data.startingPosition)
    startPos[coord] = data.startingPosition[coord];

  return { startPos: startPos, title: data.title };
}
