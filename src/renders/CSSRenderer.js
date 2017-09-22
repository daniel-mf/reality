import {Renderer} from "./Renderer";


class CSSRenderer extends Renderer {

    constructor() {
        super(...arguments);
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
        element.textContent = body.name;
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

            //alternative to scaling to avoid scaling bug on chrome
            thing.render.style.width = (thing.size.x * this.scale) + 'px';
            thing.render.style.height = (thing.size.y * this.scale) + 'px';

            thing.render.style.transform = [
                'translate3d(' + (thing.position.mapTo((v, n) => (
                    Math.round(
                        ((this.pan[n] * this.absoluteScale)
                            + ((thing.position[n]) * (spaceSize[n] ? 1 : 0) * this.scale)
                            + ((spaceSize[n]) * this.absoluteScale / 2) - (
                                (thing.size[n] * (spaceSize[n] ? 1 : 0) * this.scale) * 2
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

        let pam = {},
            zoomTimer;

        this.renderDomTarget.addEventListener('mousewheel', e => {

            e.preventDefault();

            clearTimeout(zoomTimer);

            if (!this.zooming) {
                if (this.showZoomHelper) {
                    if (!pam.element) {
                        console.log(pam.element);
                        let pamElement = document.createElement('div');
                        pamElement.classList.add('pam');
                        this.renderDomTarget.appendChild(pamElement);
                        pam.element = pamElement;
                    } else {
                        pam.element.classList.remove('gone');
                    }
                    pam.scale = this.absoluteScale;
                    pam.x = this.pan.x;
                    pam.y = this.pan.y;
                }
                this.zooming = true;
            }

            zoomTimer = setTimeout(() => {
                if (pam.element) {
                    pam.element.classList.add('gone');
                }
                this.zooming = false;
            }, 200);

            const spaceSize = this.renderDomTarget.getBoundingClientRect();

            const change = e.deltaY / 100,
                previousScale = this.absoluteScale;

            this.scale -= change * this.scale * 0.1;
            this.absoluteScale -= change * this.absoluteScale * 0.1;

            const scaleChange = (this.absoluteScale / previousScale) - 1;

            this.pan.x -= ((e.clientX / spaceSize.width) * (spaceSize.width / (spaceSize.width * this.absoluteScale))) * spaceSize.width * scaleChange;
            this.pan.y -= ((e.clientY / spaceSize.height) * (spaceSize.height / (spaceSize.height * this.absoluteScale))) * spaceSize.height * scaleChange;

            if (this.showZoomHelper) {
                pam.element.style.width = (spaceSize.width * (this.absoluteScale / pam.scale)) + 'px';
                pam.element.style.height = (spaceSize.height * (this.absoluteScale / pam.scale)) + 'px';
                pam.element.style.left = (this.pan.x * this.absoluteScale) - (pam.x * this.absoluteScale) + 'px';
                pam.element.style.top = (this.pan.y * this.absoluteScale) - (pam.y * this.absoluteScale) + 'px';
            }

            //updateScaleSample();

        });

    }

}

export {CSSRenderer};