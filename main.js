const D4_PERSPECTIVE = true;
if(!D4_PERSPECTIVE)
{
  D4_orthoWidth = 3 * D4_aspectRatio;
  D4_orthoHeight = 3;
}

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


const D4_renderer = new THREE.WebGLRenderer();

var cube, light;

window.addEventListener("load", main);

function main()
{
  // Build Level
  /*
  var geometry = new BoxLinesGeometry4D(100, 3, 100, 100);
  cube = new LineSegments4D(geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
  cube.position.y = -1.5;
  */

  /*
  var geometry = new BoxGeometry4D(2, 2, 2, 2);
  cube = new Mesh4D(geometry, [
    new THREE.MeshBasicMaterial({
      color: 0xffffff
    }),
    new THREE.MeshBasicMaterial({
      color: 0x00ffff
    }),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe : true,
      wireframeLinewidth : 5,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe : true,
      wireframeLinewidth : 5,
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe : true,
      wireframeLinewidth : 5,
    }),
  ]);
  
  cube.setFaceMaterial(tesseractFacesGroups.faces, tesseractFacesGroups.materials); 
  */
  
  var geometry = new Box3DGeometry4D("xyz", 2, 2, 2);
  cube = new Mesh4D(geometry, 
    new THREE.MeshLambertMaterial({
      color: 0x00ffff
    })
  );
  
  cube.position.y = 1;
  cube.position.z = 0;

  D4_scene.add(cube.projection);
  D4_space.add(cube);
  
  var geometry = new Box3DGeometry4D("xyz", 2, 2, 2);
  var cubeInterior = new Mesh4D(geometry, 
    new THREE.MeshLambertMaterial({
      color: 0xff00ff,
      side : THREE.BackSide
    })
  );
  
  cubeInterior.position.y = cube.position.y;
  cubeInterior.position.z = cube.position.z;
  
  D4_scene.add(cubeInterior.projection);
  D4_space.add(cubeInterior);

  D4_camera.position.y = 0.8;
  
  light = new THREE.PointLight(0xffffff, 0.5, 100);
  D4_scene.add(light);

  // End level;

  //Start controls
  var fpControls = new FirstPersonControls(D4_container, new THREE.Vector4(), D4_camera, D4_space, new KeySettings(), ["xw", "yw", ""]);
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
  
  resize();

  render();
}

function render(timestamp)
{
  requestAnimationFrame(render);
  light.position.set(D4_camera.position.x, D4_camera.position.y, D4_camera.position.z);

  if(!activeControls.paused)
  {
    activeControls.update(timestamp - lastUpdateTimestamp)
    lastUpdateTimestamp = timestamp;
  }

  D4_space.project();
  D4_renderer.render(D4_scene, D4_camera);
}
