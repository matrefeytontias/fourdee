function buildLevel(space, scene, camera)
{
  var ground = new Mesh4D(
    new Box3DGeometry4D("xyz", 100, 2, 100),
    new THREE.MeshPhongMaterial({ color : 0xffffff })
  );

  ground.position.y  = -1;



  var startCube = new Mesh4D(
    new Box3DGeometry4D("xyz", 1.5, 1.5, 1.5),
    new THREE.MeshPhongMaterial({ color : 0x00ffff, side : THREE.DoubleSide })
  );

  startCube.add3DMeshMaterial(new THREE.MeshPhongMaterial({ color : 0xff00ff, side : THREE.BackSide }) );

  startCube.geometry.removeFaces([2, 3]);
  startCube.position.y = 0.7;

  var blockingCube = new LevelObject(
    new Box3DGeometry4D("xyz", 1.5, 1.5, 1.5),
    new THREE.MeshPhongMaterial({ color : 0x00ffff })
  );

  blockingCube.add3DMeshMaterial(new THREE.MeshPhongMaterial({ color : 0xff00ff, side : THREE.BackSide }) );

  blockingCube.position.y = 0.7;
  blockingCube.position.x = 1.5;

  blockingCube.setSelectable(true);

  var jailCube = new LevelObject(
    new Box3DGeometry4D("xyz", 6, 6, 6),
    new THREE.MeshPhongMaterial({ color : 0xff00ff })
  );

  jailCube.add3DMeshMaterial(new THREE.MeshPhongMaterial({ color : 0x00ffff, side : THREE.BackSide }) );

  jailCube.position.y = 2.95;

  jailCube.setSelectable(true);

  camera.position.y = 0.8;

  space.add(ground);
  space.add(startCube);
  space.add(blockingCube);
  space.add(jailCube);

}
