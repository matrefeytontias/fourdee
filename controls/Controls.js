var activeControls;

function KeySettings(up=90, down=83, left=81, right=68, ana=65, kata=69, space = 32, shift = 16, enter = 13)
{
  this.up = up;
  this.down = down;
  this.left = left;
  this.right = right;
  this.kata = kata;
  this.ana = ana;
  this.space = space;
  this.shift = shift;
  this.enter = enter;
}

KeySettings.keyPressed = [];

function Controls(keys = new KeySettings())
{
  this.keys = keys;
  this.cameraRotation = new THREE.Euler();
  this.mousePosition  = { x: 0, y: 0};
  this.paused = false;

  this.windowHalfX = window.innerWidth / 2;
  this.windowHalfY = window.innerHeight / 2;

  this.listen = function()
  {
    activeControls = this;
  };

  this.update = function(dt) { };

  this.onMouseUp = function(event) { };
  this.onMouseDown = function(event) { };
  this.onMouseDrag = function(event) { };
  this.onMouseMove = function(event) { };
  this.onKeyDown = function(event) { };
  this.onKeyUp = function(event) { }
  this.onMouseOut = function(event) { };
  this.onFullscreenChange = function() { };
  this.onPointerLockChange = function() { };

  this.defaultOnKeyDown = function(event)
  {
    KeySettings.keyPressed[event.keyCode] = true;
  };
  this.defaultOnKeyUp = function(event)
  {
    KeySettings.keyPressed[event.keyCode] = false;
  };

  this.defaultOnMouseMove = function(event)
  {
    //this.mousePosition =  { x: event.clientX - this.windowHalfX , y : event.clientY - this.windowHalfY };
    this.mousePosition.x += event.movementX;
    this.mousePosition.y += event.movementY;
  };
}

window.addEventListener("load", function()
{
  document.addEventListener("keydown", onDocumentKeyDown, false);
  document.addEventListener("keyup", onDocumentKeyUp, false);

  document.addEventListener("mousedown", onDocumentMouseDown, false);
  document.addEventListener("mousemove", onDocumentMouseMove, false);

  document.addEventListener('fullscreenchange', onDocumentFullscreenChange, false);
  document.addEventListener('mozfullscreenchange', onDocumentFullscreenChange, false);
  document.addEventListener('webkitfullscreenchange', onDocumentFullscreenChange, false);

  document.addEventListener('pointerlockchange', onDocumentPointerLockChange, false);
  document.addEventListener('mozpointerlockchange', onDocumentPointerLockChange, false);
  document.addEventListener('webkitpointerlockchange', onDocumentPointerLockChange, false);
});

function onDocumentKeyDown(event)
{
  activeControls.defaultOnKeyDown(event);
  activeControls.onKeyDown(event);
}

function onDocumentKeyUp(event)
{
  activeControls.defaultOnKeyUp(event);
  activeControls.onKeyUp(event);
}

function onDocumentMouseMove(event)
{
  event.movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  event.movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

  activeControls.defaultOnMouseMove(event);
	activeControls.onMouseMove(event);
}

function onDocumentMouseDown(event)
{
	event.preventDefault();

  document.addEventListener( 'mousemove', onDocumentMouseDrag, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );

	activeControls.onMouseDown(event);
}

function onDocumentMouseDrag(event)
{
    //document.body.style.cursor = "-webkit-grabbing";
    activeControls.onMouseDrag(event)
}

function onDocumentMouseUp(event)
{
  //document.body.style.cursor = "-webkit-grab";
	document.removeEventListener( 'mousemove', onDocumentMouseDrag, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
	activeControls.onMouseUp(event)
}

function onDocumentMouseOut(event)
{
	document.removeEventListener( 'mousemove', onDocumentMouseDrag, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  activeControls.onMouseOut(event);
}

function onDocumentFullscreenChange()
{
  activeControls.onFullscreenChange();
}

function onDocumentPointerLockChange()
{
  activeControls.onPointerLockChange();
}

function OnDocumentResize(){

}


//TODO ? Handle compatibility
function pointerLockError()
{
  console.log("An error occured during pointer locking.");
}

document.addEventListener('pointerlockerror', pointerLockError, false);
document.addEventListener('mozpointerlockerror', pointerLockError, false);
document.addEventListener('webkitpointerlockerror', pointerLockError, false);
