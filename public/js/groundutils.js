function getGroundTexture() {
   return new THREE.TextureLoader().load( '../imgs/tile.png' );
}

function getGrid() {
    const size = 1000;
    const divisions = 500;
    
    return new THREE.GridHelper( size, divisions, 0x49E6FF, 0x49E6FF );
}