import {RendererPlugin} from "../RendererPlugin";
import {ly} from "../../lib/Units";

class FlyControls extends RendererPlugin {

    setup() {

        const controls = new THREE.FlyControls(this.renderer.camera);

        this.movementDelta = 0;

        controls.movementSpeed = 0;
        controls.domElement = this.renderer.renderDomTarget;
        controls.rollSpeed = Math.PI / 20;
        controls.autoForward = false;
        controls.dragToLook = false;

        this.controls = controls;

        window.addEventListener('mousewheel', e => {

            e.preventDefault();

            //controls.movementSpeed += (e.deltaY / 10) * (controls.movementSpeed || 1) * 0.01;

            //if (controls.movementSpeed < 0) {
            //    controls.movementSpeed = 0;
            // }

            /*console.log(
                this.renderer.scaleString(this.renderer.scaled(controls.movementSpeed)),
            );*/

        });

        return true;

    }

    update(delta) {
        const kph = 40; //this.universe.target.render.position.distanceTo(this.renderer.camera.position);

        this.controls.movementSpeed = this.renderer.scaled(kph * 0.277777778);
        this.controls.update(delta);
    }

}

export {FlyControls};