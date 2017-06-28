const D4_GRAVITY = 0.5; // unit/s²
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

var light;

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
  geom.extrude3DGeometry(new THREE.BoxGeometry(20, 2.5, 1), 1);
  var cube = new Mesh4D(geom, mat);
  cube.position.set(0, 1.20, 0, 0);
  D4_space.add(cube);
  
  // Add a couple cubes to see where we must and must not be
  geom = new Geometry4D();
  geom.extrude3DGeometry(new THREE.BoxGeometry(1, 1, 1), 1);
  var cubeYes = new Mesh4D(geom, new THREE.MeshPhongMaterial({ color: 0x00ff00, side:THREE.DoubleSide }));
  cubeYes.position.set(-7, 0.51, -6, 0);
  D4_space.add(cubeYes);
  geom = new Geometry4D();
  geom.extrude3DGeometry(new THREE.BoxGeometry(1, 1, 1), 1);
  var cubeNo = new Mesh4D(geom, new THREE.MeshPhongMaterial({ color: 0xff0000, side:THREE.DoubleSide }));
  cubeNo.position.set(-7, 0.51, 2, 0);
  D4_space.add(cubeNo);

  // Add two grounds to separate the space with w < 0 and w > 0
  geom = new Geometry4D();
  geom.extrude3DGeometry(new THREE.BoxGeometry(20, 1, 20), 10);
  var groundNeg = new Mesh4D(geom, mat);
  groundNeg.position.y = -0.5;
  groundNeg.position.w = -5;
  D4_space.add(groundNeg);
  geom = new Geometry4D();
  geom.extrude3DGeometry(new THREE.BoxGeometry(20, 1, 20), 10);
  var groundPos = new Mesh4D(geom, new THREE.MeshPhongMaterial({ color: 0xccccff, side: THREE.DoubleSide }));
  groundPos.position.y = -0.5;
  groundPos.position.w = 5;
  D4_space.add(groundPos);

  levelLoaded();
  // End level;
}

function levelLoaded()
{
  // Start controls
  // D4_camera.position.copy(LevelLoader.result.startPos);
  D4_camera.position.y = 1.0;
  D4_camera.position.z = 5;
  D4_camera.lookAt(D4_scene.position);

  var p = new Player();
  p.hasGravity = true;
  p.position = D4_space.switchBase(D4_camera.position);
  
  var fpControls = new FirstPersonControls(D4_container, p, D4_camera, D4_space);
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
  
  // coordsOutput.innerHTML = D4_space.intersector.ux + "<br>" + D4_space.intersector.uy + "<br>" + D4_space.intersector.uz + "<br>" + D4_space.intersector.origin;
}
