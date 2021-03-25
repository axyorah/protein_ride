let camera, cameraControls, cameraMotion;
let scene, renderer;
let skyTexture, ground;
const clock = new THREE.Clock();
const container = document.querySelector("#container");

function fillScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xA01090, 10, 400);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0x881188);

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(-500, 100, 500);
    light1.castShadow = true;

    const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
    light2.position.set(0, 50, 500);
    light2.castShadow = true;

    scene.add(ambientLight);
    scene.add(light1);
    scene.add(light2);

    // SKYBOX
    scene.background = skyTexture;

    // GROUND
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

function setCamera(width, height) {
    camera = new THREE.PerspectiveCamera(100, width / height, 1, 10000);
    camera.position.set(2.27, 5.09, 77.07);
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
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    setRenderer(canvasWidth, canvasHeight);
    setCamera(canvasWidth, canvasHeight);
    setControls();
    loadTextures();

    skyTexture = getSkybox();
    ground = getGrid();

    cameraMotion = new CameraMotion(camera, cameraControls);
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

    const delta = clock.getDelta();
    cameraControls.update(delta);
    cameraMotion.move(delta);

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