var cameraRotation;
var cameraRotationOnMouseDown;

var mousePosition = { x: 0, y : 0};
var mousePositionOnMouseDown = { x: 0, y : 0};

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

window.addEventListener("load", function(){
    
    cameraRotation = new THREE.Euler();
    
    document.addEventListener("mousedown", onDocumentMouseDown, false);
    document.addEventListener("mousemove", onDocumentMouseMove, false);
})

function onDocumentMouseMove( event ){
	
	document.body.style.cursor = document.getElementById("drag").checked ? "-webkit-grab" : "none";
	
	mousePosition =  { x: event.clientX - windowHalfX , y : event.clientY - windowHalfY };
	
	if(!document.getElementById("drag").checked){
		
		cameraRotation.y = mousePosition.x / windowHalfX * Math.PI;
		
		cameraRotation.x = mousePosition.y / windowHalfY * 0.25 * Math.PI;
	}
}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	if(document.getElementById("drag").checked){
		document.addEventListener( 'mousemove', onDocumentMouseDrag, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.addEventListener( 'mouseout', onDocumentMouseOut, false );
	
		mousePositionOnMouseDown = { x: event.clientX - windowHalfX , y : event.clientY - windowHalfY};
		cameraRotationOnMouseDown = cameraRotation.clone();
	}

}

function onDocumentMouseDrag( event ) {
    
    document.body.style.cursor = "-webkit-grabbing";
    
    
    var coef = document.getElementById("first").checked ? -0.004 : 0.008;
    	
	cameraRotation.y = cameraRotationOnMouseDown.y + ( mousePosition.x - mousePositionOnMouseDown.x ) * coef;
			
	if(keyPressed.Shift) cameraRotation.x = cameraRotationOnMouseDown.x + ( mousePosition.y - mousePositionOnMouseDown.y ) * coef;
    
}

function onDocumentMouseUp( event ) {
    
    document.body.style.cursor = "-webkit-grab";

	document.removeEventListener( 'mousemove', onDocumentMouseDrag, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentMouseOut( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseDrag, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}