const D4_PERSPECTIVE = true;

var paused = false;
var D4_container = document.getElementById("view");
var D4_gameWidth = D4_container.offsetWidth;
var D4_gameHeight = D4_container.offsetHeight;
const D4_aspectRatio = D4_gameWidth / D4_gameHeight;
const D4_scene = new THREE.Scene();

var lastUpdateTimestamp;

const D4_space = new Space4D(new OrthoProj());
//const D4_space = new Space4D(new StereoProj(new THREE.Vector4(0, 0, 0, 5), 3));

if(!D4_PERSPECTIVE)
{
  D4_orthoWidth = 3 * D4_aspectRatio;
  D4_orthoHeight = 3;
}
const D4_camera = D4_PERSPECTIVE ? new THREE.PerspectiveCamera(75, D4_gameWidth / D4_gameHeight, 0.1, 1000)
                                 : new THREE.OrthographicCamera(-D4_orthoWidth / 2, D4_orthoWidth / 2, D4_orthoHeight / 2, -D4_orthoHeight / 2, 0.1, 1000);
const D4_renderer = new THREE.WebGLRenderer();

var cube, cubeLog;

window.addEventListener("load", main);

/*
window.addEventListener("keydown", function(e){
  if(e.keyCode == 13) lockPointer();
}); */

const orthoProj = new OrthoProj();
const stereoProj = new StereoProj(new THREE.Vector4(0, 0, 0, 5), 3);

function main(){
  cubeLog = document.getElementById("cubeLog");
  // Bulid Level
  var geometry = new BoxLinesGeometry4D(100, 3, 100, 100);
  var c1 = new LineSegments4D(geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
  c1.position.y = -1.5;

  D4_scene.add(c1.projection);

  D4_space.add(c1);

  cube = new LineSegments4D(new BoxLinesGeometry4D(1, 1, 1, 0), new THREE.LineBasicMaterial({ color: 0xffffff }))
  cube.position.w = -1;
  cube.position.y = 0.5

  D4_scene.add(cube.projection);
  cube.projection.frustumCulled = false;
  D4_space.add(cube);

  D4_camera.position.y = 0.3;

  var light = new THREE.PointLight(0xffffff, 1, 0);
  light.position.set(-1.5, 1.0, -2);
  D4_scene.add(light);
  // End level;

  //Start controls
  var fpControls = new FirstPersonControls(D4_container, D4_camera, D4_space, new keySettings(), ["xw"], 1 / 1000);

  var tpControls = new ThirdPersonControls(D4_camera, D4_scene, D4_space);

  fpControls.listen();

  document.getElementById("center-text").style.display = activeControls === fpControls ? "" : "none";

}

function start()
{
  D4_gameWidth = D4_container.offsetWidth;
  D4_gameHeight = D4_container.offsetHeight;

  D4_renderer.setSize(D4_gameWidth, D4_gameHeight);
  D4_container.appendChild(D4_renderer.domElement);

  render();
}

function render(timestamp)
{

  requestAnimationFrame(render);
  if(!activeControls.paused){
    activeControls.update(timestamp - lastUpdateTimestamp)

    lastUpdateTimestamp = timestamp;
  }

  D4_space.project();
  D4_renderer.render(D4_scene, D4_camera);
  cubeLog.innerHTML = "";
  for(var i = 0; i < 16; i++)
  {
    cubeLog.innerHTML += cube.projection.geometry.vertices[i] + "<br>";
  }
}

THREE.Vector3.prototype.toString = function ()
{
  return "x: " + this.x + ", y: " + this.y + ", z: " + this.z;
}
