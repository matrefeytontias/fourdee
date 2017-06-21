function build1(scene, space){
    var geometry = new BoxLinesGeometry4D(1, 1, 1, 1);
    var cube = new LineSegments4D(geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    cube.position.y = 0.5;
    
    space.add(cube);
    scene.add(cube.projection);
}

function build2(scene, space){
    var geometry = new BoxGeometry4D(2, 2, 2, 2);
    var cube = new Mesh4D(geometry, [
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
  
    cube.setFaceGroupMaterial(tesseractFacesGroups); 
    cube.position.y = 1;
    cube.position.z = 2;
  
    space.add(cube);
    scene.add(cube.projection);
}

var cube;
function build3(scene, space){
    var geometry = new Box3DGeometry4D("xyz", 2, 2, 2);
    cube = new Mesh4D(geometry, 
        new THREE.MeshLambertMaterial({
            color: 0x00ffff
        })
    );
    cube.rotation.zw = 1;
    
    cube.position.y = 1;
    
    cube.setWireframeMaterial();
    cube.add3DMeshMaterial( new THREE.MeshLambertMaterial({ color: 0xff00ff, side : THREE.BackSide }) )  ;
    cube.setSelectable(true);
    //cube.toggleWireframe();
    
    console.log(cube);
    
    cube.addChildrenToScene(scene);
    
    space.add(cube);
  
}

function build4(scene, space){
      var geometry = new PentacoreGeometry(5);
  var d4hedron = new Mesh4D(geometry, 
    new THREE.MeshLambertMaterial({
      color: 0xff0000,
      side : THREE.DoubleSide
    })
  );
  
  d4hedron.position.y = 1;
  
  scene.add(d4hedron.projection);
  space.add(d4hedron);
}

function build5(scene, space){
    var geometry = new BoxGeometry4D(2, 2, 2, 2);
    var cube = new Mesh4D(geometry, [
    new THREE.MeshLambertMaterial({
      color: 0xffffff
    }),
    new THREE.MeshLambertMaterial({
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
    new THREE.MeshLambertMaterial({
      color: 0x00ff00,
      side : THREE.DoubleSide,
      //wireframe : true,
      //wireframeLinewidth : 5,
    }),
    ]);
  
    cube.setFaceGroupMaterial(tesseractFacesGroups); 
    
    cube.geometry.filterFacesGroups([0, 1, 4], tesseractFacesGroups);
    
    cube.position.y = 1;
    cube.position.z = 2;
  
    space.add(cube);
    scene.add(cube.projection);
}