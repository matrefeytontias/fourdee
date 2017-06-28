const D4_GRAVITY = 0.35; // unit/s²
const D4_FRICTION = 20; // unit/s²
const D4_JUMP = 0.15; // unit/s

var paused = false;
var D4_container = document.getElementById("view");
var D4_gameWidth = D4_container.offsetWidth;
var D4_gameHeight = D4_container.offsetHeight;
const D4_aspectRatio = D4_gameWidth / D4_gameHeight;
const D4_scene = new THREE.Scene();

var lastUpdateTimestamp;

const D4_space = new Space4D(new Intersector());

var D4_camera = new THREE.PerspectiveCamera(75, D4_gameWidth / D4_gameHeight, 0.1, 1000);

const D4_renderer = new THREE.WebGLRenderer({ antialias: true });

var ground, cube, light;

var coordsOutput = document.getElementById("coords");

window.addEventListener("load", main);

THREE.Vector3.prototype.toString = function()
{
  return "x: " + this.x + ", y: " + this.y + ", z: " + this.z + "\n";
}

THREE.Vector4.prototype.toString = function()
{
  return "x: " + this.x + ", y: " + this.y + ", z: " + this.z + ", w: " + this.w + "\n";
}

function main()
{
  var mat = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  light = new THREE.PointLight(0xffffff, 1., 1000);
  D4_scene.add(light);

  D4_scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  // window.addEventListener("levelLoaded", levelLoaded);
  // LevelLoader.loadFile("levels/cubejail.json", D4_space);
  var geom = new Geometry4D();
  geom.extrude3DGeometry(new THREE.BoxGeometry(3, 3, 3), 3);
  cube = new Mesh4D(geom, mat);
  cube.position.y = 1.45;
  cube.position.z = -5;
  D4_space.add(cube);

  geom = new Geometry4D();
  geom.extrude3DGeometry(new THREE.BoxGeometry(20, 1, 20), 10);
  ground = new Mesh4D(geom, mat);
  ground.position.y = -0.5;
  ground.position.w = -5;
  D4_space.add(ground);
  geom = new Geometry4D();
  geom.extrude3DGeometry(new THREE.BoxGeometry(20, 1, 20), 10);
  ground = new Mesh4D(geom, new THREE.MeshPhongMaterial({ color: 0x0000ff, side: THREE.DoubleSide }));
  ground.position.y = -0.5;
  ground.position.w = 5;
  D4_space.add(ground);

  levelLoaded();
  // End level;
}

function levelLoaded()
{
  // Start controls
  // D4_camera.position.copy(LevelLoader.result.startPos);
  D4_camera.position.y = 0.5;
  D4_camera.lookAt(D4_scene.position);

  var fpControls = new FirstPersonControls(D4_container, new Player(), D4_camera, D4_space);
  fpControls.listen();

  document.getElementById("start").style.display = activeControls === fpControls ? "" : "none";
}

function resize()
{
  D4_gameWidth = D4_container.offsetWidth;
  D4_gameHeight = D4_container.offsetHeight;

  D4_renderer.setSize(D4_gameWidth, D4_gameHeight);

  D4_camera.aspect = D4_gameWidth / D4_gameHeight;
  D4_camera.updateProjectionMatrix();

}

function start()
{
  D4_container.appendChild(D4_renderer.domElement);

  lastUpdateTimestamp = -1;
  resize();
  requestAnimationFrame(render);
}

function render(timestamp)
{
  requestAnimationFrame(render);

  if(!activeControls.paused)
  {
    activeControls.update(lastUpdateTimestamp > 0 ? Math.min((timestamp - lastUpdateTimestamp) / 1000, 1 / 60) : 0)
    lastUpdateTimestamp = timestamp;
  }

  light.position.copy(D4_camera.position);

  D4_space.project();
  D4_renderer.render(D4_scene, D4_camera);
  
  coordsOutput.innerHTML = D4_space.intersector.ux + "<br>" + D4_space.intersector.uy + "<br>" + D4_space.intersector.uz + "<br>" + D4_space.intersector.origin;
}
