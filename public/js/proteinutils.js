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

function getSpherePrimitive( color ) {
    color = (color === undefined) ? 0x6723F7 : color;

    const rad = params.unitLen * params.scale * 0.007; // radius of a 'building block' sphere
    const sphereGeometry = new THREE.SphereGeometry(rad, 8, 8);
    const sphereMaterial = new THREE.MeshPhongMaterial( { shininess: 4 } );
	sphereMaterial.color.setHex( color );
	sphereMaterial.specular.setRGB( 0.5, 0.5, 0.5 );
    return new THREE.Mesh(sphereGeometry, sphereMaterial);
}

function getParticlePrimitive( texture ) {
    texture = (texture === undefined) ? params.tex['0'] : texture;

    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({ 
        size: params.unitLen * params.scale * 0.017, 
        sizeAttenuation: true, 
        map: texture,
        transparent: true 
    });
    particleMaterial.color.setHSL( 0.35, 0.1, 0.9 );
    return new THREE.Points( particleGeometry, particleMaterial );
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
        const xyz = helixCenters[i];
        const n = helixNormals[i];
        
        const x = params.scale * (xyz[0] + n[0] * params.rad);
        const y = params.scale * (xyz[1] + n[1] * params.rad);
        const z = params.scale * (xyz[2] + n[2] * params.rad);
        
        vertices.push(...[x,y,z]);
    }
    ele.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const particles = new THREE.Points( ele.geometry, ele.material );
    particles.name = 'Particles';
    protein.add(particles);
}

function populateProteinTubeWithNTypesOfEle( protein, eles ) {
    const helixCenters = paths['helixCenters'];     
    const helixNormals = paths['helixNormals'];

    let vertices = []
    for (let i = 0; i < eles.length; i++) {
        vertices.push([]);
    }

    for (let i = 0; i < helixCenters.length; i++) {
        const xyz = helixCenters[i];
        const n = helixNormals[i];
        
        // make a double helix tube around the main chain
        const x1 = params.scale * (xyz[0] + n[0] * params.rad);
        const y1 = params.scale * (xyz[1] + n[1] * params.rad);
        const z1 = params.scale * (xyz[2] + n[2] * params.rad);

        const x2 = params.scale * (xyz[0] - n[0] * params.rad);
        const y2 = params.scale * (xyz[1] - n[1] * params.rad);
        const z2 = params.scale * (xyz[2] - n[2] * params.rad);

        const res = Math.round(Math.abs((helixCenters[i][0] + helixCenters[i][1] + helixCenters[i][2]))) % eles.length;
        vertices[res].push(...[x1,y1,z1]);
        if ( params.numStrands === 2 ) {
            vertices[res].push(...[x2,y2,z2]);
        }        
    }

    for (let i = 0; i < eles.length; i++) {
        eles[i].geometry.setAttribute(
            'position', 
            new THREE.Float32BufferAttribute(vertices[i], 3)
        );

        const particles = new THREE.Points( eles[i].geometry, eles[i].material );
        particles.name = 'Particles';
        protein.add(particles);
    }
}

function addProteinToScene( scene ) {
    // define 'building blocks'
    setUnitLen();

    const sphere = getSpherePrimitive();
    const particle0 = getParticlePrimitive( params.tex['0']);
    const particle1 = getParticlePrimitive( params.tex['1']);

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

    // populateMainProteinChain(protein, sphere);
    populateProteinTubeWithNTypesOfEle(protein, [particle0, particle1]);

    
    // adjust protein position/rotation
    protein.rotation.set(params.xRot, params.yRot, params.zRot);
    protein.position.set(params.xPos, params.yPos, params.zPos);
    scene.add(protein);
}