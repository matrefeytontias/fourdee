const D4_PERSPECTIVE = true;

const D4_container = document.getElementById("view");
const D4_gameWidth = D4_container.offsetWidth;
const D4_gameHeight = D4_container.offsetHeight;
const D4_aspectRatio = D4_gameWidth / D4_gameHeight;
const D4_scene = new THREE.Scene();
const D4_space = new Space4D(new OrthoProj());

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

  /*var geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
  cube = new THREE.LineSegments(geometry);
  D4_scene.add(cube);*/
  var geometry = new BoxGeometry4D(1, 1, 1, 1);
  cube = new Points4D(geometry, new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 }));
  D4_scene.add(cube.projection);
  D4_space.add(cube);
  D4_camera.position.z = 5;

  render();
}

function render()
{
  requestAnimationFrame(render);
  D4_space.rotation.xz += 0.03;
  D4_space.rotation.xw += 0.05;
  D4_space.project();
  D4_renderer.render(D4_scene, D4_camera);
}
