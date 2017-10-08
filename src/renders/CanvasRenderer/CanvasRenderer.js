import {Renderer} from "../Renderer";
import {TargetControl} from "./TargetControl";
import {DragControl} from "./DragControl";
import {ZoomControl} from "./ZoomControl";

//still 2d for now

class CanvasRenderer extends Renderer {

    constructor() {
        super(...arguments);
        this.pan = {x: 0, y: 0, z: 0};
        this.initialScale = this.scale;
    }

    setup() {

        let spaceSize = this.renderDomTarget.getBoundingClientRect();

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', spaceSize.width + 'px');
        this.canvas.setAttribute('height', spaceSize.height + 'px');
        this.context = this.canvas.getContext('2d');

        this.renderDomTarget.appendChild(this.canvas);

        for (const body of this.bodiesForSetup()) {

        }

        return super.setup();
    }

    update(delta, time) {

        const context = this.context;

        let spaceSize = this.renderDomTarget.getBoundingClientRect();

        spaceSize = {
            x: spaceSize.width,
            y: spaceSize.height,
            z: 0
        };

        if (!this.initialSpaceSize) {
            this.initialSpaceSize = spaceSize;
        }

        context.clearRect(0, 0, this.initialSpaceSize.x, this.initialSpaceSize.y);

        for (const body of this.universe.bodies) {

            const toRadius = this.scaled(body.size.x) / 2;

            const position = body.position.mapTo((v, n) =>
                (
                    (this.pan[n] * this.absoluteScale)
                    + this.scaled((body.position[n]))
                    + ((this.initialSpaceSize[n]) * this.absoluteScale / 2)
                )
            );

            context.beginPath();
            context.arc(position[0], position[1], toRadius, 0, 2 * Math.PI, false);
            context.fillStyle = 'green';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = '#003300';
            context.stroke();

        }

    }

}

CanvasRenderer.TargetControl = TargetControl;
CanvasRenderer.DragControl = DragControl;
CanvasRenderer.ZoomControl = ZoomControl;

export {CanvasRenderer};