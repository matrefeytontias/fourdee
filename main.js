const D4_PERSPECTIVE = true;

const D4_container = document.getElementById("view");
const D4_gameWidth = D4_container.offsetWidth;
const D4_gameHeight = D4_container.offsetHeight;
const D4_aspectRatio = D4_gameWidth / D4_gameHeight;
const D4_scene = new THREE.Scene();
const D4_space = new Space4D(new PerspectProj(3.5));

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
  var geometry = new BoxGeometry4D(2, 2, 2, 2);
  
  // Wireframe : 
  cube = new Mesh4D(geometry, [
    new THREE.MeshBasicMaterial({color : 0xff0000, wireframe : true} ),
    new THREE.MeshBasicMaterial({color : 0x0000ff, wireframe : true} ),
    new THREE.MeshBasicMaterial({color : 0xff00ff, wireframe : true} ),
    new THREE.MeshBasicMaterial({color : 0x00ffff, wireframe : true} ),
    new THREE.MeshBasicMaterial({color : 0xffff00, wireframe : true} ),
  ]);
  
  //Try with transparency
  //cube = new Mesh4D(geometry, new THREE.MeshBasicMaterial({color : 0x0000ff, side: THREE.DoubleSide, opacity : 0.2, transparent : true}));


  D4_scene.add(cube.projection);
  D4_space.add(cube);
  D4_camera.position.z = 5;
  
  D4_space.rotate("xz", 0.33);

  render();
}

var time = 0;
function render()
{
  requestAnimationFrame(render);
  time += 1;
  
  //cube.position.x = Math.cos(time/60);
  //cube.position.y = Math.sin(time/60);
  
  
  D4_space.rotate("xz", 1/200);
  
  //D4_space.rotate("zw", 1/80);
  
  //D4_space.rotate("xy", 1/400);
  
  D4_space.project();
  D4_renderer.render(D4_scene, D4_camera);
}
