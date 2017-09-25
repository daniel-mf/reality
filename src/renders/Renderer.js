const renderers = [];

let renderingStarted = false;

function start() {
    if (!renderingStarted) {
        renderingStarted = true;

        window.addEventListener('resize', function () {
            for (const renderer of renderers) {
                renderer.ready && renderer.onResize();
            }
        });

        let lastTime = 0;
        requestAnimationFrame(function render(time) {
            requestAnimationFrame(render);
            for (const renderer of renderers) {
                if (renderer.ready) {
                    const delta = time - lastTime;
                    renderer.update(delta, time);
                    for (const eventHandler of renderer._onAfterUpdateHandlers) {
                        eventHandler(delta);
                    }
                }
            }
            lastTime = time;
        })

    }
}

class Renderer {

    constructor({metre = 1, pixelsPerMetre = 100, scale = 1, renderDomTarget} = {}) {

        /**
         * @type {RendererPlugin[]}
         */
        this.plugins = [];

        this.ready = false;

        this._onAfterUpdateHandlers = [];

        this.metre = metre;
        this.pixelsPerMetre = pixelsPerMetre;
        this.initialScale = scale;
        this.scale = scale;
        this.absoluteScale = 1;

        this.renderDomTarget = renderDomTarget || document.body;

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

    scaled(number) {
        return (number / this.metre * this.pixelsPerMetre) * this.scale;
    }

    setup() {
        return true;
    }

    * bodiesForSetup() {
        for (const body of this.universe.bodies) {
            yield body;
            for (const plugin of this.plugins) {
                plugin.onAfterBodySetup(body);
            }
        }
    }

    update(delta, time) {

    }

    onAfterUpdate(handler) {
        this._onAfterUpdateHandlers.push(handler);
    }

    onResize() {

    }

    /**
     * Adds a plugin
     * @param rendererPlugin
     * @return {Renderer}
     */
    plugin(rendererPlugin) {
        rendererPlugin.renderer = this;
        this.plugins.push(rendererPlugin);
        return this;
    }

    /**
     * @param {RendererPlugin} Class
     * @return {RendererPlugin}
     */
    getPlugin(Class) {
        for (const plugin of this.plugins) {
            if (plugin instanceof Class) {
                return plugin;
            }
        }
    }

}

export {Renderer};