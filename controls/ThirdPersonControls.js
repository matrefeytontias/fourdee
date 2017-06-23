function ThirdPersonControls(
  camera3D,
  scene3D,
  space4D,
  rotation4DPlanes = ["xw", "zw"],
  keys = new KeySettings(),
  rotation4DSensitivity = 2)
{
  Controls.call(this, keys);
  this.camera3D = camera3D;
  this.scene3D = scene3D;
  this.space4D = space4D;
  this.cameraRotation = camera3D.rotation.clone();
  this.focusedObject4D = null;
  this.distance = 0;
  this.rotation4DPlanes = rotation4DPlanes;
  this.rotation4DSensitivity = rotation4DSensitivity;
  this.focusedPosition = new THREE.Vector3();
  
  this.setFpControls = function(fpControls)
  {
    this.fpControls = fpControls;
  }

  this.listen = function()
  {
    activeControls = this;
    start();
  }
  
  this.active = function(object4D)
  {
    activeControls = this;
    this.focusedObject4D = object4D;
    this.focusedPosition = this.focusedObject4D.position3D.clone();
    this.distance = this.focusedPosition.distanceTo(this.camera3D.position);
    this.mousePosition.x = this.windowHalfX+this.fpControls.mousePosition.x;
    this.onMouseMove({ movementY : 0})
  }

  this.onMouseMove = function(event)
  {
    this.cameraRotation.y = this.mousePosition.x / this.windowHalfX * Math.PI;
    this.cameraRotation.x += event.movementY / this.windowHalfY * 0.25 * Math.PI;
    this.cameraRotation.x = Math.min(0.25 * Math.PI, Math.max(-0.25 * Math.PI, this.cameraRotation.x));
  }
  
  this.onMouseUp = function(){
    this.focusedObject4D = null;
    this.fpControls.active();
  }

  this.update = function(dt)
  {
    //4D rotations :
    if(this.keyPressed[this.keys.ana])
    {
      for(var i = 0; i < this.rotation4DPlanes.length; i++)
      {
        if(this.rotateAroundMe)
        {
          this.space4D.rotateAround(this.player.position, this.rotation4DPlanes[i], dt * rotation4DSensitivity);
          this.displacementEuler[this.rotation4DPlanes[i]] -= dt * rotation4DSensitivity;
        }
        else if(this.focusedObject4D !== null)
          this.focusedObject4D.rotation[this.rotation4DPlanes[i]] -= dt * rotation4DSensitivity;
      }
    }

    if(this.keyPressed[this.keys.kata])
    {
      for(var i = 0; i < this.rotation4DPlanes.length; i++)
      {
        if(this.rotateAroundMe)
        {
          this.space4D.rotateAround(this.player.position, this.rotation4DPlanes[i], -dt * rotation4DSensitivity);
          this.displacementEuler[this.rotation4DPlanes[i]] += dt * rotation4DSensitivity;
        }
        else if(this.focusedObject4D !== null)
          this.focusedObject4D.rotation[this.rotation4DPlanes[i]] += dt * rotation4DSensitivity;
      }
    }

    if( this.focusedObject4D !== null && (this.keyPressed[this.keys.kata] || this.keyPressed[this.keys.ana]) )
    {
      this.focusedObject4D.dirty = true;
    }


    var direction = new THREE.Vector3(Math.cos(this.cameraRotation.y), Math.sin(-this.cameraRotation.x), Math.sin(this.cameraRotation.y));
    
    direction.multiplyScalar(this.distance);
    
    var pos = this.focusedPosition.clone();
    pos.add(direction);
    
    this.camera3D.position.x = pos.x;
    this.camera3D.position.y = pos.y;
    this.camera3D.position.z = pos.z;
    
    this.camera3D.lookAt(this.focusedPosition);
    
    //translation
    /*
    if(this.keyPressed[this.keys.up]) this.camera3D.position.z -= deplacementSensitivity * dt;
    if(this.keyPressed[this.keys.down]) this.camera3D.position.z += deplacementSensitivity * dt;
    if(this.keyPressed[this.keys.left]) this.camera3D.position.x -= deplacementSensitivity * dt;
    if(this.keyPressed[this.keys.right]) this.camera3D.position.x += deplacementSensitivity * dt; */
  }
}
