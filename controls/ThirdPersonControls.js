function ThirdPersonControls(
  camera3D,
  scene3D,
  space4D,
  keys = new KeySettings(),
  rotation4DPlans = ["xw", "zw"],
  draggingSensitivity = 0.008,
  rotation4DSensitivity = 0.002,
  deplacementSensitivity = 0.003)
{
  Controls.call(this, keys);
  this.camera3D = camera3D;
  this.scene3D = scene3D;
  this.space4D = space4D;
  this.cameraRotation = camera3D.rotation.clone();
  this.cameraRotationOnMouseDown = new THREE.Euler();
  this.mousePositionOnMouseDown = {x: 0, y: 0};

  this.listen = function()
  {
      activeControls = this;
      start();
  }

  this.onMouseDown = function(event)
  {
      this.cameraRotationOnMouseDown = this.cameraRotation.clone();
      this.mousePositionOnMouseDown.x = this.mousePosition.x;
      this.mousePositionOnMouseDown.y = this.mousePosition.y;
  }

  this.onMouseDrag = function(event)
  {
    document.body.style.cursor = "-webkit-dragging";

    console.log(this.cameraRotation.x,  this.cameraRotationOnMouseDown.x, this.mousePosition.y - this.mousePositionOnMouseDown.y)

    this.cameraRotation.y = this.cameraRotationOnMouseDown.y + (this.mousePosition.x - this.mousePositionOnMouseDown.x) * draggingSensitivity;

    if(!this.keyPressed[this.keys.shift])
      this.cameraRotation.x = this.cameraRotationOnMouseDown.x + (this.mousePosition.y - this.mousePositionOnMouseDown.y) * draggingSensitivity;
  }

  this.update = function(dt)
  {
    //4D rotations :
    if(this.keyPressed[this.keys.ana])
        for(var i = 0; i < rotation4DPlans.length; i++)
            this.space4D.rotation[rotation4DPlans[i]] += dt * rotation4DSensitivity;

    if(this.keyPressed[this.keys.kata])
        for(var i = 0; i < rotation4DPlans.length; i++)
            this.space4D.rotation[rotation4DPlans[i]] -= dt * rotation4DSensitivity;

    //scene 3D rotation
    this.scene3D.rotation.x = this.cameraRotation.x;
    this.scene3D.rotation.y = this.cameraRotation.y;

    //translation
    if(this.keyPressed[this.keys.up]) this.camera3D.position.z -= deplacementSensitivity * dt;
    if(this.keyPressed[this.keys.down]) this.camera3D.position.z += deplacementSensitivity * dt;
    if(this.keyPressed[this.keys.left]) this.camera3D.position.x -= deplacementSensitivity * dt;
    if(this.keyPressed[this.keys.right]) this.camera3D.position.x += deplacementSensitivity * dt;
  }
}
