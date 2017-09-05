(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Reality = global.Reality || {})));
}(this, (function (exports) { 'use strict';

	const AU = 1.496 * Math.pow(10, 11);
	const G = 6.67384e-11;
	const SUN_MASS = 1.98855 * Math.pow(10, 30);

	class RealityException extends Error {
	    constructor(message) {
	        super(message);
	        this.name = this.constructor.name;
	        if (typeof Error.captureStackTrace === 'function') {
	            Error.captureStackTrace(this, this.constructor);
	        } else {
	            this.stack = (new Error(message)).stack;
	        }
	    }
	}

	class Thing {

	    happen(delta) {
	        return delta;
	    }

	}

	class Abstracta extends Thing {

	}

	class Dimension extends Abstracta {

	    constructor(name) {
	        super();
	        this.name = name;
	    }

	}

	class Law extends Abstracta {

	}

	class PhysicalDimension extends Dimension {

	    happen(delta, universe) {
	        return delta;
	    }

	}

	class Concreta extends Thing {

	    constructor() {
	        super();
	        /**
	         * @type {Thing[]}
	         */
	        this.things = [];
	    }

	    /**
	     * @param {Thing} any
	     * @returns {Thing}
	     */
	    add(...any) {
	        this.things.push(...any);
	        return this;
	    }

	    /**
	     * @param {Thing} any
	     * @returns {Thing}
	     */
	    remove(...any) {
	        for (const thing of any) {
	            const thingIndex = this.things.indexOf(thing);
	            if (thingIndex >= 0) {
	                this.things.splice(thingIndex, 1);
	            }
	        }
	        return this;
	    }

	    happen(delta, parentThing) {
	        delta = super.happen(delta, parentThing);
	        for (const thing of this.things) {
	            delta = thing.happen(delta, this);
	        }
	        return delta;
	    }

	}

	/**
	 * n-dimensional vector
	 */
	class Vector {

	    constructor(values = {}) {

	        const keys = Object.keys(values),
	            properties = {
	                values: {
	                    enumerable: false,
	                    configurable: false,
	                    writable: false,
	                    value: Object.values(values)
	                },
	                keys: {
	                    enumerable: false,
	                    configurable: false,
	                    writable: false,
	                    value: keys
	                }
	            };

	        for (const [index, key] of keys.entries()) {

	            const getIt = () => this.values[index],
	                setIt = val => this.values[index] = val;

	            properties[key] = {enumerable: true, configurable: false, get: getIt, set: setIt};
	            properties[index] = {enumerable: false, configurable: false, get: getIt, set: setIt};
	        }

	        Object.defineProperties(this, properties);

	    }

	    * [Symbol.iterator]() {
	        yield* this.values.entries();
	    }

	    reduce(callback) {
	        return this.values.length ? this.values.reduce(callback) : 0;
	    }

	    get sum() {
	        return this.reduce((c, v) => c + v);
	    }

	    add(vector) {
	        const vec = this.clone();
	        for (const n of vec.keys) {
	            this[n] = vec[n] + vector[n];
	        }
	        return vec;
	    }

	    addScalar(scalar) {
	        const vec = this.clone();
	        for (const n of vec.keys) {
	            vec[n] = vec[n] + scalar;
	        }
	        return vec;
	    }

	    sub(vector) {
	        const vec = this.clone();
	        for (const n of vec.keys) {
	            vec[n] = vec[n] - vector[n];
	        }
	        return vec;
	    }

	    subScalar(scalar) {
	        const vec = this.clone();
	        for (const n of vec.keys) {
	            vec[n] = vec[n] - scalar;
	        }
	        return vec;
	    }

	    multiply(vector) {
	        const vec = this.clone();
	        for (const n of vec.keys) {
	            vec[n] = vec[n] * vector[n];
	        }
	        return vec;
	    }

	    multiplyScalar(scalar) {
	        const vec = this.clone();
	        for (const n of vec.keys) {
	            vec[n] = vec[n] * scalar;
	        }
	        return vec;
	    }

	    divide(vector) {
	        const vec = this.clone();
	        for (const n of vec.keys) {
	            vec[n] = vec[n] / vector[n];
	        }
	        return vec;
	    }

	    divideScalar(scalar) {
	        const vec = this.clone();
	        for (const n of vec.keys) {
	            vec[n] = vec[n] / scalar;
	        }
	        return vec;
	    }

	    dot(vector) {
	        let total = 0;
	        for (const n of this.keys) {
	            total += this[n] * vector[n];
	        }
	        return total;
	    }

	    get lengthSq() {
	        //return this.clone().pow(2).sum();
	        let total = 0;
	        for (const n of this.values) {
	            total += n * n;
	        }
	        return total;
	    }

	    get length() {
	        return Math.sqrt(this.lengthSq);
	    }

	    set length(length) {
	        return this.normalized.multiplyScalar(length);
	    }

	    get normalized() {
	        return this.divideScalar(this.length || 1);
	    }

	    /**
	     * @returns {Vector}
	     */
	    clone() {
	        return new this.constructor(this);
	    }

	    copy(vector) {
	        for (const n of vector.keys) {
	            this[n] = vector[n];
	        }
	        return this;
	    }

	    /**
	     * @param {Function} callback
	     * @returns {Vector}
	     */
	    map(callback) {
	        const vector = this.clone();
	        let i = 0;
	        for (const n of vector.keys) {
	            vector[n] = callback(vector[n], n, i);
	            i++;
	        }
	        return vector;
	    }

	    pow(p) {
	        const vec = this.clone();
	        for (const n of vec.keys) {
	            vec[n] = vec[n] ** p;
	        }
	        return vec;
	    }

	    distanceToSquared(vector) {
	        return this.sub(vector).pow(2).sum;
	    }

	    distanceTo(vector) {
	        return Math.sqrt(this.distanceToSquared(vector));
	    }

	}

	class Body extends Concreta {
	    constructor({mass = 0}) {
	        super();
	        this.mass = mass;
	    }
	}

	class Universe extends Concreta {

	    constructor(...any) {
	        super();

	        const universe = this;

	        this.laws = [];
	        this.dimensions = [];
	        this.bodies = [];

	        this.Vector = class extends Vector {
	            constructor(values = {}) {

	                for (const {name: dimensionName} of universe.physicalDimensions) {
	                    if (!values.hasOwnProperty(dimensionName)) {
	                        values[dimensionName] = 0;
	                    }
	                }

	                super(values);
	            }
	        };

	        this.Body = class extends Body {
	            constructor(definition = {}) {
	                super(definition);
	                this.position = definition.position instanceof universe.Vector ?
	                    definition.position : new universe.Vector(definition.position);
	                this.velocity = definition.velocity instanceof universe.Vector ?
	                    definition.velocity : new universe.Vector(definition.velocity);
	            }
	        };

	        this.add(...any);

	    }

	    get physicalDimensions() {
	        return this.dimensions.filter(dimension => dimension instanceof PhysicalDimension);
	    }

	    get nonPhysicalDimensions() {
	        return this.dimensions.filter(dimension => !(dimension instanceof PhysicalDimension));
	    }

	    /**
	     * @param {Thing} any
	     * @returns {Universe}
	     */
	    add(...any) {
	        super.add(...any);
	        for (const thing of any) {
	            if (thing instanceof Dimension) {
	                this.dimensions.push(thing);
	            } else if (thing instanceof Law) {
	                this.laws.push(thing);
	            } else if (thing instanceof this.Body) {
	                this.bodies.push(thing);
	            }
	        }
	        return this;
	    }

	    /**
	     * @param {Thing} any
	     * @returns {Universe}
	     */
	    remove(...any) {
	        super.remove(...any);
	        for (const thing of any) {
	            if (thing instanceof Dimension) {
	                const thingIndex = this.dimensions.indexOf(thing);
	                thingIndex >= 0 && this.dimensions.splice(thingIndex, 1);
	            } else if (thing instanceof Law) {
	                const thingIndex = this.laws.indexOf(thing);
	                thingIndex >= 0 && this.laws.splice(thingIndex, 1);
	            } else if (thing instanceof this.Body) {
	                const thingIndex = this.bodies.indexOf(thing);
	                thingIndex >= 0 && this.bodies.splice(thingIndex, 1);
	            }
	        }
	        return this;
	    }

	}

	class Gravitation extends Law {

	    /**
	     * @return {number}
	     */
	    static get G() {
	        return G;
	    }


	    happen(delta, universe) {

	        const physicalDimensions = universe.physicalDimensions;

	        for (const particle of universe.bodies) {

	            if (!particle.mass) {
	                continue;
	            }

	            if (particle instanceof Body) {
	                for (const otherParticle of universe.bodies) {

	                    if (!otherParticle.mass || particle === otherParticle) {
	                        continue;
	                    }

	                    const differences = otherParticle.position.sub(particle.position);
	                    const distanceSquared = otherParticle.position.distanceToSquared(particle.position);
	                    const distance = otherParticle.position.distanceTo(particle.position);

	                    if (distance > 10 + 10) {

	                        const totalForce = (otherParticle.mass / distanceSquared);
	                        const forceVector = new universe.Vector();

	                        for (const [n] of forceVector) {
	                            particle.velocity[n] += (((totalForce * differences[n] / distance) * Gravitation.G)) * delta; //should apply delta?
	                        }

	                    } else {
	                        for (const [n] of differences) {
	                            const velocity = (particle.mass * particle.velocity[n]
	                                + otherParticle.mass * otherParticle.velocity[n]) / (particle.mass + otherParticle.mass);
	                            particle.velocity[n] = velocity;
	                            otherParticle.velocity[n] = velocity;

	                        }
	                    }

	                }
	            }
	        }

	        return delta;
	    }

	}

	class Time extends Dimension {

	    constructor() {
	        super('t');

	        this.startTime = performance.now();
	        this.oldTime = this.startTime;
	        this._elapsedTime = 0;

	    }

	    get elapsedTime() {
	        this.delta;
	        return this._elapsedTime;
	    }

	    get delta() {
	        const newTime = ( typeof performance === 'undefined' ? Date : performance ).now(),
	            diff = ( newTime - this.oldTime ) / 1000;

	        this.oldTime = newTime;
	        this._elapsedTime += diff;

	        return diff;
	    }

	    /**
	     * @param {Number} delta
	     * @param {Thing} parentThing
	     */
	    happen(delta, parentThing) {
	        //makes parent thing happen repeatedly, reducing its delta
	        requestAnimationFrame(() => parentThing.happen());
	        return this.delta;
	    }

	}

	class Motion extends Law {

	    happen(delta, universe) {

	        const physicalDimensions = universe.physicalDimensions;

	        for (const thing of universe.things) {
	            if (thing instanceof universe.Body) {
	                for (const {name: dimensionName} of physicalDimensions) {
	                    thing.position[dimensionName] = thing.position[dimensionName] + (thing.velocity[dimensionName] * delta);
	                }
	            }
	        }

	        return delta;
	    }

	}

	function bigBang() {
	    return new Universe(
	        new Time(),
	        new PhysicalDimension('x'),
	        new PhysicalDimension('y'),
	        new PhysicalDimension('z'),
	        new Motion(),
	        new Gravitation()
	    );
	}

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
	        });

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
	            thing.render.style.transform = 'translate3d(' + (thing.position.values.map(v => (v / 500000) + 'px').join(',')) + ')';
	        }
	    }

	}

	class ThreeRenderer extends Renderer {

	    setup() {

	        if (typeof THREE === 'undefined') {
	            throw new RealityException('three.js not included');
	        } else if (THREE.REVISION < 86) {
	            throw new RealityException('three.js most be newer than 85');
	        }

	        this.scene = new THREE.Scene();

	        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	        this.camera.position.z = 1000;

	        this.renderer = new THREE.WebGLRenderer();
	        this.renderer.setSize(window.innerWidth, window.innerHeight);

	        for (const thing of this.universe.bodies) {
	            thing.render = new THREE.Mesh(
	                new THREE.SphereGeometry(100),
	                new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
	            );
	            this.scene.add(thing.render);
	        }

	        document.body.appendChild(this.renderer.domElement);

	        return super.setup();

	    }

	    update(delta, time) {

	        for (const thing of this.universe.bodies) {
	            thing.render.position.set(
	                thing.position.x,
	                thing.position.y,
	                thing.position.z
	            );
	        }

	        this.renderer.render(this.scene, this.camera);
	    }

	}

	const UNIT = {AU, G, SUN_MASS};

	//What is the nature of reality?
	const nature = undefined;

	exports.UNIT = UNIT;
	exports.nature = nature;
	exports.Exception = RealityException;
	exports.Universe = Universe;
	exports.Law = Law;
	exports.Gravitation = Gravitation;
	exports.Time = Time;
	exports.PhysicalDimension = PhysicalDimension;
	exports.Vector = Vector;
	exports.CSSRenderer = CSSRenderer;
	exports.ThreeRenderer = ThreeRenderer;
	exports.bigBang = bigBang;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbGl0eS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2xpYi9Vbml0cy5qcyIsIi4uL3NyYy9saWIvUmVhbGl0eUV4Y2VwdGlvbi5qcyIsIi4uL3NyYy9UaGluZy5qcyIsIi4uL3NyYy9BYnN0cmFjdGEuanMiLCIuLi9zcmMvZGltZW5zaW9ucy9EaW1lbnNpb24uanMiLCIuLi9zcmMvbGF3cy9MYXcuanMiLCIuLi9zcmMvZGltZW5zaW9ucy9QaHlzaWNhbERpbWVuc2lvbi5qcyIsIi4uL3NyYy9Db25jcmV0YS5qcyIsIi4uL3NyYy9saWIvVmVjdG9yLmpzIiwiLi4vc3JjL0JvZHkuanMiLCIuLi9zcmMvVW5pdmVyc2UuanMiLCIuLi9zcmMvbGF3cy9HcmF2aXRhdGlvbi5qcyIsIi4uL3NyYy9kaW1lbnNpb25zL1RpbWUuanMiLCIuLi9zcmMvbGF3cy9Nb3Rpb24uanMiLCIuLi9zcmMvSGVscGVycy5qcyIsIi4uL3NyYy9yZW5kZXJzL1JlbmRlcmVyLmpzIiwiLi4vc3JjL3JlbmRlcnMvQ1NTUmVuZGVyZXIuanMiLCIuLi9zcmMvcmVuZGVycy9UaHJlZUpTLmpzIiwiLi4vc3JjL1JlYWxpdHkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEFVID0gMS40OTYgKiBNYXRoLnBvdygxMCwgMTEpO1xyXG5leHBvcnQgY29uc3QgRyA9IDYuNjczODRlLTExO1xyXG5leHBvcnQgY29uc3QgU1VOX01BU1MgPSAxLjk4ODU1ICogTWF0aC5wb3coMTAsIDMwKTtcclxuZXhwb3J0IGNvbnN0IEVBUlRIX0FOR1VMQVJfVkVMT0NJVFlfTUVURVJTX1BFUl9TRUNPTkQgPSAxLjk5MDk4NiAqIE1hdGgucG93KDEwLCAtNyk7IiwiY2xhc3MgUmVhbGl0eUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcihtZXNzYWdlKSkuc3RhY2s7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1JlYWxpdHlFeGNlcHRpb259OyIsImNsYXNzIFRoaW5nIHtcclxuXHJcbiAgICBoYXBwZW4oZGVsdGEpIHtcclxuICAgICAgICByZXR1cm4gZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1RoaW5nfTtcclxuIiwiaW1wb3J0IHtUaGluZ30gZnJvbSBcIi4vVGhpbmdcIjtcclxuXHJcbmNsYXNzIEFic3RyYWN0YSBleHRlbmRzIFRoaW5nIHtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7QWJzdHJhY3RhfTsiLCJpbXBvcnQge0Fic3RyYWN0YX0gZnJvbSBcIi4uL0Fic3RyYWN0YVwiO1xyXG5cclxuY2xhc3MgRGltZW5zaW9uIGV4dGVuZHMgQWJzdHJhY3RhIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtEaW1lbnNpb259OyIsImltcG9ydCB7QWJzdHJhY3RhfSBmcm9tIFwiLi4vQWJzdHJhY3RhXCI7XHJcblxyXG5jbGFzcyBMYXcgZXh0ZW5kcyBBYnN0cmFjdGEge1xyXG5cclxufVxyXG5cclxuZXhwb3J0IHtMYXd9OyIsImltcG9ydCB7RGltZW5zaW9ufSBmcm9tIFwiLi9EaW1lbnNpb25cIjtcclxuXHJcbmNsYXNzIFBoeXNpY2FsRGltZW5zaW9uIGV4dGVuZHMgRGltZW5zaW9uIHtcclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHVuaXZlcnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtQaHlzaWNhbERpbWVuc2lvbn07IiwiaW1wb3J0IHtUaGluZ30gZnJvbSBcIi4vVGhpbmdcIjtcclxuXHJcbmNsYXNzIENvbmNyZXRhIGV4dGVuZHMgVGhpbmcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHR5cGUge1RoaW5nW119XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50aGluZ3MgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7VGhpbmd9IGFueVxyXG4gICAgICogQHJldHVybnMge1RoaW5nfVxyXG4gICAgICovXHJcbiAgICBhZGQoLi4uYW55KSB7XHJcbiAgICAgICAgdGhpcy50aGluZ3MucHVzaCguLi5hbnkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtUaGluZ30gYW55XHJcbiAgICAgKiBAcmV0dXJucyB7VGhpbmd9XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZSguLi5hbnkpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIGFueSkge1xyXG4gICAgICAgICAgICBjb25zdCB0aGluZ0luZGV4ID0gdGhpcy50aGluZ3MuaW5kZXhPZih0aGluZyk7XHJcbiAgICAgICAgICAgIGlmICh0aGluZ0luZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGhpbmdzLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHBhcmVudFRoaW5nKSB7XHJcbiAgICAgICAgZGVsdGEgPSBzdXBlci5oYXBwZW4oZGVsdGEsIHBhcmVudFRoaW5nKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIHRoaXMudGhpbmdzKSB7XHJcbiAgICAgICAgICAgIGRlbHRhID0gdGhpbmcuaGFwcGVuKGRlbHRhLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtDb25jcmV0YX07IiwiLyoqXHJcbiAqIG4tZGltZW5zaW9uYWwgdmVjdG9yXHJcbiAqL1xyXG5jbGFzcyBWZWN0b3Ige1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlcyA9IHt9KSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZXMpLFxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0ge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IE9iamVjdC52YWx1ZXModmFsdWVzKVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGtleXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZToga2V5c1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IFtpbmRleCwga2V5XSBvZiBrZXlzLmVudHJpZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2V0SXQgPSAoKSA9PiB0aGlzLnZhbHVlc1tpbmRleF0sXHJcbiAgICAgICAgICAgICAgICBzZXRJdCA9IHZhbCA9PiB0aGlzLnZhbHVlc1tpbmRleF0gPSB2YWw7XHJcblxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzW2tleV0gPSB7ZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiBmYWxzZSwgZ2V0OiBnZXRJdCwgc2V0OiBzZXRJdH07XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXNbaW5kZXhdID0ge2VudW1lcmFibGU6IGZhbHNlLCBjb25maWd1cmFibGU6IGZhbHNlLCBnZXQ6IGdldEl0LCBzZXQ6IHNldEl0fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAqIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgIHlpZWxkKiB0aGlzLnZhbHVlcy5lbnRyaWVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVkdWNlKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLmxlbmd0aCA/IHRoaXMudmFsdWVzLnJlZHVjZShjYWxsYmFjaykgOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzdW0oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVkdWNlKChjLCB2KSA9PiBjICsgdik7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKHZlY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdGhpc1tuXSA9IHZlY1tuXSArIHZlY3RvcltuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBhZGRTY2FsYXIoc2NhbGFyKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gKyBzY2FsYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgc3ViKHZlY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dIC0gdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YlNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAtIHNjYWxhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBtdWx0aXBseSh2ZWN0b3IpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAqIHZlY3RvcltuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBtdWx0aXBseVNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAqIHNjYWxhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBkaXZpZGUodmVjdG9yKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gLyB2ZWN0b3Jbbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgZGl2aWRlU2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dIC8gc2NhbGFyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIGRvdCh2ZWN0b3IpIHtcclxuICAgICAgICBsZXQgdG90YWwgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB0aGlzLmtleXMpIHtcclxuICAgICAgICAgICAgdG90YWwgKz0gdGhpc1tuXSAqIHZlY3RvcltuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvdGFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsZW5ndGhTcSgpIHtcclxuICAgICAgICAvL3JldHVybiB0aGlzLmNsb25lKCkucG93KDIpLnN1bSgpO1xyXG4gICAgICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHRoaXMudmFsdWVzKSB7XHJcbiAgICAgICAgICAgIHRvdGFsICs9IG4gKiBuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG90YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMubGVuZ3RoU3EpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsZW5ndGgobGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplZC5tdWx0aXBseVNjYWxhcihsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBub3JtYWxpemVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZVNjYWxhcih0aGlzLmxlbmd0aCB8fCAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHtWZWN0b3J9XHJcbiAgICAgKi9cclxuICAgIGNsb25lKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb3B5KHZlY3Rvcikge1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWN0b3Iua2V5cykge1xyXG4gICAgICAgICAgICB0aGlzW25dID0gdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjdG9yfVxyXG4gICAgICovXHJcbiAgICBtYXAoY2FsbGJhY2spIHtcclxuICAgICAgICBjb25zdCB2ZWN0b3IgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWN0b3Iua2V5cykge1xyXG4gICAgICAgICAgICB2ZWN0b3Jbbl0gPSBjYWxsYmFjayh2ZWN0b3Jbbl0sIG4sIGkpO1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcG93KHApIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAqKiBwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3RhbmNlVG9TcXVhcmVkKHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1Yih2ZWN0b3IpLnBvdygyKS5zdW07XHJcbiAgICB9XHJcblxyXG4gICAgZGlzdGFuY2VUbyh2ZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZGlzdGFuY2VUb1NxdWFyZWQodmVjdG9yKSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1ZlY3Rvcn07IiwiaW1wb3J0IHtDb25jcmV0YX0gZnJvbSBcIi4vQ29uY3JldGFcIjtcclxuXHJcbmNsYXNzIEJvZHkgZXh0ZW5kcyBDb25jcmV0YSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7bWFzcyA9IDB9KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1hc3MgPSBtYXNzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0JvZHl9OyIsImltcG9ydCB7RGltZW5zaW9ufSBmcm9tIFwiLi9kaW1lbnNpb25zL0RpbWVuc2lvblwiO1xyXG5pbXBvcnQge0xhd30gZnJvbSBcIi4vbGF3cy9MYXdcIjtcclxuaW1wb3J0IHtQaHlzaWNhbERpbWVuc2lvbn0gZnJvbSBcIi4vZGltZW5zaW9ucy9QaHlzaWNhbERpbWVuc2lvblwiO1xyXG5pbXBvcnQge1RoaW5nfSBmcm9tIFwiLi9UaGluZ1wiO1xyXG5pbXBvcnQge0NvbmNyZXRhfSBmcm9tIFwiLi9Db25jcmV0YVwiO1xyXG5pbXBvcnQge1ZlY3Rvcn0gZnJvbSBcIi4vbGliL1ZlY3RvclwiO1xyXG5pbXBvcnQge0JvZHl9IGZyb20gXCIuL0JvZHlcIjtcclxuXHJcbmNsYXNzIFVuaXZlcnNlIGV4dGVuZHMgQ29uY3JldGEge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKC4uLmFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5sYXdzID0gW107XHJcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gW107XHJcbiAgICAgICAgdGhpcy5ib2RpZXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5WZWN0b3IgPSBjbGFzcyBleHRlbmRzIFZlY3RvciB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcyA9IHt9KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB7bmFtZTogZGltZW5zaW9uTmFtZX0gb2YgdW5pdmVyc2UucGh5c2ljYWxEaW1lbnNpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXMuaGFzT3duUHJvcGVydHkoZGltZW5zaW9uTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2RpbWVuc2lvbk5hbWVdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc3VwZXIodmFsdWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuQm9keSA9IGNsYXNzIGV4dGVuZHMgQm9keSB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGRlZmluaXRpb24gPSB7fSkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoZGVmaW5pdGlvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gZGVmaW5pdGlvbi5wb3NpdGlvbiBpbnN0YW5jZW9mIHVuaXZlcnNlLlZlY3RvciA/XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5pdGlvbi5wb3NpdGlvbiA6IG5ldyB1bml2ZXJzZS5WZWN0b3IoZGVmaW5pdGlvbi5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0gZGVmaW5pdGlvbi52ZWxvY2l0eSBpbnN0YW5jZW9mIHVuaXZlcnNlLlZlY3RvciA/XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5pdGlvbi52ZWxvY2l0eSA6IG5ldyB1bml2ZXJzZS5WZWN0b3IoZGVmaW5pdGlvbi52ZWxvY2l0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZCguLi5hbnkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGh5c2ljYWxEaW1lbnNpb25zKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGRpbWVuc2lvbiA9PiBkaW1lbnNpb24gaW5zdGFuY2VvZiBQaHlzaWNhbERpbWVuc2lvbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5vblBoeXNpY2FsRGltZW5zaW9ucygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaW1lbnNpb25zLmZpbHRlcihkaW1lbnNpb24gPT4gIShkaW1lbnNpb24gaW5zdGFuY2VvZiBQaHlzaWNhbERpbWVuc2lvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtUaGluZ30gYW55XHJcbiAgICAgKiBAcmV0dXJucyB7VW5pdmVyc2V9XHJcbiAgICAgKi9cclxuICAgIGFkZCguLi5hbnkpIHtcclxuICAgICAgICBzdXBlci5hZGQoLi4uYW55KTtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpbmcgaW5zdGFuY2VvZiBEaW1lbnNpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGltZW5zaW9ucy5wdXNoKHRoaW5nKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGluZyBpbnN0YW5jZW9mIExhdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXdzLnB1c2godGhpbmcpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaW5nIGluc3RhbmNlb2YgdGhpcy5Cb2R5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvZGllcy5wdXNoKHRoaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7VGhpbmd9IGFueVxyXG4gICAgICogQHJldHVybnMge1VuaXZlcnNlfVxyXG4gICAgICovXHJcbiAgICByZW1vdmUoLi4uYW55KSB7XHJcbiAgICAgICAgc3VwZXIucmVtb3ZlKC4uLmFueSk7XHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaW5nIGluc3RhbmNlb2YgRGltZW5zaW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aGluZ0luZGV4ID0gdGhpcy5kaW1lbnNpb25zLmluZGV4T2YodGhpbmcpO1xyXG4gICAgICAgICAgICAgICAgdGhpbmdJbmRleCA+PSAwICYmIHRoaXMuZGltZW5zaW9ucy5zcGxpY2UodGhpbmdJbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpbmcgaW5zdGFuY2VvZiBMYXcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRoaW5nSW5kZXggPSB0aGlzLmxhd3MuaW5kZXhPZih0aGluZyk7XHJcbiAgICAgICAgICAgICAgICB0aGluZ0luZGV4ID49IDAgJiYgdGhpcy5sYXdzLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGluZyBpbnN0YW5jZW9mIHRoaXMuQm9keSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGhpbmdJbmRleCA9IHRoaXMuYm9kaWVzLmluZGV4T2YodGhpbmcpO1xyXG4gICAgICAgICAgICAgICAgdGhpbmdJbmRleCA+PSAwICYmIHRoaXMuYm9kaWVzLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VW5pdmVyc2V9OyIsImltcG9ydCB7TGF3fSBmcm9tIFwiLi9MYXdcIjtcclxuaW1wb3J0IHtCb2R5fSBmcm9tIFwiLi4vQm9keVwiO1xyXG5pbXBvcnQge0d9IGZyb20gXCIuLi9saWIvVW5pdHNcIjtcclxuXHJcbmNsYXNzIEdyYXZpdGF0aW9uIGV4dGVuZHMgTGF3IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBHKCkge1xyXG4gICAgICAgIHJldHVybiBHO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHVuaXZlcnNlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHBoeXNpY2FsRGltZW5zaW9ucyA9IHVuaXZlcnNlLnBoeXNpY2FsRGltZW5zaW9ucztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBwYXJ0aWNsZSBvZiB1bml2ZXJzZS5ib2RpZXMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGFydGljbGUubWFzcykge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJ0aWNsZSBpbnN0YW5jZW9mIEJvZHkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgb3RoZXJQYXJ0aWNsZSBvZiB1bml2ZXJzZS5ib2RpZXMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdGhlclBhcnRpY2xlLm1hc3MgfHwgcGFydGljbGUgPT09IG90aGVyUGFydGljbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaWZmZXJlbmNlcyA9IG90aGVyUGFydGljbGUucG9zaXRpb24uc3ViKHBhcnRpY2xlLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZVNxdWFyZWQgPSBvdGhlclBhcnRpY2xlLnBvc2l0aW9uLmRpc3RhbmNlVG9TcXVhcmVkKHBhcnRpY2xlLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IG90aGVyUGFydGljbGUucG9zaXRpb24uZGlzdGFuY2VUbyhwYXJ0aWNsZS5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDEwICsgMTApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFsRm9yY2UgPSAob3RoZXJQYXJ0aWNsZS5tYXNzIC8gZGlzdGFuY2VTcXVhcmVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9yY2VWZWN0b3IgPSBuZXcgdW5pdmVyc2UuVmVjdG9yKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtuXSBvZiBmb3JjZVZlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHlbbl0gKz0gKCgodG90YWxGb3JjZSAqIGRpZmZlcmVuY2VzW25dIC8gZGlzdGFuY2UpICogR3Jhdml0YXRpb24uRykpICogZGVsdGE7IC8vc2hvdWxkIGFwcGx5IGRlbHRhP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW25dIG9mIGRpZmZlcmVuY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IChwYXJ0aWNsZS5tYXNzICogcGFydGljbGUudmVsb2NpdHlbbl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIG90aGVyUGFydGljbGUubWFzcyAqIG90aGVyUGFydGljbGUudmVsb2NpdHlbbl0pIC8gKHBhcnRpY2xlLm1hc3MgKyBvdGhlclBhcnRpY2xlLm1hc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHlbbl0gPSB2ZWxvY2l0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyUGFydGljbGUudmVsb2NpdHlbbl0gPSB2ZWxvY2l0eTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge0dyYXZpdGF0aW9uLCBHfTsiLCJpbXBvcnQge0RpbWVuc2lvbn0gZnJvbSBcIi4vRGltZW5zaW9uXCI7XHJcblxyXG5jbGFzcyBUaW1lIGV4dGVuZHMgRGltZW5zaW9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigndCcpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHRoaXMub2xkVGltZSA9IHRoaXMuc3RhcnRUaW1lO1xyXG4gICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGVsYXBzZWRUaW1lKCkge1xyXG4gICAgICAgIHRoaXMuZGVsdGE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsYXBzZWRUaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBkZWx0YSgpIHtcclxuICAgICAgICBjb25zdCBuZXdUaW1lID0gKCB0eXBlb2YgcGVyZm9ybWFuY2UgPT09ICd1bmRlZmluZWQnID8gRGF0ZSA6IHBlcmZvcm1hbmNlICkubm93KCksXHJcbiAgICAgICAgICAgIGRpZmYgPSAoIG5ld1RpbWUgLSB0aGlzLm9sZFRpbWUgKSAvIDEwMDA7XHJcblxyXG4gICAgICAgIHRoaXMub2xkVGltZSA9IG5ld1RpbWU7XHJcbiAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgKz0gZGlmZjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpZmY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsdGFcclxuICAgICAqIEBwYXJhbSB7VGhpbmd9IHBhcmVudFRoaW5nXHJcbiAgICAgKi9cclxuICAgIGhhcHBlbihkZWx0YSwgcGFyZW50VGhpbmcpIHtcclxuICAgICAgICAvL21ha2VzIHBhcmVudCB0aGluZyBoYXBwZW4gcmVwZWF0ZWRseSwgcmVkdWNpbmcgaXRzIGRlbHRhXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHBhcmVudFRoaW5nLmhhcHBlbigpKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWx0YTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VGltZX07IiwiaW1wb3J0IHtMYXd9IGZyb20gXCIuL0xhd1wiO1xyXG5cclxuY2xhc3MgTW90aW9uIGV4dGVuZHMgTGF3IHtcclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHVuaXZlcnNlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHBoeXNpY2FsRGltZW5zaW9ucyA9IHVuaXZlcnNlLnBoeXNpY2FsRGltZW5zaW9ucztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiB1bml2ZXJzZS50aGluZ3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaW5nIGluc3RhbmNlb2YgdW5pdmVyc2UuQm9keSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB7bmFtZTogZGltZW5zaW9uTmFtZX0gb2YgcGh5c2ljYWxEaW1lbnNpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpbmcucG9zaXRpb25bZGltZW5zaW9uTmFtZV0gPSB0aGluZy5wb3NpdGlvbltkaW1lbnNpb25OYW1lXSArICh0aGluZy52ZWxvY2l0eVtkaW1lbnNpb25OYW1lXSAqIGRlbHRhKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge01vdGlvbn07IiwiaW1wb3J0IHtVbml2ZXJzZX0gZnJvbSBcIi4vVW5pdmVyc2VcIjtcclxuaW1wb3J0IHtQaHlzaWNhbERpbWVuc2lvbn0gZnJvbSBcIi4vZGltZW5zaW9ucy9QaHlzaWNhbERpbWVuc2lvblwiO1xyXG5pbXBvcnQge1RpbWV9IGZyb20gXCIuL2RpbWVuc2lvbnMvVGltZVwiO1xyXG5pbXBvcnQge0dyYXZpdGF0aW9ufSBmcm9tIFwiLi9sYXdzL0dyYXZpdGF0aW9uXCI7XHJcbmltcG9ydCB7TW90aW9ufSBmcm9tIFwiLi9sYXdzL01vdGlvblwiO1xyXG5cclxuZnVuY3Rpb24gYmlnQmFuZygpIHtcclxuICAgIHJldHVybiBuZXcgVW5pdmVyc2UoXHJcbiAgICAgICAgbmV3IFRpbWUoKSxcclxuICAgICAgICBuZXcgUGh5c2ljYWxEaW1lbnNpb24oJ3gnKSxcclxuICAgICAgICBuZXcgUGh5c2ljYWxEaW1lbnNpb24oJ3knKSxcclxuICAgICAgICBuZXcgUGh5c2ljYWxEaW1lbnNpb24oJ3onKSxcclxuICAgICAgICBuZXcgTW90aW9uKCksXHJcbiAgICAgICAgbmV3IEdyYXZpdGF0aW9uKClcclxuICAgICk7XHJcbn1cclxuXHJcbmV4cG9ydCB7YmlnQmFuZ307IiwiY29uc3QgcmVuZGVyZXJzID0gW107XHJcblxyXG5sZXQgcmVuZGVyaW5nU3RhcnRlZCA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgICBpZiAoIXJlbmRlcmluZ1N0YXJ0ZWQpIHtcclxuICAgICAgICByZW5kZXJpbmdTdGFydGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgbGV0IGxhc3RUaW1lID0gMDtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gcmVuZGVyKHRpbWUpIHtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVuZGVyZXIgb2YgcmVuZGVyZXJzKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJlci5yZWFkeSAmJiByZW5kZXJlci51cGRhdGUodGltZSAtIGxhc3RUaW1lLCB0aW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXN0VGltZSA9IHRpbWU7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFJlbmRlcmVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgcmVuZGVyZXJzLnB1c2godGhpcyk7XHJcbiAgICAgICAgc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1VuaXZlcnNlfSB1bml2ZXJzZVxyXG4gICAgICovXHJcbiAgICByZW5kZXJzKHVuaXZlcnNlKSB7XHJcbiAgICAgICAgdGhpcy51bml2ZXJzZSA9IHVuaXZlcnNlO1xyXG4gICAgICAgIHRoaXMucmVhZHkgPSB0aGlzLnNldHVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRlbHRhLCB0aW1lKSB7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtSZW5kZXJlcn07IiwiaW1wb3J0IHtSZW5kZXJlcn0gZnJvbSBcIi4vUmVuZGVyZXJcIjtcclxuXHJcbmNsYXNzIENTU1JlbmRlcmVyIGV4dGVuZHMgUmVuZGVyZXIge1xyXG5cclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdGhpcy51bml2ZXJzZS5ib2RpZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnYm9keScpO1xyXG4gICAgICAgICAgICB0aGluZy5yZW5kZXIgPSBlbDtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkZWx0YSwgdGltZSkge1xyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdGhpcy51bml2ZXJzZS5ib2RpZXMpIHtcclxuICAgICAgICAgICAgdGhpbmcucmVuZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgnICsgKHRoaW5nLnBvc2l0aW9uLnZhbHVlcy5tYXAodiA9PiAodiAvIDUwMDAwMCkgKyAncHgnKS5qb2luKCcsJykpICsgJyknO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7Q1NTUmVuZGVyZXJ9OyIsImltcG9ydCB7UmVuZGVyZXJ9IGZyb20gXCIuL1JlbmRlcmVyXCI7XHJcbmltcG9ydCB7UmVhbGl0eUV4Y2VwdGlvbn0gZnJvbSBcIi4uL2xpYi9SZWFsaXR5RXhjZXB0aW9uXCI7XHJcblxyXG5jbGFzcyBUaHJlZVJlbmRlcmVyIGV4dGVuZHMgUmVuZGVyZXIge1xyXG5cclxuICAgIHNldHVwKCkge1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIFRIUkVFID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVhbGl0eUV4Y2VwdGlvbigndGhyZWUuanMgbm90IGluY2x1ZGVkJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChUSFJFRS5SRVZJU0lPTiA8IDg2KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWFsaXR5RXhjZXB0aW9uKCd0aHJlZS5qcyBtb3N0IGJlIG5ld2VyIHRoYW4gODUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAxLCAxMDAwMCk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDEwMDA7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiB0aGlzLnVuaXZlcnNlLmJvZGllcykge1xyXG4gICAgICAgICAgICB0aGluZy5yZW5kZXIgPSBuZXcgVEhSRUUuTWVzaChcclxuICAgICAgICAgICAgICAgIG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxMDApLFxyXG4gICAgICAgICAgICAgICAgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjogMHhmZjAwMDAsIHdpcmVmcmFtZTogdHJ1ZX0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaW5nLnJlbmRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXR1cCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGVsdGEsIHRpbWUpIHtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiB0aGlzLnVuaXZlcnNlLmJvZGllcykge1xyXG4gICAgICAgICAgICB0aGluZy5yZW5kZXIucG9zaXRpb24uc2V0KFxyXG4gICAgICAgICAgICAgICAgdGhpbmcucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHRoaW5nLnBvc2l0aW9uLnksXHJcbiAgICAgICAgICAgICAgICB0aGluZy5wb3NpdGlvbi56XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1RocmVlUmVuZGVyZXJ9OyIsImltcG9ydCB7QVUsIEcsIFNVTl9NQVNTfSBmcm9tIFwiLi9saWIvVW5pdHNcIjtcclxuXHJcbmV4cG9ydCB7UmVhbGl0eUV4Y2VwdGlvbiBhcyBFeGNlcHRpb259IGZyb20gJy4vbGliL1JlYWxpdHlFeGNlcHRpb24nO1xyXG5leHBvcnQge1VuaXZlcnNlfSBmcm9tICcuL1VuaXZlcnNlJztcclxuZXhwb3J0IHtMYXd9IGZyb20gJy4vbGF3cy9MYXcnO1xyXG5leHBvcnQge0dyYXZpdGF0aW9ufSBmcm9tICcuL2xhd3MvR3Jhdml0YXRpb24nO1xyXG5leHBvcnQge1RpbWV9IGZyb20gJy4vZGltZW5zaW9ucy9UaW1lJztcclxuZXhwb3J0IHtQaHlzaWNhbERpbWVuc2lvbn0gZnJvbSAnLi9kaW1lbnNpb25zL1BoeXNpY2FsRGltZW5zaW9uJztcclxuZXhwb3J0IHtWZWN0b3J9IGZyb20gJy4vbGliL1ZlY3Rvcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vSGVscGVycyc7XHJcbmV4cG9ydCB7Q1NTUmVuZGVyZXJ9IGZyb20gJy4vcmVuZGVycy9DU1NSZW5kZXJlcic7XHJcbmV4cG9ydCB7VGhyZWVSZW5kZXJlcn0gZnJvbSAnLi9yZW5kZXJzL1RocmVlSlMnO1xyXG5leHBvcnQgY29uc3QgVU5JVCA9IHtBVSwgRywgU1VOX01BU1N9O1xyXG5cclxuLy9XaGF0IGlzIHRoZSBuYXR1cmUgb2YgcmVhbGl0eT9cclxuZXhwb3J0IGNvbnN0IG5hdHVyZSA9IHVuZGVmaW5lZDsiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQU8sT0FBTSxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLEFBQU8sT0FBTSxDQUFDLEdBQUcsV0FBVyxDQUFDO0FBQzdCLEFBQU8sT0FBTSxRQUFRLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQzs7Q0NGbEQsTUFBTSxnQkFBZ0IsU0FBUyxLQUFLLENBQUM7Q0FDckMsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFO0NBQ3pCLFFBQVEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ3ZCLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztDQUMxQyxRQUFRLElBQUksT0FBTyxLQUFLLENBQUMsaUJBQWlCLEtBQUssVUFBVSxFQUFFO0NBQzNELFlBQVksS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Q0FDNUQsU0FBUyxNQUFNO0NBQ2YsWUFBWSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDO0NBQ3BELFNBQVM7Q0FDVCxLQUFLO0NBQ0wsQ0FBQzs7Q0NWRCxNQUFNLEtBQUssQ0FBQzs7Q0FFWixJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Q0FDbEIsUUFBUSxPQUFP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
