// The player has a cylinder hitbox
function Player(collisionRadius = 0.3, height = 1.5)
{
  Object4D.call(this);
  this.positionalOnly = true;
  this.velocity3D = new THREE.Vector3();
  this.radius = collisionRadius;
  this.height = height;
}

Player.prototype = new Object4D();
