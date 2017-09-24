import {RendererPlugin} from "../RendererPlugin";
import {ZoomControl} from "./ZoomControl";

class DragControl extends RendererPlugin {
    setup() {

        let dragActive = false,
            dragStart = null,
            lastDrag = null,
            dragSpeed = {x: 0, y: 0};


        this.renderer.renderDomTarget.addEventListener('mousedown', e => {
            dragSpeed = {x: 0, y: 0};
            dragActive = true;
        });

        window.addEventListener('mousemove', e => {
            if (dragActive) {

                if (!dragStart) {
                    dragStart = {x: e.clientX, y: e.clientY};
                    this.renderer.renderDomTarget.classList.add('dragging');
                }

                if (lastDrag) {
                    dragSpeed.x = e.clientX - lastDrag.x;
                    dragSpeed.y = e.clientY - lastDrag.y;
                }

                this.renderer.pan.x += dragSpeed.x / (this.renderer.scale / this.renderer.initialScale);
                this.renderer.pan.y += dragSpeed.y / (this.renderer.scale / this.renderer.initialScale);

                const zoomControl = this.renderer.getPlugin(ZoomControl);

                if (zoomControl && zoomControl.showZoomHelper) {
                    if (zoomControl.zoomHelper.element) {
                        zoomControl.zoomHelper.element.style.left = (this.renderer.pan.x * this.renderer.absoluteScale)
                            - (zoomControl.zoomHelper.x * this.renderer.absoluteScale) + 'px';
                        zoomControl.zoomHelper.element.style.top = (this.renderer.pan.y * this.renderer.absoluteScale)
                            - (zoomControl.zoomHelper.y * this.renderer.absoluteScale) + 'px';
                    }
                }

                lastDrag = {x: e.clientX, y: e.clientY};

            }
        });

        window.addEventListener('mouseup', e => {
            dragActive = false;
            dragStart = null;
            lastDrag = null;
            this.renderer.renderDomTarget.classList.remove('dragging');
        });

    }
}

export {DragControl};