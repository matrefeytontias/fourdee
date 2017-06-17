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

  var geometry = new BoxGeometry4D(1, 1, 1, 1);
  cube = new Mesh4D(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, wireframe: true }));
  D4_scene.add(cube.projection);
  D4_space.add(cube);
  D4_camera.position.z = 5;

  var light = new THREE.PointLight(0xffffff, 1, 0);
  light.position.set(-1.5, 1.0, -2);
  D4_scene.add(light);

  render();
}

function render()
{
  requestAnimationFrame(render);
  cube.rotation.xz += 0.01;
  D4_space.rotation.xw += 0.01;
  D4_space.project();
  D4_renderer.render(D4_scene, D4_camera);
}
