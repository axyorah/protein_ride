let camera, cm, scene, renderer, cameraControls, skyTexture, ground;
const clock = new THREE.Clock();
const container = document.querySelector("#container");

class CameraMotion {
    constructor(camera, cameraControls, deltaTime) {
        this.camera = camera;
        this.cameraControls = cameraControls;
        this.deltaTime = deltaTime === undefined ? 0.1 : deltaTime;
        this.time = 0;
        this.idx = 0;
        this.on = false;
    }

    start() {
        this.on = true;
        this.idx = 0;
        this.time = 0;
        this.move();
    }

    stop() {
        this.on = false;
    }

    restart() {
        this.on = true;
        this.move(0);
    }

    move(delta) {
        if (!this.on) {
            return;
        }

        const skip = 2;
        this.time += delta; //this.time > this.deltaTime && 

        if (!(this.idx % skip) && this.idx / skip < paths.helixCenters.length - 10) {
            const i = this.idx / skip;
            this.time -= this.deltaTime;

            const xc = paths.helixCenters[i][0] * params.scale;
            const yc = paths.helixCenters[i][1] * params.scale;
            const zc = paths.helixCenters[i][2] * params.scale;

            const xt = paths.helixCenters[i + 10][0] * params.scale;
            const yt = paths.helixCenters[i + 10][1] * params.scale;
            const zt = paths.helixCenters[i + 10][2] * params.scale;

            this.camera.position.set(...[xc, yc, zc]);
            this.cameraControls.target.set(...[xt, yt, zt]);
        }
        this.idx += 1;
    }
}

function fillScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xA01090, 50, 250);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0x881188);

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

// async function loadBlenderModels() {
//     console.log('loading blender models');
//     const loader = new THREE.GLTFLoader();

//     await loader.load( '../blender/mads-scientist-with-triangle-0.glb', async (gltf) => {
//         blenderText = await gltf;
//         console.log('inner', gltf);
//     });
//     console.log('outer', blenderText)
// }

function init() {
    skyTexture = getSkybox();
    ground = getGrid();

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    setRenderer(canvasWidth, canvasHeight);
    setCamera(canvasWidth, canvasHeight);
    setControls();
    loadTextures();

    cm = new CameraMotion(camera, cameraControls);
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

    cm.on = true;
    cm.move(delta);

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