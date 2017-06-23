const D4_PERSPECTIVE = true;
if(!D4_PERSPECTIVE)
{
  D4_orthoWidth = 3 * D4_aspectRatio;
  D4_orthoHeight = 3;
}
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

const orthoProj = new OrthoProj();
const stereoProj = new StereoProj(new THREE.Vector4(0, 0, 0, 10), 1);

const D4_space = new Space4D(orthoProj);

var D4_camera = D4_PERSPECTIVE ? new THREE.PerspectiveCamera(75, D4_gameWidth / D4_gameHeight, 0.1, 1000)
                                 : new THREE.OrthographicCamera(-D4_orthoWidth / 2, D4_orthoWidth / 2, D4_orthoHeight / 2, -D4_orthoHeight / 2, 0.1, 1000);


const D4_renderer = new THREE.WebGLRenderer({ antialias: true });

var ground, cube, light;

window.addEventListener("load", main);

function main()
{

  light = new THREE.PointLight(0xffffff, 0.5, 1000);
  D4_scene.add(light);

  window.addEventListener("levelLoaded", levelLoaded);
  LevelLoader.loadFile("levels/cubejail.json", D4_space);
  // End level;
}

function levelLoaded()
{
  //Start controls
  D4_camera.position.copy(LevelLoader.result.startPos);

  var fpControls = new FirstPersonControls(D4_container, new Player(), D4_camera, D4_space, ["xw"]);
  var tpControls = new ThirdPersonControls(D4_camera, D4_scene, D4_space);
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
}
