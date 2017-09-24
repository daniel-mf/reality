class RendererPlugin {

    constructor() {
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
        this.setup();
    }

    setup() {

    }

    /**
     * @return {Universe}
     */
    get universe() {
        return this.renderer.universe;
    }

    onAfterBodySetup(body) {

    }

}

export {RendererPlugin};