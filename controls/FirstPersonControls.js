function FirstPersonControls(
    camera3D,
    space4D,
    keys = new keySettings(), 
    rotation4DPlans = ["xw", "zw"],
    rotation4DSensitivity = 0.002, 
    deplacementSensitivity = 0.001)
{
    Controls.call(this, keys);
    this.camera3D = camera3D;
    this.space4D = space4D;
    
    this.onMouseMove = function(event){
        
        document.body.style.cursor = "none";
        
        this.cameraRotation.y = this.mousePosition.x / this.windowHalfX * Math.PI;
		this.cameraRotation.x = this.mousePosition.y / this.windowHalfY * 0.25 * Math.PI;
		
    }
    
    this.update = function(dt){
        
        var direction = new THREE.Vector3( Math.cos(this.cameraRotation.y), Math.sin(-this.cameraRotation.x), Math.sin(this.cameraRotation.y) );
        
        
        //4D rotations : 
        if(this.keyPressed[this.keys.ana]){
            for(var i=0; i<rotation4DPlans.length; i++){
                this.space4D.rotation[rotation4DPlans[i]] += dt * rotation4DSensitivity;
            }
        }
        if(this.keyPressed[this.keys.kata]){
            for(var i=0; i<rotation4DPlans.length; i++){
                this.space4D.rotation[rotation4DPlans[i]] -= dt * rotation4DSensitivity;
            }
        }
        
        //camera 3D rotation 
        var where = this.camera3D.position.clone();
        where.add(direction);
        this.camera3D.lookAt(where);
        
        //translation
        var moveDirection = direction.clone();
        moveDirection.y = 0;
        moveDirection.multiplyScalar(deplacementSensitivity*dt);
        if(this.keyPressed[this.keys.up]) this.camera3D.position.add(moveDirection);
        if(this.keyPressed[this.keys.down]) this.camera3D.position.sub(moveDirection);
        if(this.keyPressed[this.keys.left]) this.camera3D.position.add(moveDirection.rotate("y", Math.PI/2));
        if(this.keyPressed[this.keys.right]) this.camera3D.position.add(moveDirection.rotate("y", -Math.PI/2));
        
    }
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