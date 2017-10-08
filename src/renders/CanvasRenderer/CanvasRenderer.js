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

            if (!body.render) {
                body.render = {};
            }

            let shouldRender = true;

            const toRadius = this.scaled(body.size.x) / 2;

            const position = body.position.mapTo((v, n) =>
                (
                    (this.pan[n] * this.absoluteScale)
                    + this.scaled((body.position[n]))
                    + ((this.initialSpaceSize[n]) * this.absoluteScale / 2)
                )
            );

            if (body.render.currentPosition) {
                shouldRender =
                    body.render.currentPosition[0] + toRadius > 0
                    && body.render.currentPosition[1] + toRadius > 0
                    && body.render.currentPosition[0] - toRadius < spaceSize.x
                    && body.render.currentPosition[1] - toRadius < spaceSize.y;
            }

            body.render.visible = shouldRender;
            body.render.toRadius = toRadius;
            body.render.currentPosition = position;

        }

        this.removeHiddenSmallerBodies();

        this.drawBodies();

    }

    drawBodies() {
        const context = this.context;
        for (const body of this.universe.bodies) {
            if (body.render.visible) {
                context.beginPath();

                context.arc(
                    body.render.currentPosition[0], body.render.currentPosition[1],
                    body.render.toRadius, 0, 2 * Math.PI,
                    false
                );

                context.fillStyle = this.universe.target === body ? 'green' : 'gray';
                context.fill();

                context.font = "12px monospaced";
                context.fillStyle = this.universe.target === body ? 'lightgreen' : 'white';
                context.textAlign = "center";
                context.fillText(body.name, body.render.currentPosition[0], body.render.currentPosition[1] + 3);
            }
        }
    }

    removeHiddenSmallerBodies() {
        let bodyInvisible = false;
        for (const body of this.universe.bodies) {

            if (!body.render.visible) {
                continue;
            }

            for (const otherBody of this.universe.bodies) {
                if (body !== otherBody) {

                    const tooCloseX = Math.abs(
                        (body.render.currentPosition[0] + (body.render.toRadius / 2))
                        - (otherBody.render.currentPosition[0] + (otherBody.render.toRadius / 2))
                        ) < 20,
                        tooCloseY = Math.abs(
                            (body.render.currentPosition[1] + (body.render.toRadius / 10))
                            - (otherBody.render.currentPosition[1] + (otherBody.render.toRadius / 10))
                        ) < 20;

                    bodyInvisible = tooCloseX && tooCloseY && body.volume < otherBody.volume;

                    body.render.visible = !bodyInvisible;

                    if (bodyInvisible) {
                        break;
                    }

                }
            }

        }
    }

}

CanvasRenderer.TargetControl = TargetControl;
CanvasRenderer.DragControl = DragControl;
CanvasRenderer.ZoomControl = ZoomControl;

export {CanvasRenderer};