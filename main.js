const D4_PERSPECTIVE = true;

const D4_container = document.getElementById("view");
const D4_gameWidth = D4_container.offsetWidth;
const D4_gameHeight = D4_container.offsetHeight;
const D4_aspectRatio = D4_gameWidth / D4_gameHeight;
const D4_scene = new THREE.Scene();
const D4_space = new Space4D(new PespectProj(0));

if(!D4_PERSPECTIVE)
{
  D4_orthoWidth = 3 * D4_aspectRatio;
  D4_orthoHeight = 3;
}
const D4_camera = D4_PERSPECTIVE ? new THREE.PerspectiveCamera(75, D4_gameWidth / D4_gameHeight, 0.1, 1000)
                                 : new THREE.OrthographicCamera(-D4_orthoWidth / 2, D4_orthoWidth / 2, D4_orthoHeight / 2, -D4_orthoHeight / 2, 0.1, 1000);
const D4_renderer = new THREE.WebGLRenderer();

var cube;

window.addEventListener("load", main);

function main()
{
  D4_renderer.setSize(D4_gameWidth, D4_gameHeight);
  D4_container.appendChild(D4_renderer.domElement);

  var geometry = new BoxLinesGeometry4D(100, 3, 100, 100);
  cube = new LineSegments4D(geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
  cube.position.y = -1.5;
  D4_scene.add(cube.projection);
  
  D4_space.add(cube);
  
  var c2 = new LineSegments4D(new BoxLinesGeometry4D(1, 1, 1, 0), new THREE.LineBasicMaterial({ color: 0xffffff }))
  c2.position.w = -1;
  c2.position.y = 0.5
  
  D4_scene.add(c2.projection);
  D4_space.add(c2);

  D4_camera.position.y = 0.3;

  render();
}

function render(timestamp)
{
  requestAnimationFrame(render);
  //cube.position.x = Math.sin(performance.now() / 1000);
  
  //cube.rotation.xz = userRotation ;
  
  //D4_space.rotation.yw += 0.01;
  
  D4_space.rotation = user4DRotation;
  
  
  //D4_scene.rotation.x = cameraRotation.x;
  updateControls(timestamp);
  
  D4_space.project();
  D4_renderer.render(D4_scene, D4_camera);
}
