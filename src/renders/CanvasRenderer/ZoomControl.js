import {RendererPlugin} from "../RendererPlugin";
import {AU, Gpc, kpc, ly, Mpc, pc} from "../../lib/Units";

class ZoomControl extends RendererPlugin {

    constructor({helper = false, scaleSample = false} = {}) {
        super(...arguments);
        this.zooming = false;
        this.showZoomHelper = helper;
        this.showScaleSample = scaleSample;
        this.zoomHelper = {};
    }

    createScaleSample() {
        this.scaleSample = document.createElement('div');
        this.scaleSample.classList.add('scale-sample');

        this.scaleSample.innerHTML = `
            <div class="scale">
                    <div class="sample"></div>
                    <div class="value">1231232km</div>
                </div>
        `;

        document.body.appendChild(this.scaleSample);

    }

    updateScaleSample() {

        const sampleWidthPx = this.scaleSample.querySelector('.sample').getBoundingClientRect().width;

        let scale = ((sampleWidthPx * this.renderer.metre) / this.renderer.pixelsPerMetre) / this.renderer.scale;

        if (scale > Gpc) {
            scale = (scale / Gpc).toLocaleString() + ' Gpc';
        } else if (scale > Mpc) {
            scale = (scale / Mpc).toLocaleString() + ' Mpc';
        } else if (scale > kpc) {
            scale = (scale / kpc).toLocaleString() + ' kpc';
        } else if (scale > pc) {
            scale = (scale / pc).toLocaleString() + ' pc';
        } else if (scale > ly * .1) {
            scale = (scale / ly).toLocaleString() + ' ly';
        } else if (scale >= AU * .1) {
            scale = (scale / AU).toLocaleString() + ' AU';
        } else if (scale > 1000) {
            scale = (scale / 1000).toLocaleString() + ' km';
        } else if (scale > 1) {
            scale = scale.toLocaleString() + ' mt';
        } else {
            scale = scale.toLocaleString() + ' cm';
        }

        this.scaleSample.querySelector('.value').textContent = scale;

    }

    setup() {

        if (this.showScaleSample) {
            this.createScaleSample();
        }

        let zoomTimer;

        this.renderer.renderDomTarget.addEventListener('mousewheel', e => {

            e.preventDefault();

            clearTimeout(zoomTimer);

            if (!this.zooming) {
                if (this.showZoomHelper) {
                    if (!this.zoomHelper.element) {
                        let pamElement = document.createElement('div');
                        pamElement.classList.add('zoomHelper');
                        this.renderer.renderDomTarget.appendChild(pamElement);
                        this.zoomHelper.element = pamElement;
                    } else {
                        this.zoomHelper.element.classList.remove('gone');
                    }
                    this.zoomHelper.scale = this.renderer.absoluteScale;
                    this.zoomHelper.x = this.renderer.pan.x;
                    this.zoomHelper.y = this.renderer.pan.y;
                }
                this.zooming = true;
            }

            zoomTimer = setTimeout(() => {
                if (this.zoomHelper.element) {
                    this.zoomHelper.element.classList.add('gone');
                }
                this.zooming = false;
            }, 200);

            const spaceSize = this.renderer.renderDomTarget.getBoundingClientRect();

            const change = e.deltaY / 100,
                previousScale = this.renderer.absoluteScale;

            this.renderer.scale -= change * this.renderer.scale * 0.1;
            this.renderer.absoluteScale -= change * this.renderer.absoluteScale * 0.1;

            const scaleChange = (this.renderer.absoluteScale / previousScale) - 1;

            this.renderer.pan.x -= ((e.clientX / spaceSize.width)
                * (spaceSize.width / (spaceSize.width * this.renderer.absoluteScale))) * spaceSize.width * scaleChange;

            this.renderer.pan.y -= ((e.clientY / spaceSize.height)
                * (spaceSize.height / (spaceSize.height * this.renderer.absoluteScale))) * spaceSize.height * scaleChange;

            if (this.showZoomHelper) {
                this.zoomHelper.element.style.width = (spaceSize.width * (this.renderer.absoluteScale / this.zoomHelper.scale)) + 'px';
                this.zoomHelper.element.style.height = (spaceSize.height * (this.renderer.absoluteScale / this.zoomHelper.scale)) + 'px';
                this.zoomHelper.element.style.left = (this.renderer.pan.x * this.renderer.absoluteScale) - (this.zoomHelper.x * this.renderer.absoluteScale) + 'px';
                this.zoomHelper.element.style.top = (this.renderer.pan.y * this.renderer.absoluteScale) - (this.zoomHelper.y * this.renderer.absoluteScale) + 'px';
            }

            this.updateScaleSample();

        });

        this.updateScaleSample();
    }
}

export {ZoomControl};