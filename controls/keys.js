var keyPressed = {};
var user4DRotation;
var lastControlUpdateTimestamp; 
var KEY_ROTATION_PLAN = "zw"

window.addEventListener("load", function(){
    
    user4DRotation = new Euler4D();
    
    document.addEventListener("keydown", onDocuemntKeyDown, false);
    document.addEventListener("keyup", onDocuemntKeyUp, false);
    
})


function onDocuemntKeyDown(e){
    keyPressed[e.key] = true;
}

function onDocuemntKeyUp(e){
    keyPressed[e.key] = false;
}


function updateControls(timestamp){
    
    if(!lastControlUpdateTimestamp) lastControlUpdateTimestamp = timestamp;
    
    
    
    var dt = lastControlUpdateTimestamp - timestamp;
    
    if(keyPressed.a){
        user4DRotation[KEY_ROTATION_PLAN] += dt * 0.002;
    }
    
    if(keyPressed.e){
        user4DRotation[KEY_ROTATION_PLAN] -= dt * 0.002;
    }
    
    lastControlUpdateTimestamp = timestamp;
}