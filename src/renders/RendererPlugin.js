class RendererPlugin {

    constructor() {
        this.ready = false;
    }

    /**
     * @return {Renderer}
     */
    get renderer() {
        return this._renderer;
    }

    /**
     * @param {Renderer} renderer
     */
    set renderer(renderer) {
        this._renderer = renderer;
    }

    setup() {
        return true;
    }

    /**
     * @return {Universe}
     */
    get universe() {
        return this.renderer.universe;
    }

    update(delta) {
        if (!this.ready) {
            this.ready = this.setup();
        }
    }

    onAfterBodySetup(body) {

    }

}

export {RendererPlugin};