function Player(collisionRadius = 0.3)
{
  Object4D.call(this);
  this.positionalOnly = true;
  this.velocity3D = new THREE.Vector3();
  this.radius = collisionRadius;
}

Player.prototype = new Object4D();
