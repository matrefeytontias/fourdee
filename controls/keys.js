var keyPressed = {};
var user4DRotation;
var user3DTranslation;
var lastControlUpdateTimestamp; 

const KEY_ROTATION_PLAN = "xw"

window.addEventListener("load", function(){
    
    user4DRotation = new Euler4D();
    user3DTranslation = new THREE.Vector3();
    
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
    
    document.getElementById("rotation-log").innerHTML = Math.round(user4DRotation.xw * 180 / Math.PI)%360;
    
    var dt = lastControlUpdateTimestamp - timestamp;
    var coef = 0.002;
    
    if(keyPressed.a){
        user4DRotation[KEY_ROTATION_PLAN] += dt * coef;
        user4DRotation["zw"] += dt * coef;
        //cameraRotation[KEY_ROTATION_PLAN.charAt(0)] -= dt * coef;
    }
    
    if(keyPressed.e){
        user4DRotation[KEY_ROTATION_PLAN] -= dt * coef;
        user4DRotation["zw"] -= dt * coef;
        //cameraRotation[KEY_ROTATION_PLAN.charAt(0)] += dt * coef;
    }
    
    if(!document.getElementById("first").checked){
        D4_scene.rotation.y = cameraRotation.y;
        D4_scene.rotation.x = cameraRotation.x;
    }
    else{
        var where = D4_camera.position.clone();
        where.x += Math.cos(cameraRotation.y);
        where.z += Math.sin(cameraRotation.y);
        where.y += Math.sin(-cameraRotation.x);
        D4_camera.lookAt(where);
    }
    
    lastControlUpdateTimestamp = timestamp;
}