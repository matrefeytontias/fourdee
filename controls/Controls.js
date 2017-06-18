var activeControls;

function keySettings(up=90, down=83, left=81, right=68, ana=65, kata=69, space = 32, shift = 16){
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    this.kata = kata;
    this.ana = ana;
    this.space = space;
    this.shift = shift;
}

function Controls(keys = new keySettings()){
    this.keys = keys;
    this.keyPressed = [];
    this.cameraRotation = new THREE.Euler();
    this.mousePosition  = { x: 0, y : 0};
    
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    
    this.listen = function(){
        activeControls = this;
    }
    
    this.update = function(dt){}
    
    this.onMouseUp = function(event){};
    this.onMouseDown = function(event){};
    this.onMouseDrag = function(event){};
    this.onMouseMove = function(event){};
    this.onKeyDown = function(event){};
    this.onKeyUp = function(event){}
    this.onMouseOut = function(event){};
    
    this.defaultOnKeyDown = function(event){
        this.keyPressed[event.keyCode] = true; 
    };
    this.defaultOnKeyUp = function(event){
        this.keyPressed[event.keyCode] = false; 
    };
    
    this.defaultOnMouseMove = function(event){
        this.mousePosition =  { x: event.clientX - this.windowHalfX , y : event.clientY - this.windowHalfY };
    }
}

window.addEventListener("load", function(){
    
    document.addEventListener("keydown", onDocuemntKeyDown, false);
    document.addEventListener("keyup", onDocuemntKeyUp, false);
	
    document.addEventListener("mousedown", onDocumentMouseDown, false);
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    
})


function onDocuemntKeyDown(event){
    activeControls.defaultOnKeyDown(event);
    activeControls.onKeyDown(event);
}

function onDocuemntKeyUp(event){
    activeControls.defaultOnKeyUp(event);
    activeControls.onKeyUp(event);
}

function onDocumentMouseMove(event){
    activeControls.defaultOnMouseMove(event);
	activeControls.onMouseMove(event);
}

function onDocumentMouseDown(event) {

	event.preventDefault();

    document.addEventListener( 'mousemove', onDocumentMouseDrag, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseDrag(event) {
    
    //document.body.style.cursor = "-webkit-grabbing";
    
    activeControls.onMouseDrag(event)
}

function onDocumentMouseUp( event ) {
    
    //document.body.style.cursor = "-webkit-grab";

	document.removeEventListener( 'mousemove', onDocumentMouseDrag, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
	
	activeControls.onMouseUp(event)

}

function onDocumentMouseOut( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseDrag, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    
    activeControls.onMouseOut(event);
}