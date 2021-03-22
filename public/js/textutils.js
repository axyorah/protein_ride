function getTriangle() {
    const a = new THREE.Vector3(5, 7, 0);
    const b = new THREE.Vector3(2, 12, 0);
    const c = new THREE.Vector3(-3, 2, 0);

    //const triGeometry = new THREE.Triangle(a, b, c);
    const triShape = new THREE.Shape();
    triShape.moveTo(5, 7);
    triShape.moveTo(2, 12);
    triShape.moveTo(-3, 2);
    triShape.moveTo(5, 7);
    const triGeometry = new THREE.ShapeGeometry( triShape );

    const triMaterial = new THREE.MeshPhongMaterial( { 
        color: 0xDd276b, 
        specular: new THREE.Color(1.0, 0.2, 1.0), 
        shininess: 4 
    } );

    return new THREE.Mesh( triGeometry, triMaterial);
}

function addTextToScene( scene ) {
    const loader = new THREE.GLTFLoader();

    loader.load( '../blender/mads-scientist-with-triangle-0.glb', function ( gltf ) {
        gltf.scene.position.set(0, 4.6, 0);
        scene.add( gltf.scene );    
    }, undefined, function ( error ) {    
        console.error( error );    
    } );
}