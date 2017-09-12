import {Renderer} from "./Renderer";
import {RealityException} from "../lib/RealityException";
import {AU} from "../lib/Units";
import {EARTH} from "../extra/data/milkyWay/solarSystem";

class ThreeRenderer extends Renderer {

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
        //this.camera.position.x = EARTH.RADIUS * 2;
        //this.camera.position.y = EARTH.RADIUS * 60;
        //this.camera.rotation.x = -90 * Math.PI / 180;
        //window.C = this.camera;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        for (const thing of this.universe.bodies) {
            console.log(thing.size.x, thing.size.y, thing.size.z);
            thing.render = new THREE.Mesh(
                new THREE.CubeGeometry(thing.size.x, thing.size.y, thing.size.z),
                new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}) //, side:THREE.BackSide
            );
            this.scene.add(thing.render);
        }

        document.body.appendChild(this.renderer.domElement);

        const renderModel = new THREE.RenderPass(this.scene, this.camera),
            effectFilm = new THREE.FilmPass(0.35, 0.75, 2048, false);

        effectFilm.renderToScreen = true;

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(renderModel);
        this.composer.addPass(effectFilm);

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

        this.composer.render(delta);
        //this.renderer.render(this.scene, this.camera);
    }

}

export {ThreeRenderer};