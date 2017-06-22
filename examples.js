function build1(scene, space){
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
    
    cube.setSelectable(true);
    
    cube.position.y = 1;
    cube.position.z = 2;
  
    cube.addChildrenToScene(scene);
    space.add(cube);
}

function build2(scene, space){
    var geometry = new Box3DGeometry4D("xyz", 4, 4, 4);
    var cube = new Mesh4D(geometry, 
        new THREE.MeshLambertMaterial({
            color: 0x00ffff
        })
    );
    
    cube.add3DMeshMaterial( new THREE.MeshLambertMaterial({ color: 0xff00ff, side : THREE.BackSide }) ) ;
    
    cube.rotation.zw = 1;
    
    cube.position.y = 0;
    
    cube.setSelectable(true);
    
    cube.addChildrenToScene(scene);
    
    space.add(cube);
  
}

function build3(scene, space)
{
  var geometry = new PentachoreGeometry(5);
  var d4hedron = new Mesh4D(geometry, 
    new THREE.MeshLambertMaterial({
      color: 0xff0000
    })
  );
  
  d4hedron.add3DMeshMaterial( new THREE.MeshLambertMaterial({ color: 0xff00ff, side : THREE.BackSide }) ) ;
  
  d4hedron.position.y = 1;
  d4hedron.setSelectable(true);
  
  d4hedron.addChildrenToScene(scene);
  space.add(d4hedron);
}

function build4(scene, space){
    var geometry = new BoxGeometry4D(2, 2, 2, 2);
    var cube = new Mesh4D(geometry, [
    new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side : THREE.DoubleSide
    }),
    new THREE.MeshLambertMaterial({
      color: 0x00ffff,
      side : THREE.DoubleSide
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
      side : THREE.DoubleSide
    }),
    ]);
  
    cube.setFaceGroupMaterial(tesseractFacesGroups); 
    
    cube.geometry.filterFacesGroups([0, 1, 4], tesseractFacesGroups);
    
    cube.setSelectable(true);
    
    cube.position.y = 1;
    cube.position.z = 2;
  
    cube.addChildrenToScene(scene);
    space.add(cube);
}