import {AU, Gpc, kpc, ly, Mpc, pc} from "../lib/Units";

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

                    const delta = (time - lastTime) / 1000;

                    renderer.update(delta, time);

                    for (const plugin of renderer.plugins) {
                        if (plugin.ready) {
                            plugin.update(delta);
                        }
                    }

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

        this.renderings = new WeakMap();

        renderers.push(this);
        start();
    }

    /**
     * @param {Body} body
     * @returns {Object|null}
     */
    getRenderingFor(body) {
        return this.renderings.get(body);
    }

    /**
     * @param {Body} body
     * @param {Object} rendering
     * @returns {Renderer}
     */
    setRenderingFor(body, rendering) {
        this.renderings.set(body, rendering);
        return this;
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
        for (const plugin of this.plugins) {
            plugin.ready = plugin.setup();
        }
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

    /**
     * TODO get a better name for this method
     * @param {Number} value
     * @returns {Number}
     */
    scaleString(value) {

        if (value > Gpc) {
            value = (value / Gpc).toLocaleString() + ' Gpc';
        } else if (value > Mpc) {
            value = (value / Mpc).toLocaleString() + ' Mpc';
        } else if (value > kpc) {
            value = (value / kpc).toLocaleString() + ' kpc';
        } else if (value > pc) {
            value = (value / pc).toLocaleString() + ' pc';
        } else if (value > ly * .1) {
            value = (value / ly).toLocaleString() + ' ly';
        } else if (value >= AU * .1) {
            value = (value / AU).toLocaleString() + ' AU';
        } else if (value > 1000) {
            value = (value / 1000).toLocaleString() + ' km';
        } else if (value > 1) {
            value = value.toLocaleString() + ' mt';
        } else {
            value = value.toLocaleString() + ' cm';
        }

        return value;

    }

}

export {Renderer};