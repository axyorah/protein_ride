class CameraMotion {
    constructor(camera, cameraControls, pts, numPts) {
        this.camera = camera;
        this.cameraControls = cameraControls;
        this.numPts = numPts === undefined ? 5 * pts.length : numPts;
        this.pts = new THREE.CatmullRomCurve3(pts).getPoints(this.numPts);

        // this is only valid if scale and position are not changed via gui!!!
        for (let i=0; i < this.pts.length; i++) {
            this.pts[i]
                .multiplyScalar(params.scale)
                .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos))
        }

        this.on = false;  // indicates whether we are currently going through the protein chain
        this.time = 0;    // counts time [sec] from the moment the 'on' flag in toggled
        this.idx = 0;     // idx of current data pt in interpolated prot chain
        
        this.skip = 2;    // skip some data pts to regulate speed

        this.connecting = false;
        this.connectSpeed = 0.1;    // [dist units / second]
        this.connectTime = 0;       // [second]
        this.connectDelta = 0.0001; // [dist units]
        this.startPos = undefined;  // Vector3
        this.startTar = undefined;  // Vector3
        this.endPos = undefined;    // Vector3
        this.endTar = undefined;    // Vector3
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
            this.pts[0]
                // .clone() // uncomment if scale and position can be changed bia gui!!!
                // .multiplyScalar(params.scale)
                // .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos))
                , 
            this.pts[10]
                // .clone()
                // .multiplyScalar(params.scale)
                // .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos))
        );
        this.connect(clock.getDelta());
    }

    stop() {
        this.on = false;
    }

    restart() {
        this.on = true;        
        this.setConnectionEndpoint(
            this.pts[this.idx]
                // .clone() // uncomment if scale and position can be changed bia gui!!!
                // .multiplyScalar(params.scale)
                // .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos))
                , 
            this.pts[this.idx + 10]
                // .clone()
                // .multiplyScalar(params.scale)
                // .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos))
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

    move(delta, speed) {
        if (!this.on) {
            return;
        }

        //this.time += delta; 
        this.skip = speed === undefined ? this.skip : speed;

        if (this.connecting) {
            return this.connect(delta);
        }

        if (this.idx + this.skip < this.pts.length - 10) {            
            this.idx += this.skip;

            //TODO: when scale/position/rotation is fixed - remove all on-the-fly coord adjustment
            const xyzPos = this.pts[this.idx]
                // .clone() // uncomment if scale and position can be changed bia gui!!!
                // .multiplyScalar(params.scale)
                // .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos))
                ;
            const xyzTar = this.pts[this.idx + 10]
                // .clone() // uncomment if scale and position can be changed bia gui!!!
                // .multiplyScalar(params.scale)
                // .add(new THREE.Vector3(params.xPos, params.yPos, params.zPos))
                ;

            this.camera.position.set(xyzPos.x, xyzPos.y, xyzPos.z);
            this.cameraControls.target.set(xyzTar.x, xyzTar.y, xyzTar.z);
        } 
    }
}