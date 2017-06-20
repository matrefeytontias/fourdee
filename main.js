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

var lastUpdateTimestamp = performance.now();

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
  // Build Level
  var groundGeometry = new BoxGeometry4D(100, 2, 100, 100);
  ground = new Mesh4D(groundGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
  ground.position.y = -1;
  D4_space.add(ground);

  var cubeGeometry = new BoxGeometry4D(3, 1, 3, 3);
  cube = new Mesh4D(cubeGeometry, [
    new THREE.MeshPhongMaterial({
      color: 0xffffff
    }),
    new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      /*emissive : 0xffffff,
      emissiveIntensity : 0.1*/
    }),
    new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe : true,
      wireframeLinewidth : 1,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe : true,
      wireframeLinewidth : 1,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe : true,
      wireframeLinewidth : 1,
    }),
  ]);

  cube.position.y = 0.5;
  cube.setFaceMaterial(tesseractFacesGroups.faces, tesseractFacesGroups.materials);
  D4_space.add(cube);

  D4_camera.position.y = 0.8;
  D4_camera.position.z = -5;

  light = new THREE.PointLight(0xffffff, 0.5, 1000);
  D4_scene.add(light);

  // End level;

  //Start controls
  var fpControls = new FirstPersonControls(D4_container, new Player(), D4_camera, D4_space, new KeySettings(), ["xw"]);
  var tpControls = new ThirdPersonControls(D4_camera, D4_scene, D4_space);
  fpControls.listen();

  document.getElementById("center-text").style.display = activeControls === fpControls ? "" : "none";
}

function resize(){

  D4_gameWidth = D4_container.offsetWidth;
  D4_gameHeight = D4_container.offsetHeight;

  D4_renderer.setSize(D4_gameWidth, D4_gameHeight);

  D4_camera.aspect = D4_gameWidth / D4_gameHeight;
  D4_camera.updateProjectionMatrix();

}

function start()
{
  D4_container.appendChild(D4_renderer.domElement);

  lastUpdateTimestamp = performance.now();
  resize();
  render(performance.now());
}

function render(timestamp)
{
  requestAnimationFrame(render);

  if(!activeControls.paused)
  {
    activeControls.update((timestamp - lastUpdateTimestamp) / 1000)
    lastUpdateTimestamp = timestamp;
  }
  
  light.position.copy(D4_camera.position);

  D4_space.project();
  D4_renderer.render(D4_scene, D4_camera);
}
