// HTMLDOMElement container, THREE.Vector4 player.position, THREE.Camera camera3D,
// Space4D space4D, KeySettings keys, String[] rotation4DPlanes,
// float rotation4DSensitivity, float displacementSensitivity
function FirstPersonControls(
  container,
  player,
  camera3D,
  space4D,
  keys = new KeySettings(),
  rotation4DPlanes = ["xw", "zw"],
  rotation4DSensitivity = 1,
  displacementSensitivity = 4)
{
  Controls.call(this, keys);
  this.container = container;
  this.player = player;
  this.canJump = false;
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

    //4D rotations :
    if(this.keyPressed[this.keys.ana])
    {
      for(var i = 0; i < rotation4DPlanes.length; i++)
      {
        this.space4D.rotateAround(this.player.position, rotation4DPlanes[i], dt * rotation4DSensitivity);
        this.displacementEuler[rotation4DPlanes[i]] -= dt * rotation4DSensitivity;
      }
    }

    if(this.keyPressed[this.keys.kata])
    {
      for(var i = 0; i < rotation4DPlanes.length; i++)
      {
        this.space4D.rotateAround(this.player.position, rotation4DPlanes[i], -dt * rotation4DSensitivity);
        this.displacementEuler[rotation4DPlanes[i]] += dt * rotation4DSensitivity;
      }
    }

    var direction = new THREE.Vector3(Math.cos(this.cameraRotation.y), Math.sin(-this.cameraRotation.x), Math.sin(this.cameraRotation.y));

    var where = this.camera3D.position.clone();
    where.add(direction);
    this.camera3D.lookAt(where);

    //translation
    if(this.keyPressed[this.keys.up] || this.keyPressed[this.keys.down] || this.keyPressed[this.keys.left] || this.keyPressed[this.keys.right])
    {
      var moveDirection = direction.clone(), movement = new THREE.Vector3();
      moveDirection.y = 0;
      moveDirection.multiplyScalar(displacementSensitivity*dt);

      if(this.keyPressed[this.keys.up]) movement.add(moveDirection);
      if(this.keyPressed[this.keys.down]) movement.sub(moveDirection);
      if(this.keyPressed[this.keys.left]) movement.add(moveDirection.clone().rotate("y", Math.PI/2));
      if(this.keyPressed[this.keys.right]) movement.add(moveDirection.clone().rotate("y", -Math.PI/2));

      movement.y = 0;
      this.player.velocity3D.add(movement);
    }

    // Add gravity
    this.player.velocity3D.y += -D4_GRAVITY * dt;
    // Eventually add a jump
    if(this.canJump && this.keyPressed[this.keys.space])
      this.player.velocity3D.y += D4_JUMP;
    var data = space4D.tryForMove(this.camera3D.position, this.player.velocity3D, this.player.radius);
    this.player.velocity3D = data.movement;
    this.canJump = (data.collided && this.player.velocity3D.y == 0);

    var movement4D = new THREE.Vector4(this.player.velocity3D.x, 0, this.player.velocity3D.z, 0);
    movement4D.applyEuler4D(this.displacementEuler);

    this.camera3D.position.add(this.player.velocity3D);
    this.player.position.add(movement4D);

    // Bring the velocity back to zero by applying friction to the XZ part
    var backupY = this.player.velocity3D.y;
    this.player.velocity3D.y = 0;
    var velLen = this.player.velocity3D.length();
    if(velLen < D4_FRICTION * dt)
      this.player.velocity3D.set(0, 0, 0);
    else
      this.player.velocity3D.multiplyScalar((velLen - D4_FRICTION * dt) / velLen);
    this.player.velocity3D.y = backupY;
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
    else window.setTimeout(resize, 100);
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
