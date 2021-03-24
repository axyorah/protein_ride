const scaleRng = document.querySelector('#scale');
const scaleLbl = document.querySelector('#scale-lbl');

const xPosRng = document.querySelector('#pos-x');
const xPosLbl = document.querySelector('#pos-x-lbl');
const yPosRng = document.querySelector('#pos-y');
const yPosLbl = document.querySelector('#pos-y-lbl');
const zPosRng = document.querySelector('#pos-z');
const zPosLbl = document.querySelector('#pos-z-lbl');

const xRotRng = document.querySelector('#rot-x');
const xRotLbl = document.querySelector('#rot-x-lbl');
const yRotRng = document.querySelector('#rot-y');
const yRotLbl = document.querySelector('#rot-y-lbl');
const zRotRng = document.querySelector('#rot-z');
const zRotLbl = document.querySelector('#rot-z-lbl');

const radRng = document.querySelector('#rad-strand');
const radLbl = document.querySelector('#rad-strand-lbl');
const numStrandsRng = document.querySelector('#num-strands');
const numStrandsLbl = document.querySelector('#num-strands-lbl');
const particleSizeRng = document.querySelector('#particle-size');
const particleSizeLbl = document.querySelector('#particle-size-lbl');

const playBtn = document.querySelector('#button_start');
const pauseBtn = document.querySelector('#button_stop');
const restartBtn = document.querySelector('#button_restart');


scaleRng.addEventListener("input", () => {
    const val = parseFloat(scaleRng.value);
    params.scale = val;

    scaleLbl.innerText = `${scaleLbl.innerText.split(":")[0]}: ${val}`;

    addProteinToScene( scene )
})

xPosRng.addEventListener("input", () => {
    const val = parseFloat(xPosRng.value);
    params.xPos = val;

    xPosLbl.innerText = `${xPosLbl.innerText.split(":")[0]}: ${val}`;

    addProteinToScene( scene )
})

yPosRng.addEventListener("input", () => {
    const val = parseFloat(yPosRng.value);
    params.yPos = val;

    yPosLbl.innerText = `${yPosLbl.innerText.split(":")[0]}: ${val}`;

    addProteinToScene( scene )
})

zPosRng.addEventListener("input", () => {
    const val = parseFloat(zPosRng.value);
    params.zPos = val;

    zPosLbl.innerText = `${zPosLbl.innerText.split(":")[0]}: ${val}`;

    addProteinToScene( scene )
})

xRotRng.addEventListener("input", () => {
    const val = parseFloat(xRotRng.value);
    params.xRot = val / 360 * 2 * Math.PI;

    xRotLbl.innerText = `${xRotLbl.innerText.split(":")[0]}: ${val}`;

    addProteinToScene( scene )
})

yRotRng.addEventListener("input", () => {
    const val = parseFloat(yRotRng.value);
    params.yRot = val / 360 * 2 * Math.PI;

    yRotLbl.innerText = `${yRotLbl.innerText.split(":")[0]}: ${val}`;

    addProteinToScene( scene )
})

zRotRng.addEventListener("input", () => {
    const val = parseFloat(zRotRng.value);
    params.zRot = val / 360 * 2 * Math.PI;

    zRotLbl.innerText = `${zRotLbl.innerText.split(":")[0]}: ${val}`;

    addProteinToScene( scene )
})

radRng.addEventListener("input", () => {
    const val = parseFloat(radRng.value);
    params.rad = val;

    radLbl.innerText = `${radLbl.innerText.split(":")[0]}: ${val}`;

    addProteinToScene( scene )
})

numStrandsRng.addEventListener("input", () => {
    const val = parseInt(numStrandsRng.value);
    params.numStrands = val;

    numStrandsLbl.innerText = `${numStrandsLbl.innerText.split(":")[0]}: ${val}`;
    addProteinToScene( scene );
})

particleSizeRng.addEventListener("input", () => {
    const val = parseFloat(particleSizeRng.value);
    params.particleSize = val;

    particleSizeLbl.innerText = `${particleSizeLbl.innerText.split(":")[0]}: ${val}`;
    addProteinToScene( scene );
})

playBtn.addEventListener("click", () => {
    cm.restart();
})

pauseBtn.addEventListener("click", () => {
    cm.stop();
})

restartBtn.addEventListener("click", () => {
    cm.start();
})

document.addEventListener("keydown", (evt) => {
    const step = 0.5;
    console.log(evt)

    const xyzCam = camera.position;
    const xyzTar = cameraControls.target;
    
    const delta = new THREE.Vector3(
        xyzTar.x - xyzCam.x, xyzTar.y - xyzCam.y, xyzTar.z - xyzCam.z
    ).normalize().multiplyScalar(step);
    
    if ( evt.code === 'KeyS' ) {
        delta.multiplyScalar(-1);
    } else if ( evt.code === 'KeyA' ) {
        delta.applyAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    } else if ( evt.code === 'KeyD' ) {
        delta.applyAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2);
    } else if ( evt.code === 'KeyQ' ) {
        delta.applyAxisAngle(new THREE.Vector3(0,1,0), Math.PI/4);
    } else if ( evt.code === 'KeyE' ) {
        delta.applyAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/4);
    }

    if ( evt.code === 'KeyW' || 
         evt.code === 'KeyS' || 
         evt.code === 'KeyA' || 
         evt.code === 'KeyD' || 
         evt.code === 'KeyQ' ||
         evt.code === 'KeyE' ) {
        camera.position.add(delta);
        cameraControls.target.add(delta);
    }
})