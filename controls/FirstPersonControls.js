function FirstPersonControls(
  container,
  camera3D,
  space4D,
  keys = new KeySettings(),
  rotation4DPlans = ["xw", "zw"],
  rotation4DSensitivity = 0.001,
  deplacementSensitivity = 0.002)
{
  Controls.call(this, keys);
  this.container = container;
  this.camera3D = camera3D;
  this.space4D = space4D;
  this.paused = true;

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

    var direction = new THREE.Vector3(Math.cos(this.cameraRotation.y), Math.sin(-this.cameraRotation.x), Math.sin(this.cameraRotation.y));
    var cameraPos4D = new THREE.Vector4(this.camera3D.position.x, this.camera3D.position.y, this.camera3D.position.z, 0);

    //4D rotations :
    if(this.keyPressed[this.keys.ana])
      for(var i = 0; i < rotation4DPlans.length; i++)
        this.space4D.rotateAround(cameraPos4D, rotation4DPlans[i], dt * rotation4DSensitivity);

    if(this.keyPressed[this.keys.kata])
      for(var i = 0; i < rotation4DPlans.length; i++)
        this.space4D.rotateAround(cameraPos4D, rotation4DPlans[i], -dt * rotation4DSensitivity);

    var where = this.camera3D.position.clone();
    where.add(direction);
    this.camera3D.lookAt(where);

    //translation
    var moveDirection = direction.clone();
    moveDirection.y = 0;
    moveDirection.multiplyScalar(deplacementSensitivity*dt);
    if(this.keyPressed[this.keys.up]) this.camera3D.position.add(moveDirection);
    if(this.keyPressed[this.keys.down]) this.camera3D.position.sub(moveDirection);
    if(this.keyPressed[this.keys.left]) this.camera3D.position.add(moveDirection.rotate("y", Math.PI/2));
    if(this.keyPressed[this.keys.right]) this.camera3D.position.add(moveDirection.rotate("y", -Math.PI/2));
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
