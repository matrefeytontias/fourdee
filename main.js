const D4_PERSPECTIVE = true;
if(!D4_PERSPECTIVE)
{
  D4_orthoWidth = 3 * D4_aspectRatio;
  D4_orthoHeight = 3;
}
const D4_GRAVITY = 0.35; // unit/s²
const D4_FRICTION = 20; // unit/s²
var D4_JUMP = 0.25; // unit/s

var paused = false;
var D4_container = document.getElementById("view");
var D4_gameWidth = D4_container.offsetWidth;
var D4_gameHeight = D4_container.offsetHeight;
const D4_aspectRatio = D4_gameWidth / D4_gameHeight;
const D4_scene = new THREE.Scene();

var lastUpdateTimestamp;

const orthoProj = new OrthoProj();
const stereoProj = new StereoProj(new THREE.Vector4(0, 0, 0, 10), 3);

const D4_space = new Space4D(orthoProj);

var D4_camera = new THREE.PerspectiveCamera(75, D4_gameWidth / D4_gameHeight, 0.1, 1000);


var skyCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const D4_renderer = new THREE.WebGLRenderer({ antialias: true });

const skyRender = new THREE.WebGLRenderer({ antialias: true });

var ground, cube, light;

var level;

var levelName = new URL(window.location.href).searchParams.get("level");
if(levelName === null)
  window.location.href = "levelSelection.html";

window.addEventListener("load", main);

function main()
{
  light = new THREE.PointLight(0xffffff, 0.5, 1000);
  D4_scene.add(light);

  var ambientLight = new THREE.AmbientLight( 0x606060 ); // soft white light
  D4_scene.add( ambientLight );
  
  window.addEventListener("levelLoaded", levelLoaded);
  
  level = new Level(D4_container, D4_space, D4_camera, D4_scene);
  
  $("#retry").click(function(){
    window.location.href = window.location.origin + window.location.pathname + "?level=" + levelName;
  })
  
  LevelLoader.loadFile("levels/" + levelName + ".json", level);
}

function levelLoaded()
{
  level.initialize(LevelLoader.result);
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
  
  document.getElementById("sky-view").appendChild(skyRender.domElement);
  
  level.start();

  skyRender.setClearColor( new THREE.Color( 0x111111 ), 0.8 );
  skyRender.setSize(200, 200);
  D4_renderer.setClearColor( new THREE.Color( 0x111111 ), 0.8 );
  
  skyCamera.position.y = 11;
  skyCamera.lookAt(new THREE.Vector3(0, 0, 0));

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
  
  skyRender.render(D4_scene, skyCamera);
  
}