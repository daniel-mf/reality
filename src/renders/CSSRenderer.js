import {Renderer} from "./Renderer";

class CSSRenderer extends Renderer {

    setup() {
        for (const thing of this.universe.bodies) {
            const el = document.createElement('div');
            el.classList.add('body');
            thing.render = el;
            document.body.appendChild(el);
        }
        return true;
    }

    update(delta, time) {
        for (const thing of this.universe.bodies) {
            thing.render.style.transform = 'translate3d(' + (
                thing.position.values.map(v => (v / this.metre * this.pixelsPerMetre
                ) + 'px').join(',')) + ')';
        }
    }

}

export {CSSRenderer};