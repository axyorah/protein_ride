let camera, cm, scene, renderer, cameraControls, skyTexture, ground;
const clock = new THREE.Clock();
const container = document.querySelector("#container");

class CameraMotion {
    constructor(camera, cameraControls) {
        this.camera = camera;
        this.cameraControls = cameraControls;
        this.time = 0;
        this.idx = 0;
        this.on = false;

        this.skip = 2; // skip some frames to regulate speed

        this.connecting = false;
        this.connectSpeed = 0.1; // [dist units / second]
        this.connectTime = 0; // [second]
        this.connectDelta = 0.0001; // [dist units]
        this.startPos = undefined; // Vector3
        this.startDir = undefined; // Vector3
        // this.endPos = new THREE.Vector3(...paths.helixCenters[0])
        //     .multiplyScalar(params.scale)
        //     .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos)); // Vector3 // TODO: rotation
        // this.endTar = new THREE.Vector3(...paths.helixCenters[10])
        //     .multiplyScalar(params.scale)
        //     .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos)); // Vector3 // TODO: rotation
    }

    start() {
        this.on = true;
        this.idx = 0;
        this.time = 0;
        
        this.setConnectionEndpoint(
            new THREE.Vector3(...paths.helixCenters[0])
                .multiplyScalar(params.scale)
                .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos)), 
            new THREE.Vector3(...paths.helixCenters[10])
                .multiplyScalar(params.scale)
                .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos))
        );
        this.connect(clock.getDelta());
    }

    stop() {
        this.on = false;
    }

    restart() {
        this.on = true;
        
        this.setConnectionEndpoint(
            new THREE.Vector3(...paths.helixCenters[this.idx / this.skip])
                .multiplyScalar(params.scale)
                .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos)),
            new THREE.Vector3(...paths.helixCenters[this.idx / this.skip + 10])
                .multiplyScalar(params.scale)
                .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos))
        );
        this.connect(clock.getDelta());
    }

    setConnectionEndpoint(position, target) {
        this.endPos = position;
        this.endTar = target;
    }

    connect(delta) {
        if (!this.on) {
            return
        }
        if (!this.connecting) {
            this.connecting = true;
            this.startPos = this.camera.position;
            this.startTar = this.cameraControls.target;
            // this.endPos = new THREE.Vector3(...paths.helixCenters[this.idx])
            //     .multiplyScalar(params.scale)
            //     .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos)); // TODO: rotation
            // this.endTar = new THREE.Vector3(...paths.helixCenters[this.idx + 10])
            //     .multiplyScalar(params.scale)
            //     .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos)); // TODO: rotation
        }
        if (this.camera.position.distanceTo(this.endPos) < this.connectDelta) {
            this.connecting = false;
            this.connectTime = 0;
            return;
        }

        this.connectTime += delta;
        const alpha = Math.min(1, this.connectTime * this.connectSpeed / this.startPos.distanceTo(this.endPos));
        this.camera.position.lerp(this.endPos, alpha);
        this.cameraControls.target.lerp(this.endTar, alpha);
    }

    move(delta) {
        if (!this.on) {
            return;
        }

        //this.time += delta;  

        if (this.connecting) {
            return this.connect(delta);
        }

        if (!(this.idx % this.skip) && this.idx / this.skip < paths.helixCenters.length - 10) {
            const i = this.idx / this.skip;            

            const xc = paths.helixCenters[i][0] * params.scale + params.xPos;
            const yc = paths.helixCenters[i][1] * params.scale + params.yPos;
            const zc = paths.helixCenters[i][2] * params.scale + params.zPos;

            const xt = paths.helixCenters[i + 10][0] * params.scale + params.xPos;
            const yt = paths.helixCenters[i + 10][1] * params.scale + params.yPos;
            const zt = paths.helixCenters[i + 10][2] * params.scale + params.zPos;

            this.camera.position.set(...[xc, yc, zc]);
            this.cameraControls.target.set(...[xt, yt, zt]);
        }
        this.idx += 1;
    }
}

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
    //camera.position.set(-5.17, 7.44, 28.93);
    //camera.position.set(16.69, 6.48, 26.37);
    //camera.position.set(16.19, 8.65, 33.98);
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