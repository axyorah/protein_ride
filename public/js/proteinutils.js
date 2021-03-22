function setUnitLen() {
    params.unitVec = [
        paths.alphaCarbons[0][0] - paths.alphaCarbons[1][0],
        paths.alphaCarbons[0][1] - paths.alphaCarbons[1][1],
        paths.alphaCarbons[0][2] - paths.alphaCarbons[1][2]
    ];
    params.unitLen = 
        params.unitVec[0] * params.unitVec[0] + 
        params.unitVec[1] * params.unitVec[1] + 
        params.unitVec[2] * params.unitVec[2];
}

function populateMainProteinChain( protein, ele ) {
    const proteinMain = paths['objPath'];

    for (let xyz of proteinMain) {
        const sphere = new THREE.Mesh(ele.geometry, ele.material);
        
        const x = params.scale * xyz[0];
        const y = params.scale * xyz[1];
        const z = params.scale * xyz[2];
        
        sphere.position.set(x, y, z);        
        protein.add(sphere);
    }
}

function populateProteinTube( protein, ele ) {
    const helixCenters = paths['helixCenters'];     
    const helixNormals = paths['helixNormals'];

    for (let i = 0; i < helixCenters.length; i++) {
        const sphere = new THREE.Mesh(ele.geometry, ele.material);

        const xyz = helixCenters[i];
        const n = helixNormals[i];
        
        const x = params.scale * (xyz[0] + n[0] * params.rad);
        const y = params.scale * (xyz[1] + n[1] * params.rad);
        const z = params.scale * (xyz[2] + n[2] * params.rad);
        
        sphere.position.set(x, y, z);
        protein.add(sphere);
    }
}

function addProteinToScene( scene ) {
    // define 'building blocks'
    setUnitLen();
    const rad = params.unitLen * params.scale * 0.01; // radius of a 'building block' sphere
    const sphereGeometry = new THREE.SphereGeometry(rad, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial( { shininess: 4 } );
	sphereMaterial.color.setHex( 0x6723F7 );
	sphereMaterial.specular.setRGB( 0.5, 0.5, 0.5 );
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // delete old protein if present
    for (let i=0; i < scene.children.length; i++) {
        const child = scene.children[i];
        if (child.name === 'Protein') {
            scene.remove(child);
        }
    }
    
    // add new protein object
    let protein = new THREE.Object3D();
    protein.name = 'Protein';

    populateMainProteinChain(protein, sphere);
    populateProteinTube(protein, sphere);    
    
    // adjust protein position/rotation
    protein.rotation.set(params.xRot, params.yRot, params.zRot);
    protein.position.set(params.xPos, params.yPos, params.zPos);
    scene.add(protein);
}