function getSkybox() {

    const loader = new THREE.CubeTextureLoader();
    loader.setPath( '../imgs/skybox/' );

    const textureCube = loader.load( [
	    'px.png', 'nx.png',
	    'py.png', 'ny.png',
	    'pz.png', 'nz.png'
    ] );

    return textureCube;
}