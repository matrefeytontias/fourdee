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

THREE.Vector3.prototype.rotate = function(axe, theta){
    var plan = "xyz".replace(axe, "");
    var a1 = plan.charAt(0), a2 = plan.charAt(1);
    var c = Math.cos(theta), s = Math.sin(theta);
    va1 = this[a1];
    this[a1] = c * this[a1] + s * this[a2];
    this[a2] = - s * va1 + c * this[a2];
    return this;
}

function updateControls(timestamp){
    
    if(!lastControlUpdateTimestamp) lastControlUpdateTimestamp = timestamp;
    
    document.getElementById("rotation-log").innerHTML = Math.round(user4DRotation.xw * 180 / Math.PI)%360;
    
    var dt = timestamp - lastControlUpdateTimestamp;
    var rotationCoef = 0.002;
    var deplacementCoef = 0.0005;
    
    var direction = new THREE.Vector3( Math.cos(cameraRotation.y), Math.sin(-cameraRotation.x), Math.sin(cameraRotation.y) );
    var moveDirection = direction.clone();
    moveDirection.y = 0;
    moveDirection.multiplyScalar(deplacementCoef*dt);
    
    if(keyPressed.a){
        user4DRotation[KEY_ROTATION_PLAN] += dt * rotationCoef;
        user4DRotation["zw"] += dt * rotationCoef;
        //cameraRotation[KEY_ROTATION_PLAN.charAt(0)] -= dt * rotationCoef;
    }
    
    if(keyPressed.e){
        user4DRotation[KEY_ROTATION_PLAN] -= dt * rotationCoef;
        user4DRotation["zw"] -= dt * rotationCoef;
        //cameraRotation[KEY_ROTATION_PLAN.charAt(0)] += dt * rotationCoef;
    }
    
    if(keyPressed.z) console.log(moveDirection);
    if(keyPressed.z) D4_camera.position.add(moveDirection);
    if(keyPressed.s) D4_camera.position.sub(moveDirection);
    if(keyPressed.q) D4_camera.position.add(moveDirection.rotate("y", Math.PI/2));
    if(keyPressed.d) D4_camera.position.add(moveDirection.rotate("y", -Math.PI/2));
    
    if(!document.getElementById("first").checked){
        D4_scene.rotation.y = cameraRotation.y;
        D4_scene.rotation.x = cameraRotation.x;
    }
    else{
        var where = D4_camera.position.clone();
        where.add(direction);
        D4_camera.lookAt(where);
    }
    
    lastControlUpdateTimestamp = timestamp;
}