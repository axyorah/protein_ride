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

    const vertices = []
    for (let i = 0; i < helixCenters.length; i++) {
        //const sphere = new THREE.Mesh(ele.geometry, ele.material);

        const xyz = helixCenters[i];
        const n = helixNormals[i];
        
        const x = params.scale * (xyz[0] + n[0] * params.rad);
        const y = params.scale * (xyz[1] + n[1] * params.rad);
        const z = params.scale * (xyz[2] + n[2] * params.rad);
        
        //sphere.position.set(x, y, z);
        //protein.add(sphere);
        vertices.push(...[x,y,z]);
    }

    //const geometry = new THREE.BufferGeometry();
    //geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    ele.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const particles = new THREE.Points( ele.geometry, ele.material );
    particles.name = 'Particles';
    protein.add(particles);
}

function getSpherePrimitive() {
    const rad = params.unitLen * params.scale * 0.007; // radius of a 'building block' sphere
    const sphereGeometry = new THREE.SphereGeometry(rad, 8, 8);
    const sphereMaterial = new THREE.MeshPhongMaterial( { shininess: 4 } );
	sphereMaterial.color.setHex( 0x6723F7 );
	sphereMaterial.specular.setRGB( 0.5, 0.5, 0.5 );
    return new THREE.Mesh(sphereGeometry, sphereMaterial);
}

function getParticlePrimitive() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({ 
        size: params.unitLen * params.scale * 0.06, 
        sizeAttenuation: true, 
        map: params.tex['sq90'], 
        transparent: true 
    });
    particleMaterial.color.setHSL( 0.35, 0.1, 0.9 );
    return new THREE.Points( particleGeometry, particleMaterial );
}

function addProteinToScene( scene ) {
    // define 'building blocks'
    setUnitLen();

    const sphere = getSpherePrimitive();
    const particle = getParticlePrimitive();

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
    populateProteinTube(protein, particle);    
    
    // adjust protein position/rotation
    protein.rotation.set(params.xRot, params.yRot, params.zRot);
    protein.position.set(params.xPos, params.yPos, params.zPos);
    scene.add(protein);
}