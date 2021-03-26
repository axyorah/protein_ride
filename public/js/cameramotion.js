class CameraMotion {
    constructor(camera, cameraControls) {
        this.camera = camera;
        this.cameraControls = cameraControls;
        this.on = false;  // indicates whether we are currently going through the protein chain
        this.time = 0;    // counts time [sec] from the moment the 'on' flag in toggled
        this.frameCounter = 0; // counts all frames from the moment the 'on' flag is toggled
        this.idx = 0;     // idx of current data pt in interpolated prot chain
        
        this.skip = 2; // skip some clock ticks to regulate speed: the more are skipper - the slower the speed

        this.connecting = false;
        this.connectSpeed = 0.1; // [dist units / second]
        this.connectTime = 0; // [second]
        this.connectDelta = 0.0001; // [dist units]
        this.startPos = undefined; // Vector3
        this.startTar = undefined; // Vector3
        this.endPos = undefined; // Vector3
        this.endTar = undefined; // Vector3
    }

    setConnectionEndpoint(position, target) {
        this.endPos = position;
        this.endTar = target;
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
            new THREE.Vector3(...paths.helixCenters[Math.floor(this.idx / this.skip)])
                .multiplyScalar(params.scale)
                .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos)),
            new THREE.Vector3(...paths.helixCenters[Math.floor(this.idx / this.skip) + 10])
                .multiplyScalar(params.scale)
                .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos))
        );
        this.connect(clock.getDelta());
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
        this.skip = 6 - params.speed;

        if (this.connecting) {
            return this.connect(delta);
        }

        // if (!(this.idx % this.skip) && this.counter < paths.helixCenters.length - 10) {
        //     //const i = this.idx / this.skip;  
        //     this.counter += 1;
            
        //     const xyzPos = new THREE.Vector3(...paths.helixCenters[this.counter])
        //         .multiplyScalar(params.scale)
        //         .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos));
        //     const xyzTar = new THREE.Vector3(...paths.helixCenters[this.counter + 10])
        //         .multiplyScalar(params.scale)
        //         .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos));

        //     this.camera.position.set(xyzPos.x, xyzPos.y, xyzPos.z);
        //     this.cameraControls.target.set(xyzTar.x, xyzTar.y, xyzTar.z);
        // }
        // this.idx += 1;

        if (!(this.frameCounter % this.skip) && this.idx < paths.helixCenters.length - 11) {
            this.idx += 1;
            
            const xyzPos = new THREE.Vector3(...paths.helixCenters[this.idx])
                .multiplyScalar(params.scale)
                .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos));
            const xyzTar = new THREE.Vector3(...paths.helixCenters[this.idx + 10])
                .multiplyScalar(params.scale)
                .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos));

            this.camera.position.set(xyzPos.x, xyzPos.y, xyzPos.z);
            this.cameraControls.target.set(xyzTar.x, xyzTar.y, xyzTar.z);
        }
        this.frameCounter += 1;
    }
}