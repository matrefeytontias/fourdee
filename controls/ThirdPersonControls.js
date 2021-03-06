function ThirdPersonControls(
  camera3D,
  scene3D,
  space4D,
  manaBar,
  rotation4DPlanes = ["xw", "yw", "zw"],
  keys = new KeySettings(),
  rotation4DSensitivity = 2,
  displacement3DSensitivity = 3)
{
  Controls.call(this, keys);
  this.manaBar = manaBar;
  this.camera3D = camera3D;
  this.scene3D = scene3D;
  this.space4D = space4D;
  this.cameraRotation = camera3D.rotation.clone();
  this.focusedObject4D = null;
  this.distance = 0;
  this.rotation4DPlanes = rotation4DPlanes;
  this.rotation4DSensitivity = rotation4DSensitivity;
  this.displacement3DSensitivity = displacement3DSensitivity;
  this.focusedPosition = new THREE.Vector3();
  this.currentRotation = 0;

  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0.25, 1, 0));
  geometry.vertices.push(new THREE.Vector3(0.25, -0.5, 0));
  geometry.vertices.push(new THREE.Vector3(0.5, -0.5, 0));
  geometry.vertices.push(new THREE.Vector3(0, -1, 0));
  geometry.vertices.push(new THREE.Vector3(-0.5, -0.5, 0));
  geometry.vertices.push(new THREE.Vector3(-0.25, -0.5, 0));
  geometry.vertices.push(new THREE.Vector3(-0.25, 1, 0));
  this.positionMarker = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial());
  this.positionMarker.scale.set(0.3, 0.3, 0.3);
  this.positionMarker.visible = false;
  scene3D.add(this.positionMarker);

  this.setFpControls = function(fpControls)
  {
    this.fpControls = fpControls;
  }

  this.listen = function()
  {
    activeControls = this;
    start();
  }

  this.activate = function(object4D)
  {
    activeControls = this;
    this.positionMarker.position.copy(D4_camera.position);
    this.positionMarker.visible = true;
    this.focusedObject4D = object4D;
    this.focusedPosition = this.focusedObject4D.position3D.clone();
    this.distance = Math.max(object4D.projection.boundingSphere.radius, this.focusedPosition.distanceTo(this.camera3D.position));
    this.mousePosition.x = this.windowHalfX+this.fpControls.mousePosition.x;
    this.onMouseMove({ movementY : 0});
    document.getElementById("cursor").style.display = "none";
    this.changeChurrentRotation(0);
    this.updateRotationInfo();
  }

  this.onMouseMove = function(event)
  {
    this.cameraRotation.y = this.mousePosition.x / this.windowHalfX * Math.PI;
    this.cameraRotation.x -= event.movementY / this.windowHalfY * 0.25 * Math.PI;
    this.cameraRotation.x = Math.min(0.25 * Math.PI, Math.max(-0.25 * Math.PI, this.cameraRotation.x));
  }

  this.onMouseUp = function(){
    this.focusedObject4D = null;
    this.fpControls.activate();
    this.positionMarker.visible = false;
  }
  
  this.onKeyDown = function()
  {
    if(KeySettings.keyPressed[this.keys.shift])
      this.changeChurrentRotation();
  }
  
  this.changeChurrentRotation = function(delta = 1)
  {
    this.currentRotation = (this.currentRotation + delta)%this.rotation4DPlanes.length;
    while( this.focusedObject4D.isRotationLocked(this.rotation4DPlanes[this.currentRotation]) )
      this.currentRotation = (this.currentRotation + 1)%this.rotation4DPlanes.length;
    this.updateRotationInfo();
  }
  
  this.updateRotationInfo = function()
  {
    $("#rotations").show();
    $("#rotations span").css("color", "black");
    $("#rotations span").css("text-shadow", "0 0 0 black");
    for(var i = 0; i < this.rotation4DPlanes.length; i++)
    {
      if(this.focusedObject4D !== null && (!this.focusedObject4D.isRotationLocked(this.rotation4DPlanes[i]))){
        $("#"+this.rotation4DPlanes[i]).css("text-shadow", "0 0 2px white");
      }
    }
    $("#"+this.rotation4DPlanes[this.currentRotation]).css("color", "white");
  }

  this.update = function(dt)
  {
    //4D rotations :
    if(KeySettings.keyPressed[this.keys.ana] && !this.manaBar.empty())
    {
      if(this.rotateAroundMe)
      {
        this.space4D.rotateAround(this.player.position, this.rotation4DPlanes[this.currentRotation], dt * rotation4DSensitivity);
        this.displacementEuler[this.rotation4DPlanes[this.currentRotation]] -= dt * rotation4DSensitivity;
      }
      else if(this.focusedObject4D !== null)
        this.focusedObject4D.rotate(this.rotation4DPlanes[this.currentRotation], - dt * rotation4DSensitivity)
    }

    if(KeySettings.keyPressed[this.keys.kata] && !this.manaBar.empty())
    {
      if(this.rotateAroundMe)
      {
        this.space4D.rotateAround(this.player.position, this.rotation4DPlanes[this.currentRotation], -dt * rotation4DSensitivity);
        this.displacementEuler[this.rotation4DPlanes[this.currentRotation]] += dt * rotation4DSensitivity;
      }
      else if(this.focusedObject4D !== null)
        this.focusedObject4D.rotate(this.rotation4DPlanes[this.currentRotation], dt * rotation4DSensitivity)
    }

    if( this.focusedObject4D !== null && (KeySettings.keyPressed[this.keys.kata] || KeySettings.keyPressed[this.keys.ana])  && !this.manaBar.empty() )
    {
      if(this.focusedObject4D.isRotationLocked(this.rotation4DPlanes[this.currentRotation]))
        this.changeChurrentRotation();
      this.focusedObject4D.dirty = true;
      this.manaBar.use(dt * rotation4DSensitivity);
      this.manaBar.updateDom();
    }

    // Translation around the object
    if(KeySettings.keyPressed[this.keys.up])
      this.distance = Math.max(this.distance - this.displacement3DSensitivity * dt, this.focusedObject4D.projection.boundingSphere.radius);
    if(KeySettings.keyPressed[this.keys.down])
      this.distance += this.displacement3DSensitivity * dt;

    var direction = new THREE.Vector3(Math.cos(this.cameraRotation.y), Math.sin(-this.cameraRotation.x), Math.sin(this.cameraRotation.y));

    direction.multiplyScalar(this.distance);

    var pos = this.focusedPosition.clone();
    pos.add(direction);

    this.camera3D.position.x = pos.x;
    this.camera3D.position.y = pos.y;
    this.camera3D.position.z = pos.z;

    this.camera3D.lookAt(this.focusedPosition);

    // Have the position marker move around a little
    // this.positionMarker.position.y += Math.sin(performance.now() / 1000);
    this.positionMarker.rotation.y += Math.sin(performance.now() / 1000) * 0.5;
  }
}
