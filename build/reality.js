(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Reality = global.Reality || {})));
}(this, (function (exports) { 'use strict';

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
	        return 6.67384e-11;
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
	                            particle.velocity[n] += (((totalForce * differences[n] / distance) * Gravitation.G)); //should apply delta?  * delta
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

	const nature = undefined;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbGl0eS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2xpYi9SZWFsaXR5RXhjZXB0aW9uLmpzIiwiLi4vc3JjL1RoaW5nLmpzIiwiLi4vc3JjL0Fic3RyYWN0YS5qcyIsIi4uL3NyYy9kaW1lbnNpb25zL0RpbWVuc2lvbi5qcyIsIi4uL3NyYy9sYXdzL0xhdy5qcyIsIi4uL3NyYy9kaW1lbnNpb25zL1BoeXNpY2FsRGltZW5zaW9uLmpzIiwiLi4vc3JjL0NvbmNyZXRhLmpzIiwiLi4vc3JjL2xpYi9WZWN0b3IuanMiLCIuLi9zcmMvQm9keS5qcyIsIi4uL3NyYy9Vbml2ZXJzZS5qcyIsIi4uL3NyYy9sYXdzL0dyYXZpdGF0aW9uLmpzIiwiLi4vc3JjL2RpbWVuc2lvbnMvVGltZS5qcyIsIi4uL3NyYy9sYXdzL01vdGlvbi5qcyIsIi4uL3NyYy9IZWxwZXJzLmpzIiwiLi4vc3JjL3JlbmRlcnMvUmVuZGVyZXIuanMiLCIuLi9zcmMvcmVuZGVycy9DU1NSZW5kZXJlci5qcyIsIi4uL3NyYy9yZW5kZXJzL1RocmVlSlMuanMiLCIuLi9zcmMvUmVhbGl0eS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBSZWFsaXR5RXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcclxuICAgICAgICBpZiAodHlwZW9mIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKG1lc3NhZ2UpKS5zdGFjaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7UmVhbGl0eUV4Y2VwdGlvbn07IiwiY2xhc3MgVGhpbmcge1xyXG5cclxuICAgIGhhcHBlbihkZWx0YSkge1xyXG4gICAgICAgIHJldHVybiBkZWx0YTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VGhpbmd9O1xyXG4iLCJpbXBvcnQge1RoaW5nfSBmcm9tIFwiLi9UaGluZ1wiO1xyXG5cclxuY2xhc3MgQWJzdHJhY3RhIGV4dGVuZHMgVGhpbmcge1xyXG5cclxufVxyXG5cclxuZXhwb3J0IHtBYnN0cmFjdGF9OyIsImltcG9ydCB7QWJzdHJhY3RhfSBmcm9tIFwiLi4vQWJzdHJhY3RhXCI7XHJcblxyXG5jbGFzcyBEaW1lbnNpb24gZXh0ZW5kcyBBYnN0cmFjdGEge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge0RpbWVuc2lvbn07IiwiaW1wb3J0IHtBYnN0cmFjdGF9IGZyb20gXCIuLi9BYnN0cmFjdGFcIjtcclxuXHJcbmNsYXNzIExhdyBleHRlbmRzIEFic3RyYWN0YSB7XHJcblxyXG59XHJcblxyXG5leHBvcnQge0xhd307IiwiaW1wb3J0IHtEaW1lbnNpb259IGZyb20gXCIuL0RpbWVuc2lvblwiO1xyXG5cclxuY2xhc3MgUGh5c2ljYWxEaW1lbnNpb24gZXh0ZW5kcyBEaW1lbnNpb24ge1xyXG5cclxuICAgIGhhcHBlbihkZWx0YSwgdW5pdmVyc2UpIHtcclxuICAgICAgICByZXR1cm4gZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1BoeXNpY2FsRGltZW5zaW9ufTsiLCJpbXBvcnQge1RoaW5nfSBmcm9tIFwiLi9UaGluZ1wiO1xyXG5cclxuY2xhc3MgQ29uY3JldGEgZXh0ZW5kcyBUaGluZyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAdHlwZSB7VGhpbmdbXX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRoaW5ncyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtUaGluZ30gYW55XHJcbiAgICAgKiBAcmV0dXJucyB7VGhpbmd9XHJcbiAgICAgKi9cclxuICAgIGFkZCguLi5hbnkpIHtcclxuICAgICAgICB0aGlzLnRoaW5ncy5wdXNoKC4uLmFueSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge1RoaW5nfSBhbnlcclxuICAgICAqIEByZXR1cm5zIHtUaGluZ31cclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKC4uLmFueSkge1xyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRoaW5nSW5kZXggPSB0aGlzLnRoaW5ncy5pbmRleE9mKHRoaW5nKTtcclxuICAgICAgICAgICAgaWYgKHRoaW5nSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aGluZ3Muc3BsaWNlKHRoaW5nSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhhcHBlbihkZWx0YSwgcGFyZW50VGhpbmcpIHtcclxuICAgICAgICBkZWx0YSA9IHN1cGVyLmhhcHBlbihkZWx0YSwgcGFyZW50VGhpbmcpO1xyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdGhpcy50aGluZ3MpIHtcclxuICAgICAgICAgICAgZGVsdGEgPSB0aGluZy5oYXBwZW4oZGVsdGEsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge0NvbmNyZXRhfTsiLCIvKipcclxuICogbi1kaW1lbnNpb25hbCB2ZWN0b3JcclxuICovXHJcbmNsYXNzIFZlY3RvciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFsdWVzID0ge30pIHtcclxuXHJcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlcyksXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogT2JqZWN0LnZhbHVlcyh2YWx1ZXMpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAga2V5czoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBrZXlzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgW2luZGV4LCBrZXldIG9mIGtleXMuZW50cmllcygpKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBnZXRJdCA9ICgpID0+IHRoaXMudmFsdWVzW2luZGV4XSxcclxuICAgICAgICAgICAgICAgIHNldEl0ID0gdmFsID0+IHRoaXMudmFsdWVzW2luZGV4XSA9IHZhbDtcclxuXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXNba2V5XSA9IHtlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IGZhbHNlLCBnZXQ6IGdldEl0LCBzZXQ6IHNldEl0fTtcclxuICAgICAgICAgICAgcHJvcGVydGllc1tpbmRleF0gPSB7ZW51bWVyYWJsZTogZmFsc2UsIGNvbmZpZ3VyYWJsZTogZmFsc2UsIGdldDogZ2V0SXQsIHNldDogc2V0SXR9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywgcHJvcGVydGllcyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgICogW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgeWllbGQqIHRoaXMudmFsdWVzLmVudHJpZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWR1Y2UoY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMubGVuZ3RoID8gdGhpcy52YWx1ZXMucmVkdWNlKGNhbGxiYWNrKSA6IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN1bSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWR1Y2UoKGMsIHYpID0+IGMgKyB2KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQodmVjdG9yKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB0aGlzW25dID0gdmVjW25dICsgdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSArIHNjYWxhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBzdWIodmVjdG9yKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gLSB2ZWN0b3Jbbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgc3ViU2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dIC0gc2NhbGFyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIG11bHRpcGx5KHZlY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dICogdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIG11bHRpcGx5U2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dICogc2NhbGFyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIGRpdmlkZSh2ZWN0b3IpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAvIHZlY3RvcltuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBkaXZpZGVTY2FsYXIoc2NhbGFyKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gLyBzY2FsYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgZG90KHZlY3Rvcikge1xyXG4gICAgICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHRoaXMua2V5cykge1xyXG4gICAgICAgICAgICB0b3RhbCArPSB0aGlzW25dICogdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG90YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbmd0aFNxKCkge1xyXG4gICAgICAgIC8vcmV0dXJuIHRoaXMuY2xvbmUoKS5wb3coMikuc3VtKCk7XHJcbiAgICAgICAgbGV0IHRvdGFsID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdGhpcy52YWx1ZXMpIHtcclxuICAgICAgICAgICAgdG90YWwgKz0gbiAqIG47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b3RhbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5sZW5ndGhTcSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGxlbmd0aChsZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemVkLm11bHRpcGx5U2NhbGFyKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5vcm1hbGl6ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlU2NhbGFyKHRoaXMubGVuZ3RoIHx8IDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge1ZlY3Rvcn1cclxuICAgICAqL1xyXG4gICAgY2xvbmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvcHkodmVjdG9yKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlY3Rvci5rZXlzKSB7XHJcbiAgICAgICAgICAgIHRoaXNbbl0gPSB2ZWN0b3Jbbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcclxuICAgICAqIEByZXR1cm5zIHtWZWN0b3J9XHJcbiAgICAgKi9cclxuICAgIG1hcChjYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnN0IHZlY3RvciA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlY3Rvci5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY3RvcltuXSA9IGNhbGxiYWNrKHZlY3RvcltuXSwgbiwgaSk7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBwb3cocCkge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dICoqIHA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzdGFuY2VUb1NxdWFyZWQodmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKHZlY3RvcikucG93KDIpLnN1bTtcclxuICAgIH1cclxuXHJcbiAgICBkaXN0YW5jZVRvKHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kaXN0YW5jZVRvU3F1YXJlZCh2ZWN0b3IpKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VmVjdG9yfTsiLCJpbXBvcnQge0NvbmNyZXRhfSBmcm9tIFwiLi9Db25jcmV0YVwiO1xyXG5cclxuY2xhc3MgQm9keSBleHRlbmRzIENvbmNyZXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKHttYXNzID0gMH0pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubWFzcyA9IG1hc3M7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7Qm9keX07IiwiaW1wb3J0IHtEaW1lbnNpb259IGZyb20gXCIuL2RpbWVuc2lvbnMvRGltZW5zaW9uXCI7XHJcbmltcG9ydCB7TGF3fSBmcm9tIFwiLi9sYXdzL0xhd1wiO1xyXG5pbXBvcnQge1BoeXNpY2FsRGltZW5zaW9ufSBmcm9tIFwiLi9kaW1lbnNpb25zL1BoeXNpY2FsRGltZW5zaW9uXCI7XHJcbmltcG9ydCB7VGhpbmd9IGZyb20gXCIuL1RoaW5nXCI7XHJcbmltcG9ydCB7Q29uY3JldGF9IGZyb20gXCIuL0NvbmNyZXRhXCI7XHJcbmltcG9ydCB7VmVjdG9yfSBmcm9tIFwiLi9saWIvVmVjdG9yXCI7XHJcbmltcG9ydCB7Qm9keX0gZnJvbSBcIi4vQm9keVwiO1xyXG5cclxuY2xhc3MgVW5pdmVyc2UgZXh0ZW5kcyBDb25jcmV0YSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoLi4uYW55KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmxhd3MgPSBbXTtcclxuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmJvZGllcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLlZlY3RvciA9IGNsYXNzIGV4dGVuZHMgVmVjdG9yIHtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IodmFsdWVzID0ge30pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHtuYW1lOiBkaW1lbnNpb25OYW1lfSBvZiB1bml2ZXJzZS5waHlzaWNhbERpbWVuc2lvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlcy5oYXNPd25Qcm9wZXJ0eShkaW1lbnNpb25OYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbZGltZW5zaW9uTmFtZV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzdXBlcih2YWx1ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5Cb2R5ID0gY2xhc3MgZXh0ZW5kcyBCb2R5IHtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoZGVmaW5pdGlvbiA9IHt9KSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihkZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBkZWZpbml0aW9uLnBvc2l0aW9uIGluc3RhbmNlb2YgdW5pdmVyc2UuVmVjdG9yID9cclxuICAgICAgICAgICAgICAgICAgICBkZWZpbml0aW9uLnBvc2l0aW9uIDogbmV3IHVuaXZlcnNlLlZlY3RvcihkZWZpbml0aW9uLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVsb2NpdHkgPSBkZWZpbml0aW9uLnZlbG9jaXR5IGluc3RhbmNlb2YgdW5pdmVyc2UuVmVjdG9yID9cclxuICAgICAgICAgICAgICAgICAgICBkZWZpbml0aW9uLnZlbG9jaXR5IDogbmV3IHVuaXZlcnNlLlZlY3RvcihkZWZpbml0aW9uLnZlbG9jaXR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYWRkKC4uLmFueSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldCBwaHlzaWNhbERpbWVuc2lvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGltZW5zaW9ucy5maWx0ZXIoZGltZW5zaW9uID0+IGRpbWVuc2lvbiBpbnN0YW5jZW9mIFBoeXNpY2FsRGltZW5zaW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbm9uUGh5c2ljYWxEaW1lbnNpb25zKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGRpbWVuc2lvbiA9PiAhKGRpbWVuc2lvbiBpbnN0YW5jZW9mIFBoeXNpY2FsRGltZW5zaW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge1RoaW5nfSBhbnlcclxuICAgICAqIEByZXR1cm5zIHtVbml2ZXJzZX1cclxuICAgICAqL1xyXG4gICAgYWRkKC4uLmFueSkge1xyXG4gICAgICAgIHN1cGVyLmFkZCguLi5hbnkpO1xyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGluZyBpbnN0YW5jZW9mIERpbWVuc2lvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zLnB1c2godGhpbmcpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaW5nIGluc3RhbmNlb2YgTGF3KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhd3MucHVzaCh0aGluZyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpbmcgaW5zdGFuY2VvZiB0aGlzLkJvZHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9kaWVzLnB1c2godGhpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtUaGluZ30gYW55XHJcbiAgICAgKiBAcmV0dXJucyB7VW5pdmVyc2V9XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZSguLi5hbnkpIHtcclxuICAgICAgICBzdXBlci5yZW1vdmUoLi4uYW55KTtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpbmcgaW5zdGFuY2VvZiBEaW1lbnNpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRoaW5nSW5kZXggPSB0aGlzLmRpbWVuc2lvbnMuaW5kZXhPZih0aGluZyk7XHJcbiAgICAgICAgICAgICAgICB0aGluZ0luZGV4ID49IDAgJiYgdGhpcy5kaW1lbnNpb25zLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGluZyBpbnN0YW5jZW9mIExhdykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGhpbmdJbmRleCA9IHRoaXMubGF3cy5pbmRleE9mKHRoaW5nKTtcclxuICAgICAgICAgICAgICAgIHRoaW5nSW5kZXggPj0gMCAmJiB0aGlzLmxhd3Muc3BsaWNlKHRoaW5nSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaW5nIGluc3RhbmNlb2YgdGhpcy5Cb2R5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aGluZ0luZGV4ID0gdGhpcy5ib2RpZXMuaW5kZXhPZih0aGluZyk7XHJcbiAgICAgICAgICAgICAgICB0aGluZ0luZGV4ID49IDAgJiYgdGhpcy5ib2RpZXMuc3BsaWNlKHRoaW5nSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtVbml2ZXJzZX07IiwiaW1wb3J0IHtMYXd9IGZyb20gXCIuL0xhd1wiO1xyXG5pbXBvcnQge0JvZHl9IGZyb20gXCIuLi9Cb2R5XCI7XHJcblxyXG5jbGFzcyBHcmF2aXRhdGlvbiBleHRlbmRzIExhdyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgRygpIHtcclxuICAgICAgICByZXR1cm4gNi42NzM4NGUtMTE7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGhhcHBlbihkZWx0YSwgdW5pdmVyc2UpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcGh5c2ljYWxEaW1lbnNpb25zID0gdW5pdmVyc2UucGh5c2ljYWxEaW1lbnNpb25zO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHBhcnRpY2xlIG9mIHVuaXZlcnNlLmJvZGllcykge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwYXJ0aWNsZS5tYXNzKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcnRpY2xlIGluc3RhbmNlb2YgQm9keSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvdGhlclBhcnRpY2xlIG9mIHVuaXZlcnNlLmJvZGllcykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW90aGVyUGFydGljbGUubWFzcyB8fCBwYXJ0aWNsZSA9PT0gb3RoZXJQYXJ0aWNsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZlcmVuY2VzID0gb3RoZXJQYXJ0aWNsZS5wb3NpdGlvbi5zdWIocGFydGljbGUucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlU3F1YXJlZCA9IG90aGVyUGFydGljbGUucG9zaXRpb24uZGlzdGFuY2VUb1NxdWFyZWQocGFydGljbGUucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gb3RoZXJQYXJ0aWNsZS5wb3NpdGlvbi5kaXN0YW5jZVRvKHBhcnRpY2xlLnBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID4gMTAgKyAxMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG90YWxGb3JjZSA9IChvdGhlclBhcnRpY2xlLm1hc3MgLyBkaXN0YW5jZVNxdWFyZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JjZVZlY3RvciA9IG5ldyB1bml2ZXJzZS5WZWN0b3IoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW25dIG9mIGZvcmNlVmVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS52ZWxvY2l0eVtuXSArPSAoKCh0b3RhbEZvcmNlICogZGlmZmVyZW5jZXNbbl0gLyBkaXN0YW5jZSkgKiBHcmF2aXRhdGlvbi5HKSk7IC8vc2hvdWxkIGFwcGx5IGRlbHRhPyAgKiBkZWx0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW25dIG9mIGRpZmZlcmVuY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IChwYXJ0aWNsZS5tYXNzICogcGFydGljbGUudmVsb2NpdHlbbl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIG90aGVyUGFydGljbGUubWFzcyAqIG90aGVyUGFydGljbGUudmVsb2NpdHlbbl0pIC8gKHBhcnRpY2xlLm1hc3MgKyBvdGhlclBhcnRpY2xlLm1hc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHlbbl0gPSB2ZWxvY2l0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyUGFydGljbGUudmVsb2NpdHlbbl0gPSB2ZWxvY2l0eTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge0dyYXZpdGF0aW9ufTsiLCJpbXBvcnQge0RpbWVuc2lvbn0gZnJvbSBcIi4vRGltZW5zaW9uXCI7XHJcblxyXG5jbGFzcyBUaW1lIGV4dGVuZHMgRGltZW5zaW9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigndCcpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHRoaXMub2xkVGltZSA9IHRoaXMuc3RhcnRUaW1lO1xyXG4gICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGVsYXBzZWRUaW1lKCkge1xyXG4gICAgICAgIHRoaXMuZGVsdGE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsYXBzZWRUaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBkZWx0YSgpIHtcclxuICAgICAgICBjb25zdCBuZXdUaW1lID0gKCB0eXBlb2YgcGVyZm9ybWFuY2UgPT09ICd1bmRlZmluZWQnID8gRGF0ZSA6IHBlcmZvcm1hbmNlICkubm93KCksXHJcbiAgICAgICAgICAgIGRpZmYgPSAoIG5ld1RpbWUgLSB0aGlzLm9sZFRpbWUgKSAvIDEwMDA7XHJcblxyXG4gICAgICAgIHRoaXMub2xkVGltZSA9IG5ld1RpbWU7XHJcbiAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgKz0gZGlmZjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRpZmY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsdGFcclxuICAgICAqIEBwYXJhbSB7VGhpbmd9IHBhcmVudFRoaW5nXHJcbiAgICAgKi9cclxuICAgIGhhcHBlbihkZWx0YSwgcGFyZW50VGhpbmcpIHtcclxuICAgICAgICAvL21ha2VzIHBhcmVudCB0aGluZyBoYXBwZW4gcmVwZWF0ZWRseSwgcmVkdWNpbmcgaXRzIGRlbHRhXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHBhcmVudFRoaW5nLmhhcHBlbigpKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWx0YTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VGltZX07IiwiaW1wb3J0IHtMYXd9IGZyb20gXCIuL0xhd1wiO1xyXG5cclxuY2xhc3MgTW90aW9uIGV4dGVuZHMgTGF3IHtcclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHVuaXZlcnNlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHBoeXNpY2FsRGltZW5zaW9ucyA9IHVuaXZlcnNlLnBoeXNpY2FsRGltZW5zaW9ucztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiB1bml2ZXJzZS50aGluZ3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaW5nIGluc3RhbmNlb2YgdW5pdmVyc2UuQm9keSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB7bmFtZTogZGltZW5zaW9uTmFtZX0gb2YgcGh5c2ljYWxEaW1lbnNpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpbmcucG9zaXRpb25bZGltZW5zaW9uTmFtZV0gPSB0aGluZy5wb3NpdGlvbltkaW1lbnNpb25OYW1lXSArICh0aGluZy52ZWxvY2l0eVtkaW1lbnNpb25OYW1lXSAqIGRlbHRhKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge01vdGlvbn07IiwiaW1wb3J0IHtVbml2ZXJzZX0gZnJvbSBcIi4vVW5pdmVyc2VcIjtcclxuaW1wb3J0IHtQaHlzaWNhbERpbWVuc2lvbn0gZnJvbSBcIi4vZGltZW5zaW9ucy9QaHlzaWNhbERpbWVuc2lvblwiO1xyXG5pbXBvcnQge1RpbWV9IGZyb20gXCIuL2RpbWVuc2lvbnMvVGltZVwiO1xyXG5pbXBvcnQge0dyYXZpdGF0aW9ufSBmcm9tIFwiLi9sYXdzL0dyYXZpdGF0aW9uXCI7XHJcbmltcG9ydCB7TW90aW9ufSBmcm9tIFwiLi9sYXdzL01vdGlvblwiO1xyXG5cclxuZnVuY3Rpb24gYmlnQmFuZygpIHtcclxuICAgIHJldHVybiBuZXcgVW5pdmVyc2UoXHJcbiAgICAgICAgbmV3IFRpbWUoKSxcclxuICAgICAgICBuZXcgUGh5c2ljYWxEaW1lbnNpb24oJ3gnKSxcclxuICAgICAgICBuZXcgUGh5c2ljYWxEaW1lbnNpb24oJ3knKSxcclxuICAgICAgICBuZXcgUGh5c2ljYWxEaW1lbnNpb24oJ3onKSxcclxuICAgICAgICBuZXcgTW90aW9uKCksXHJcbiAgICAgICAgbmV3IEdyYXZpdGF0aW9uKClcclxuICAgICk7XHJcbn1cclxuXHJcbmV4cG9ydCB7YmlnQmFuZ307IiwiY29uc3QgcmVuZGVyZXJzID0gW107XHJcblxyXG5sZXQgcmVuZGVyaW5nU3RhcnRlZCA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQoKSB7XHJcbiAgICBpZiAoIXJlbmRlcmluZ1N0YXJ0ZWQpIHtcclxuICAgICAgICByZW5kZXJpbmdTdGFydGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgbGV0IGxhc3RUaW1lID0gMDtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gcmVuZGVyKHRpbWUpIHtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVuZGVyZXIgb2YgcmVuZGVyZXJzKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJlci5yZWFkeSAmJiByZW5kZXJlci51cGRhdGUodGltZSAtIGxhc3RUaW1lLCB0aW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXN0VGltZSA9IHRpbWU7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFJlbmRlcmVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgcmVuZGVyZXJzLnB1c2godGhpcyk7XHJcbiAgICAgICAgc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1VuaXZlcnNlfSB1bml2ZXJzZVxyXG4gICAgICovXHJcbiAgICByZW5kZXJzKHVuaXZlcnNlKSB7XHJcbiAgICAgICAgdGhpcy51bml2ZXJzZSA9IHVuaXZlcnNlO1xyXG4gICAgICAgIHRoaXMucmVhZHkgPSB0aGlzLnNldHVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRlbHRhLCB0aW1lKSB7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtSZW5kZXJlcn07IiwiaW1wb3J0IHtSZW5kZXJlcn0gZnJvbSBcIi4vUmVuZGVyZXJcIjtcclxuXHJcbmNsYXNzIENTU1JlbmRlcmVyIGV4dGVuZHMgUmVuZGVyZXIge1xyXG5cclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdGhpcy51bml2ZXJzZS5ib2RpZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnYm9keScpO1xyXG4gICAgICAgICAgICB0aGluZy5yZW5kZXIgPSBlbDtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkZWx0YSwgdGltZSkge1xyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdGhpcy51bml2ZXJzZS5ib2RpZXMpIHtcclxuICAgICAgICAgICAgdGhpbmcucmVuZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgnICsgKHRoaW5nLnBvc2l0aW9uLnZhbHVlcy5tYXAodiA9PiAodiAvIDUwMDAwMCkgKyAncHgnKS5qb2luKCcsJykpICsgJyknO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7Q1NTUmVuZGVyZXJ9OyIsImltcG9ydCB7UmVuZGVyZXJ9IGZyb20gXCIuL1JlbmRlcmVyXCI7XHJcbmltcG9ydCB7UmVhbGl0eUV4Y2VwdGlvbn0gZnJvbSBcIi4uL2xpYi9SZWFsaXR5RXhjZXB0aW9uXCI7XHJcblxyXG5jbGFzcyBUaHJlZVJlbmRlcmVyIGV4dGVuZHMgUmVuZGVyZXIge1xyXG5cclxuICAgIHNldHVwKCkge1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIFRIUkVFID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVhbGl0eUV4Y2VwdGlvbigndGhyZWUuanMgbm90IGluY2x1ZGVkJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChUSFJFRS5SRVZJU0lPTiA8IDg2KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWFsaXR5RXhjZXB0aW9uKCd0aHJlZS5qcyBtb3N0IGJlIG5ld2VyIHRoYW4gODUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAxLCAxMDAwMCk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDEwMDA7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiB0aGlzLnVuaXZlcnNlLmJvZGllcykge1xyXG4gICAgICAgICAgICB0aGluZy5yZW5kZXIgPSBuZXcgVEhSRUUuTWVzaChcclxuICAgICAgICAgICAgICAgIG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxMDApLFxyXG4gICAgICAgICAgICAgICAgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjogMHhmZjAwMDAsIHdpcmVmcmFtZTogdHJ1ZX0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaW5nLnJlbmRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5zZXR1cCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGVsdGEsIHRpbWUpIHtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiB0aGlzLnVuaXZlcnNlLmJvZGllcykge1xyXG4gICAgICAgICAgICB0aGluZy5yZW5kZXIucG9zaXRpb24uc2V0KFxyXG4gICAgICAgICAgICAgICAgdGhpbmcucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHRoaW5nLnBvc2l0aW9uLnksXHJcbiAgICAgICAgICAgICAgICB0aGluZy5wb3NpdGlvbi56XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1RocmVlUmVuZGVyZXJ9OyIsImV4cG9ydCB7UmVhbGl0eUV4Y2VwdGlvbiBhcyBFeGNlcHRpb259IGZyb20gJy4vbGliL1JlYWxpdHlFeGNlcHRpb24nO1xyXG5leHBvcnQge1VuaXZlcnNlfSBmcm9tICcuL1VuaXZlcnNlJztcclxuZXhwb3J0IHtMYXd9IGZyb20gJy4vbGF3cy9MYXcnO1xyXG5leHBvcnQge0dyYXZpdGF0aW9ufSBmcm9tICcuL2xhd3MvR3Jhdml0YXRpb24nO1xyXG5leHBvcnQge1RpbWV9IGZyb20gJy4vZGltZW5zaW9ucy9UaW1lJztcclxuZXhwb3J0IHtQaHlzaWNhbERpbWVuc2lvbn0gZnJvbSAnLi9kaW1lbnNpb25zL1BoeXNpY2FsRGltZW5zaW9uJztcclxuZXhwb3J0IHtWZWN0b3J9IGZyb20gJy4vbGliL1ZlY3Rvcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vSGVscGVycyc7XHJcbmV4cG9ydCB7Q1NTUmVuZGVyZXJ9IGZyb20gJy4vcmVuZGVycy9DU1NSZW5kZXJlcic7XHJcbmV4cG9ydCB7VGhyZWVSZW5kZXJlcn0gZnJvbSAnLi9yZW5kZXJzL1RocmVlSlMnO1xyXG5cclxuLy9XaGF0IGlzIHRoZSBuYXR1cmUgb2YgcmVhbGl0eT9cclxuZXhwb3J0IGNvbnN0IG5hdHVyZSA9IHVuZGVmaW5lZDsiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0NBQUEsTUFBTSxnQkFBZ0IsU0FBUyxLQUFLLENBQUM7Q0FDckMsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFO0NBQ3pCLFFBQVEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ3ZCLFFBQVEsSUFBSSxDQUFDLElBQUksR0FB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
