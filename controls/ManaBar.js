function ManaBar(initialMana = 10)
{
  this.mana = initialMana;
  this.initialMana = initialMana;
  this.domElement = document.getElementById("mana-bar");
}

ManaBar.prototype.empty = function()
{
  return this.mana < 0;
}

ManaBar.prototype.use = function(dtheta)
{
  this.mana -= dtheta/(2*Math.PI);
}

ManaBar.prototype.updateDom = function()
{
  this.domElement.style.width = ( Math.round(1000*(this.mana / this.initialMana))/10 ) + "%" ;
}

ManaBar.prototype.getManaPercent = function()
{
  return Math.round(100*(this.mana / this.initialMana));
}