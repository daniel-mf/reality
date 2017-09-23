import {Renderer} from "./Renderer";

//still 2d for now

class CSSRenderer extends Renderer {

    constructor() {
        super(...arguments);
        this.zoomHelper = {};
        this.pan = {x: 0, y: 0, z: 0};
        this.initialScale = this.scale;
        this.showZoomHelper = false;
        this.zooming = false;
    }

    startOrbiting(body) {
        this.universe.target = body;
        console.log(`orbiting: ${body.name}`);
    }

    setup() {

        let index = 1;
        for (const thing of this.universe.bodies) {
            this.renderDomTarget.appendChild(
                this.createBodyElement(thing)
            );
            thing.render.style.zIndex = index++;
        }

        if (this.orbitControlsActive) {
            for (const body of this.universe.bodies) {
                body.render.addEventListener('dblclick', e => this.startOrbiting(body));
            }
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

        if (!this.initialSpaceSize) {
            this.initialSpaceSize = spaceSize;
        }

        for (const body of this.universe.bodies) {

            let shouldUpdateRender = true;

            const toWidth = (body.size.x * this.scale);
            const toHeight = (body.size.y * this.scale);

            const position = body.position.mapTo((v, n) =>
                (
                    (this.pan[n] * this.absoluteScale)
                    + ((body.position[n]) * (this.initialSpaceSize[n] ? 1 : 0) * this.scale)
                    + ((this.initialSpaceSize[n]) * this.absoluteScale / 2) - (
                        (body.size[n] * (this.initialSpaceSize[n] ? 1 : 0) * this.scale)// * 2
                    ) / 2
                )
            );

            if (body.render.currentPosition) {
                shouldUpdateRender =
                    body.render.currentPosition[0] + toWidth > 0
                    && body.render.currentPosition[1] + toHeight > 0
                    && body.render.currentPosition[0] < spaceSize.x
                    && body.render.currentPosition[1] < spaceSize.y;
            }

            body.render.classList[shouldUpdateRender ? 'add' : 'remove']('visible');

            if (shouldUpdateRender) {

                body.render.classList[this.universe.target === body ? 'add' : 'remove']('target');

                body.render.querySelector('.info').innerHTML = `
                    <div>(x) Position: ${body.position.x}</div>
                    <div>(x) Velocity: ${body.velocity.x}</div>
                    <div>Time Dilatation at core: ${-(1 - body.eventDeltaDilatation) * 100}%</div>
                    <div>Date at core: ${body.currentDate}</div>
                `;

                //alternative to scaling to avoid scaling bug on chrome
                body.render.style.width = toWidth + 'px';
                body.render.style.height = toHeight + 'px';

                body.render.style.transform = ['translate3d(' + (position.map(v => v + 'px').join(',')) + ')',
                    //scaling has some rendering bugs on chrome
                    //'scale(' + this.absoluteScale + ')',
                ].join(' ');

            }

            body.render.currentWidth = toWidth;
            body.render.currentHeight = toHeight;
            body.render.currentPosition = position;

        }

        this.removeHiddenSmallerBodies();

    }

    removeHiddenSmallerBodies() {
        let bodyInvisible = false;
        for (const body of this.universe.bodies) {

            if (!body.render.classList.contains('visible')) {
                continue;
            }

            for (const otherBody of this.universe.bodies) {
                if (body !== otherBody) {

                    const tooCloseX = Math.abs(
                        (body.render.currentPosition[0] + (body.render.currentWidth / 2))
                        - (otherBody.render.currentPosition[0] + (otherBody.render.currentWidth / 2))
                        ) < 20,
                        tooCloseY = Math.abs(
                            (body.render.currentPosition[1] + (body.render.currentHeight / 2))
                            - (otherBody.render.currentPosition[1] + (otherBody.render.currentHeight / 2))
                        ) < 20;

                    bodyInvisible = tooCloseX && tooCloseY && body.volume < otherBody.volume;

                    body.render.classList[bodyInvisible ? 'remove' : 'add']('visible');

                    if (bodyInvisible) {
                        break;
                    }

                }
            }

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

    setupOrbitControl() {

        this.orbitControlsActive = true;

        const getBiggestInScreen = () => {
            let volume = 0, selected = null;
            for (const body of this.universe.bodies) {
                if (body.render.classList.contains('visible')) {
                    if (body.volume > volume) {
                        volume = body.volume;
                        selected = body;
                    }
                }
            }
            return selected;
        };

        window.addEventListener('keydown', e => {
            if (e.key.toLowerCase() !== 'o') return;

            e.preventDefault();

            const body = getBiggestInScreen();

            if (this.universe.target === body) {
                console.log(`orbiting off`);
                this.universe.target = null;
                return;
            }

            if (body) {
                this.startOrbiting(body);
            }

        });

    }
}

export {CSSRenderer};