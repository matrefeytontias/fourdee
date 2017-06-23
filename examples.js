function build1(scene, space){
    var geometry = new BoxGeometry4D(2, 2, 2, 2);
    var cube = new Mesh4D(geometry, [
      new THREE.MeshPhongMaterial({
        color: 0xffffff
      }),
      new THREE.MeshPhongMaterial({
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

    cube.setFaceGroupMaterial(tesseractFaceGroups);

    cube.setSelectable(true);

    cube.position.y = 1;
    cube.position.z = 2;

    space.add(cube);
}

function build2(scene, space){
    var geometry = new Box3DGeometry4D("xyz", 2, 2, 2);
    var cube = new Mesh4D(geometry,
        new THREE.MeshLambertMaterial({
            color: 0x00ffff
        })
    );

    cube.add3DMeshMaterial( new THREE.MeshLambertMaterial({ color: 0xff00ff, side : THREE.BackSide }) ) ;

    cube.rotation.zw = 1;
    cube.position.y = 1;

    cube.setSelectable(true);
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

  space.add(d4hedron);
}

function build4(scene, space){
    var ground = new Mesh4D(new BoxGeometry4D(100, 2, 100, 100), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    ground.position.y = -1;
    space.add(ground);

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
    null,
    null,
    new THREE.MeshLambertMaterial({
      color: 0x00ff00,
      side : THREE.DoubleSide
    }),
    ]);

    cube.setFaceGroupMaterial(tesseractFaceGroups);
    cube.geometry.filterFaceGroups([0, 1, 4], tesseractFaceGroups);

    cube.setSelectable(true);

    cube.position.y = 1;
    cube.position.z = 2;

    space.add(cube);
}
