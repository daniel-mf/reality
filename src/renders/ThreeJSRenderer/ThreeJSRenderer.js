import {Renderer} from "../Renderer";
import {RealityException} from "../../lib/RealityException";
import {AU} from "../../lib/Units";

class ThreeJSRenderer extends Renderer {

    constructor() {
        super(...arguments);
    }

    set scene(scene) {
        this._scene = scene;
    }

    get scene() {
        return this._scene;
    }

    set camera(camera) {
        this._camera = camera;
    }

    get camera() {
        return this._camera;
    }

    set renderer(renderer) {
        this._renderer = renderer;
    }

    get renderer() {
        return this._renderer;
    }

    setup() {

        if (typeof THREE === 'undefined') {
            throw new RealityException('three.js not included');
        } else if (THREE.REVISION < 86) {
            throw new RealityException('three.js most be newer than 85');
        }

        if (!this.scene) {
            this.scene = new THREE.Scene();
        }

        if (!this.camera) {
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, this.scaled(AU * 2));
            this.camera.position.z = this.scaled(AU);
        }

        if (!this.renderer) {
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        for (const body of this.bodiesForSetup()) {
            body.render = new THREE.Mesh(
                new THREE.CubeGeometry(
                    this.scaled(body.size.x),
                    this.scaled(body.size.y),
                    this.scaled(body.size.z)
                ),
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
                this.scaled(thing.position.x),
                this.scaled(thing.position.y),
                this.scaled(thing.position.z)
            );
        }

        this.renderer.render(this.scene, this.camera);
    }

}

export {ThreeJSRenderer};