var cameraRotation;
var cameraRotationOnMouseDown;

var mousePosition = { x: 0, y : 0};
var mousePositionOnMouseDown = { x: 0, y : 0};

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

window.addEventListener("load", function(){
    
    cameraRotation = new THREE.Euler();
    
    document.body.style.cursor = "-webkit-grab";
    
    document.addEventListener("mousedown", onDocumentMouseDown, false);
})

function onDocumentMouseDown( event ) {

	event.preventDefault();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );

	mousePositionOnMouseDown = { x: event.clientX - windowHalfX , y : event.clientY - windowHalfY};
	cameraRotationOnMouseDown = cameraRotation.clone();

}

function onDocumentMouseMove( event ) {

	var coef_mouse_rotation = document.getElementById("first").checked ? -0.004 : 0.008;
	
	mousePosition =  { x: event.clientX - windowHalfX , y : event.clientY - windowHalfY };
    
    document.body.style.cursor = "-webkit-grabbing";
    
	cameraRotation.y = cameraRotationOnMouseDown.y + ( mousePosition.x - mousePositionOnMouseDown.x ) * coef_mouse_rotation;
	
	if(keyPressed.Shift) cameraRotation.x = cameraRotationOnMouseDown.x + ( mousePosition.y - mousePositionOnMouseDown.y ) * coef_mouse_rotation;


}

function onDocumentMouseUp( event ) {
    
    document.body.style.cursor = "-webkit-grab";

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentMouseOut( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}