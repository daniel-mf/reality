import {Renderer} from "../Renderer";
import {RealityException} from "../../lib/RealityException";
import {AU} from "../../lib/Units";

class ThreeJSRenderer extends Renderer {

    constructor() {
        super(...arguments);
    }

    setup() {

        if (typeof THREE === 'undefined') {
            throw new RealityException('three.js not included');
        } else if (THREE.REVISION < 86) {
            throw new RealityException('three.js most be newer than 85');
        }

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, AU * 2);
        this.camera.position.z = AU;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        for (const body of this.bodiesForSetup()) {
            body.render = new THREE.Mesh(
                new THREE.CubeGeometry(body.size.x, body.size.y, body.size.z),
                new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}) //, side:THREE.BackSide
            );
            this.scene.add(body.render);
        }

        document.body.appendChild(this.renderer.domElement);

        return super.setup();

    }

    update(delta, time) {

        for (const thing of this.universe.bodies) {
            thing.render.position.set(
                thing.position.x,
                thing.position.y,
                thing.position.z
            );
        }

        this.renderer.render(this.scene, this.camera);
    }

}

export {ThreeJSRenderer};