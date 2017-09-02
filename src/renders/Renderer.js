const renderers = [];

let renderingStarted = false;

function start() {
    if (!renderingStarted) {
        renderingStarted = true;

        let lastTime = 0;
        requestAnimationFrame(function render(time) {
            requestAnimationFrame(render);
            for (const renderer of renderers) {
                renderer.ready && renderer.update(time - lastTime, time);
            }
            lastTime = time;
        })

    }
}

class Renderer {

    constructor() {
        this.ready = false;
        renderers.push(this);
        start();
    }

    /**
     *
     * @param {Universe} universe
     */
    renders(universe) {
        this.universe = universe;
        this.ready = this.setup();
    }

    setup() {
        return true;
    }

    update(delta, time) {

    }

}

export {Renderer};