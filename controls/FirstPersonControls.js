// HTMLDOMElement container, THREE.Vector4 characterPos4D, THREE.Camera camera3D,
// Space4D space4D, KeySettings keys, String[] rotation4DPlanes,
// float rotation4DSensitivity, float displacementSensitivity
function FirstPersonControls(
  container,
  characterPos4D,
  camera3D,
  space4D,
  keys = new KeySettings(),
  rotation4DPlanes = ["xw", "zw"],
  rotation4DSensitivity = 0.001,
  displacementSensitivity = 0.002)
{
  Controls.call(this, keys);
  this.container = container;
  this.characterPos4D = characterPos4D;
  this.camera3D = camera3D;
  this.space4D = space4D;
  this.paused = true;
  this.displacementEuler = new Euler4D();

  this.onMouseMove = function(event)
  {
    if(this.paused) return;
    this.cameraRotation.y = this.mousePosition.x / this.windowHalfX * Math.PI;
    this.cameraRotation.x += event.movementY / this.windowHalfY * 0.25 * Math.PI;
    this.cameraRotation.x = Math.min(0.25 * Math.PI, Math.max(-0.25 * Math.PI, this.cameraRotation.x));
  }

  this.onKeyDown = function(event)
  {
    if(this.paused && this.keyPressed[this.keys.enter])
    {
      this.container.requestFullscreen = this.container.requestFullscreen || this.container.mozRequestFullscreen || this.container.mozRequestFullScreen ||  this.container.webkitRequestFullscreen;
      this.container.requestFullscreen();
    }
  }

  this.update = function(dt)
  {
    if(this.paused) return;

    // characterPos4D = new THREE.Vector4(this.camera3D.position.x, this.camera3D.position.y, this.camera3D.position.z, 0);

    //4D rotations :
    if(this.keyPressed[this.keys.ana])
    {
      for(var i = 0; i < rotation4DPlanes.length; i++)
      {
        this.space4D.rotateAround(this.characterPos4D, rotation4DPlanes[i], dt * rotation4DSensitivity);
        this.displacementEuler[rotation4DPlanes[i]] -= dt * rotation4DSensitivity;
      }
    }

    if(this.keyPressed[this.keys.kata])
    {
      for(var i = 0; i < rotation4DPlanes.length; i++)
      {
        this.space4D.rotateAround(this.characterPos4D, rotation4DPlanes[i], -dt * rotation4DSensitivity);
        this.displacementEuler[rotation4DPlanes[i]] += dt * rotation4DSensitivity;
      }
    }

    var direction = new THREE.Vector3(Math.cos(this.cameraRotation.y), Math.sin(-this.cameraRotation.x), Math.sin(this.cameraRotation.y));

    var where = this.camera3D.position.clone();
    where.add(direction);
    this.camera3D.lookAt(where);

    //translation
    var moveDirection = direction.clone();
    if(this.keyPressed[this.keys.up] || this.keyPressed[this.keys.down] || this.keyPressed[this.keys.left] || this.keyPressed[this.keys.right])
    {
      moveDirection.y = 0;
      moveDirection.multiplyScalar(displacementSensitivity*dt);
      var movement = new THREE.Vector3();

      if(this.keyPressed[this.keys.up]) movement.add(moveDirection);
      if(this.keyPressed[this.keys.down]) movement.sub(moveDirection);
      if(this.keyPressed[this.keys.left]) movement.add(moveDirection.clone().rotate("y", Math.PI/2));
      if(this.keyPressed[this.keys.right]) movement.add(moveDirection.clone().rotate("y", -Math.PI/2));;

      var movement4D = new THREE.Vector4(movement.x, 0, movement.z, 0);
      movement4D.applyEuler4D(this.displacementEuler);

      this.camera3D.position.add(movement);
      this.characterPos4D.add(movement4D);
    }
    else
    {
      moveDirection.multiplyScalar(0);
    }
  }

  this.onFullscreenChange = function()
  {
    if (document.webkitFullscreenElement === this.container || document.mozFullscreenElement === this.container || document.mozFullScreenElement === this.container || document.fullscreenElement === this.container)
    {
      this.container.requestPointerLock = this.container.requestPointerLock || this.container.mozRequestPointerLock || this.container.webkitRequestPointerLock;
      this.container.requestPointerLock();
      this.paused = false;
    }
    else
      this.paused = true;
  }

  this.onPointerLockChange = function()
  {
    if (document.mozPointerLockElement === this.container || document.webkitPointerLockElement === this.container || document.pointerLockElement === this.container)
      console.log("Pointer Lock was successful.");
    else
      console.log("Pointer Lock was lost.");
    if(this.container.innerHTML.length < 2) window.setTimeout(start, 100);
  }
}

THREE.Vector3.prototype.rotate = function(axe, theta)
{
  var plan = "xyz".replace(axe, "");
  var a1 = plan.charAt(0), a2 = plan.charAt(1);
  var c = Math.cos(theta), s = Math.sin(theta);
  va1 = this[a1];
  this[a1] = c * this[a1] + s * this[a2];
  this[a2] = - s * va1 + c * this[a2];
  return this;
}
