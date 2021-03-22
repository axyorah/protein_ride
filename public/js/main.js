let camera, scene, renderer, cameraControls, skyTexture;
const clock = new THREE.Clock();
const container = document.querySelector("#container");

function fillScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xA01090, 200, 400);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0x222222);

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(-500, 0, 500);
    light1.castShadow = true;

    const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
    light2.position.set(0, 0, 500);
    light2.castShadow = true;

    scene.add(ambientLight);
    scene.add(light1);
    scene.add(light2);

    // SKYBOX
    scene.background = skyTexture;

    // GROUND
    const ground = getGrid();
    scene.add(ground);

    // TEXT
    addTextToScene(scene);

    // PROTEIN
    addProteinToScene(scene);
}

function setRenderer(w, h) {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.domElement.setAttribute("id", "renderer");
    renderer.setClearColorHex;
}

function setCamera(ratio) {
    camera = new THREE.PerspectiveCamera(40, ratio, 1, 10000);
    //camera.position.set(-5.17, 7.44, 28.93);
    //camera.position.set(16.69, 6.48, 26.37);
    camera.position.set(16.19, 8.65, 33.98);
}

function setControls() {
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(2.24, 0.03, 0.15);
}

function loadTextures() {    
    // set static textures
    for (let name in params.tex) {
        params.tex[name] = new THREE.TextureLoader().load(`imgs/${name}.png`);
    }
}

function init() {
    skyTexture = getSkybox();

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    setRenderer(canvasWidth, canvasHeight);
    setCamera(canvasRatio);
    setControls();
    loadTextures();
}

function addToDOM() {
    // there should only be one canvas - current renderer.domElement
    const canvas = container.getElementsByTagName("canvas");
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.prepend(renderer.domElement); // prepending, so that gui is on top
}

function render() {

    let delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera);
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

window.addEventListener('resize', () => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    camera.aspect = canvasRatio; 
    camera.updateProjectionMatrix();
    renderer.setSize(canvasWidth, canvasHeight); 
});

// run all
function main() {
    init();      // sets up camera, controls and renderer, as well as preloads all textures
    fillScene(); // lights and shell are added here
    addToDOM();  // adds rendered scene back to html
    animate();   // updates frames when camera changes position or controls are toggled    
}

main();