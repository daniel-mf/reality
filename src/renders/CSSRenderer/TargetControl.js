import {RendererPlugin} from "../RendererPlugin";

class TargetControl extends RendererPlugin {

    setup() {
        window.addEventListener('keydown', e => {
            if (e.key.toLowerCase() !== 'o') return;

            e.preventDefault();

            const body = this.biggestBodyInScreen;

            if (this.universe.target === body) {
                console.log(`targeting off`);
                this.universe.target = null;
                return;
            }

            if (body) {
                this.startTargeting(body);
            }

        });
    }

    startTargeting(body) {
        this.universe.target = body;
        console.log(`targeting: ${body.name}`);
    }

    get biggestBodyInScreen() {
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
    }

    onAfterBodySetup(body) {
        body.render.addEventListener('dblclick', e => this.startTargeting(body));
    }
}

export {TargetControl};