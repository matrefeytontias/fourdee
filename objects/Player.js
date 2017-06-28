// Uses AABB for a hitbox
function Player(height = 1.5)
{
  Object4D.call(this);
  this.positionalOnly = true;
  this.velocity = new THREE.Vector4(0, 0, 0, 0);
  this.aabb = new AABB4(this.position, new THREE.Vector4(0.5, height, 0.5, 0.01));
  this.hasGravity = false;
}

Player.prototype = new Object4D();

Player.prototype.getAABB = function()
{
  return this.aabb;
}
