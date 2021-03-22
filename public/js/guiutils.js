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

const radRng = document.querySelector('#rad');
const radLbl = document.querySelector('#rad-lbl');

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

    xPosLbl.innerText = `${yPosLbl.innerText.split(":")[0]}: ${val}`;

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
t
    addProteinToScene( scene )
})