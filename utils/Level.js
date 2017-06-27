function Level(container, space4D, camera, scene)
{
  this.scene = scene;
  this.space4D = space4D;
  this.container = container;
  this.camera = camera;
  
  this.elements = [];
  this.startText = "Let's go !";
  this.startText = undefined;
  this.endText = undefined;
  this.levelEnd = undefined;
  this.fpControls = undefined;
  this.tpControls = undefined;
  this.player = new Player();
  this.endTextDom = $("end-text");
  this.startTextDom = $("start-text");
}

Level.prototype.initialize = function(loadedLevel)
{
  this.title = loadedLevel.title;
  this.startText = loadedLevel.startText;
  this.endText = loadedLevel.endText;
  this.levelEnd = loadedLevel.levelEnd;
  
  this.camera.position.copy(loadedLevel.startPos);
  
  var manaBar = new ManaBar(10);
  
  this.fpControls = new FirstPersonControls(this, this.container, this.player, this.camera, this.space4D);
  this.tpControls = new ThirdPersonControls(this.camera, this.scene, this.space4D, manaBar, loadedLevel.userRotations);
  this.fpControls.listen();

  this.fpControls.setTpControls(this.tpControls);
  this.tpControls.setFpControls(this.fpControls);
}

Level.prototype.add = function(object4D)
{
  this.space4D.add(object4D);
  this.elements.push(object4D);
}

Level.prototype.checkEnd = function()
{
  if(this.levelEnd == "all locked")
  {
    for(var i = 0; i < this.elements.length; i++)
    {
      if(this.elements[i].endRotation !== null && this.elements[i].selectable)
        return false;
    }
    return true;
  }
  return false;
}

Level.prototype.end = function()
{
  alert("bravo")
  //this.endTextDom.animate({opacity : 0}, 1000);
}