import {Renderer} from "./Renderer";


class CSSRenderer extends Renderer {

    constructor() {
        super(...arguments);
        this.zoomHelper = {};
        this.pan = {x: 0, y: 0, z: 0};
        this.initialScale = this.scale;
        this.showZoomHelper = false;
        this.zooming = false;
    }

    setup() {

        for (const thing of this.universe.bodies) {
            this.renderDomTarget.appendChild(
                this.createBodyElement(thing)
            );
        }

        return true;
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
        body.render = element;
        return element;
    }

    update(delta, time) {

        let spaceSize = this.renderDomTarget.getBoundingClientRect();
        spaceSize = {
            x: spaceSize.width,
            y: spaceSize.height,
            z: 0
        };

        for (const thing of this.universe.bodies) {

            thing.render.querySelector('.info').innerHTML = `
            <div>(x) Position: ${thing.position.x}</div>
            <div>(x) Velocity: ${thing.velocity.x}</div>
            <div>Time Dilatation at core: ${-(1-thing.eventDeltaDilatation) * 100}%</div>
            <div>Date at core: ${thing.currentDate}</div>
            `;

            //alternative to scaling to avoid scaling bug on chrome
            thing.render.style.width = (thing.size.x * this.scale) + 'px';
            thing.render.style.height = (thing.size.y * this.scale) + 'px';

            thing.render.style.transform = [
                'translate3d(' + (thing.position.mapTo((v, n) => (
                    Math.round(
                        ((this.pan[n] * this.absoluteScale)
                            + ((thing.position[n]) * (spaceSize[n] ? 1 : 0) * this.scale)
                            + ((spaceSize[n]) * this.absoluteScale / 2) - (
                                (thing.size[n] * (spaceSize[n] ? 1 : 0) * this.scale)// * 2
                            ) / 2)
                    )
                ) + 'px').join(',')) + ')',

                //scaling has some rendering bugs on chrome
                //'scale(' + this.absoluteScale + ')',

            ].join(' ');
        }
    }

    setupDragControl() {

        let dragActive = false,
            dragStart = null,
            lastDrag = null,
            dragSpeed = {x: 0, y: 0};


        this.renderDomTarget.addEventListener('mousedown', e => {
            dragSpeed = {x: 0, y: 0};
            dragActive = true;
        });

        window.addEventListener('mousemove', e => {
            if (dragActive) {

                if (!dragStart) {
                    dragStart = {x: e.clientX, y: e.clientY};
                    this.renderDomTarget.classList.add('dragging');
                }

                if (lastDrag) {
                    dragSpeed.x = e.clientX - lastDrag.x;
                    dragSpeed.y = e.clientY - lastDrag.y;
                }

                this.pan.x += dragSpeed.x / (this.scale / this.initialScale);
                this.pan.y += dragSpeed.y / (this.scale / this.initialScale);

                if (this.showZoomHelper) {
                    if (this.zoomHelper.element) {
                        this.zoomHelper.element.style.left = (this.pan.x * this.absoluteScale)
                            - (this.zoomHelper.x * this.absoluteScale) + 'px';
                        this.zoomHelper.element.style.top = (this.pan.y * this.absoluteScale)
                            - (this.zoomHelper.y * this.absoluteScale) + 'px';
                    }
                }

                lastDrag = {x: e.clientX, y: e.clientY};

            }
        });

        window.addEventListener('mouseup', e => {
            dragActive = false;
            dragStart = null;
            lastDrag = null;
            this.renderDomTarget.classList.remove('dragging');
        });

    }

    setupZoomControl() {

        let zoomTimer;

        this.renderDomTarget.addEventListener('mousewheel', e => {

            e.preventDefault();

            clearTimeout(zoomTimer);

            if (!this.zooming) {
                if (this.showZoomHelper) {
                    if (!this.zoomHelper.element) {
                        let pamElement = document.createElement('div');
                        pamElement.classList.add('zoomHelper');
                        this.renderDomTarget.appendChild(pamElement);
                        this.zoomHelper.element = pamElement;
                    } else {
                        this.zoomHelper.element.classList.remove('gone');
                    }
                    this.zoomHelper.scale = this.absoluteScale;
                    this.zoomHelper.x = this.pan.x;
                    this.zoomHelper.y = this.pan.y;
                }
                this.zooming = true;
            }

            zoomTimer = setTimeout(() => {
                if (this.zoomHelper.element) {
                    this.zoomHelper.element.classList.add('gone');
                }
                this.zooming = false;
            }, 200);

            const spaceSize = this.renderDomTarget.getBoundingClientRect();

            const change = e.deltaY / 100,
                previousScale = this.absoluteScale;

            this.scale -= change * this.scale * 0.1;
            this.absoluteScale -= change * this.absoluteScale * 0.1;

            const scaleChange = (this.absoluteScale / previousScale) - 1;

            this.pan.x -= ((e.clientX / spaceSize.width)
                * (spaceSize.width / (spaceSize.width * this.absoluteScale))) * spaceSize.width * scaleChange;

            this.pan.y -= ((e.clientY / spaceSize.height)
                * (spaceSize.height / (spaceSize.height * this.absoluteScale))) * spaceSize.height * scaleChange;

            if (this.showZoomHelper) {
                this.zoomHelper.element.style.width = (spaceSize.width * (this.absoluteScale / this.zoomHelper.scale)) + 'px';
                this.zoomHelper.element.style.height = (spaceSize.height * (this.absoluteScale / this.zoomHelper.scale)) + 'px';
                this.zoomHelper.element.style.left = (this.pan.x * this.absoluteScale) - (this.zoomHelper.x * this.absoluteScale) + 'px';
                this.zoomHelper.element.style.top = (this.pan.y * this.absoluteScale) - (this.zoomHelper.y * this.absoluteScale) + 'px';
            }

            //updateScaleSample();

        });

    }

}

export {CSSRenderer};