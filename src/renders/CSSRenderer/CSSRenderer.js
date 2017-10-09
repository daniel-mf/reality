import {Renderer} from "../Renderer";
import {TargetControl} from "./TargetControl";
import {DragControl} from "./DragControl";
import {ZoomControl} from "./ZoomControl";

//still 2d for now

class CSSRenderer extends Renderer {

    constructor() {
        super(...arguments);
        this.hideBodiesTooClose = true;
        this.pan = {x: 0, y: 0, z: 0};
        this.initialScale = this.scale;
    }

    setup() {

        let index = 1;
        for (const body of this.bodiesForSetup()) {
            const element = this.createBodyElement(body);
            this.renderDomTarget.appendChild(element);
            element.style.zIndex = index++;
            this.registerBodyRender(element);
        }

        return super.setup();
    }

    createBodyElement(body) {
        const element = document.createElement('div');
        element.classList.add('body');
        element.innerHTML = `
            <div class="info"></div>
            <div class="name">${body.name}</div>
        `;
        element.style.width = this.scaled(body.size.x) + 'px';
        element.style.height = this.scaled(body.size.y) + 'px';
        return element;
    }

    update(delta, time) {

        let spaceSize = this.renderDomTarget.getBoundingClientRect();

        spaceSize = {
            x: spaceSize.width,
            y: spaceSize.height,
            z: 0
        };

        if (!this.initialSpaceSize) {
            this.initialSpaceSize = spaceSize;
        }

        for (const body of this.universe.bodies) {

            const bodyRender = this.getRenderingFor(body);

            let shouldUpdateRender = true;

            const toWidth = this.scaled(body.size.x);
            const toHeight = this.scaled(body.size.y);

            const position = body.position.mapTo((v, n) =>
                (
                    (this.pan[n] * this.absoluteScale)
                    + this.scaled((body.position[n]))
                    + ((this.initialSpaceSize[n]) * this.absoluteScale / 2) - this.scaled(body.size[n]) / 2
                )
            );

            if (bodyRender.currentPosition) {
                shouldUpdateRender =
                    bodyRender.currentPosition[0] + toWidth > 0
                    && bodyRender.currentPosition[1] + toHeight > 0
                    && bodyRender.currentPosition[0] < spaceSize.x
                    && bodyRender.currentPosition[1] < spaceSize.y;
            }

            bodyRender.classList[shouldUpdateRender ? 'add' : 'remove']('visible');

            if (shouldUpdateRender) {

                bodyRender.classList[this.universe.target === body ? 'add' : 'remove']('target');

                bodyRender.querySelector('.info').innerHTML = `
                    <div>(x) Position: ${body.position.x}</div>
                    <div>(x) Velocity: ${body.velocity.x}</div>
                    <div>Time Dilation at core: ${-(1 - body.eventDeltaDilation) * 100}%</div>
                    <div>Date at core: ${body.currentDate}</div>
                `;

                //alternative to scaling to avoid scaling bug on chrome
                bodyRender.style.width = toWidth + 'px';
                bodyRender.style.height = toHeight + 'px';

                bodyRender.style.transform = [
                    'translate3d('
                    + (position.map((v, i) => (i === 2 ? 0 : v) + 'px').join(','))
                    + ')',
                    //scaling has some rendering bugs on chrome
                    //'scale(' + this.absoluteScale + ')',
                ].join(' ');

            }

            bodyRender.currentWidth = toWidth;
            bodyRender.currentHeight = toHeight;
            bodyRender.currentPosition = position;

        }

        if (this.hideBodiesTooClose) {
            this.removeHiddenSmallerBodies();
        }

    }

    removeHiddenSmallerBodies() {
        let bodyInvisible = false;
        for (const body of this.universe.bodies) {

            const bodyRender = this.getRenderingFor(body);

            if (!bodyRender.classList.contains('visible')) {
                continue;
            }

            for (const otherBody of this.universe.bodies) {
                if (body !== otherBody) {
                    
                    const otherBodyRender = this.getRenderingFor(otherBody);

                    const tooCloseX = Math.abs(
                        (bodyRender.currentPosition[0] + (bodyRender.currentWidth / 2))
                        - (otherBodyRender.currentPosition[0] + (otherBodyRender.currentWidth / 2))
                        ) < 20,
                        tooCloseY = Math.abs(
                            (bodyRender.currentPosition[1] + (bodyRender.currentHeight / 2))
                            - (otherBodyRender.currentPosition[1] + (otherBodyRender.currentHeight / 2))
                        ) < 20;

                    bodyInvisible = tooCloseX && tooCloseY && body.volume < otherBody.volume;

                    bodyRender.classList[bodyInvisible ? 'remove' : 'add']('visible');

                    if (bodyInvisible) {
                        break;
                    }

                }
            }

        }
    }

}

CSSRenderer.TargetControl = TargetControl;
CSSRenderer.DragControl = DragControl;
CSSRenderer.ZoomControl = ZoomControl;

export {CSSRenderer};