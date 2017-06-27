function MobileControls(space, camera)
{
  Controls.call(this);
  this.space = space;
  this.camera = camera;
  
  this.selectedIndex = 0;
  this.aimedX = this.space.children[this.selectedIndex].position.x - 0.5;
  this.speed = 4; //unit/second
  this.rotationSpeed = 1;
  this.rotations = ["xw", "zw", "yw"];
  this.selectedRotation = 0;
  this.wfToggled = false;
  
  this.onMouseDown = function(event)
  {
    if(event.clientX < this.windowHalfX * 1/2)
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
    else if(event.clientX > this.windowHalfX * 3/2)
      this.selectedIndex = Math.min(this.space.children.length - 1, this.selectedIndex + 1); 
    else
    {
      this.space.children[this.selectedIndex].toggleWireframe();
      this.wfToggled = true;
    }
    this.aimedX = this.space.children[this.selectedIndex].position.x - 0.5;
  }
  
  this.onMouseUp = function()
  {
    if(this.wfToggled)
    {
      this.space.children[this.selectedIndex].toggleWireframe();
      this.selectedRotation = (this.selectedRotation + 1)%3;
    }
    this.wfToggled = false;
  }
  
  this.update = function(dt)
  {
      
    if( Math.abs(this.camera.position.x - this.aimedX) < 0.1 )
    {
      camera.lookAt(this.space.children[this.selectedIndex].position);
      this.space.children[this.selectedIndex].rotate(this.rotations[this.selectedRotation], dt * this.rotationSpeed);
    }
    else
      camera.position.x -= dt * this.speed * (this.camera.position.x - this.aimedX) / Math.abs(this.camera.position.x - this.aimedX);
  }
}