const D4_container = document.getElementById("view");
const D4_scene = new THREE.Scene();
const D4_camera = new THREE.PerspectiveCamera(75, D4_container.offsetWidth / D4_container.offsetHeight, 0.1, 1000);
const D4_renderer = new THREE.WebGLRenderer();

main();

var cube;

function main()
{
  D4_renderer.setSize(D4_container.offsetWidth, D4_container.offsetHeight);
  D4_container.appendChild(D4_renderer.domElement);

  var geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
  var material = new THREE.LineBasicMaterial({ color:0xff0000 });
  cube = new THREE.LineSegments(geometry, material);
  D4_scene.add(cube);
  D4_camera.position.z = 2;

  render();
}

function render()
{
  requestAnimationFrame(render);
  D4_renderer.render(D4_scene, D4_camera);
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.01;
}
