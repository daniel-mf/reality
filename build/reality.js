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

	class Body extends Concreta {
	    constructor({mass = 0}) {
	        super();
	        this.mass = mass;
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

	class PhysicalDimension extends Dimension {

	    happen(delta, universe) {
	        return delta;
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
	                            particle.velocity[n] += (((totalForce * differences[n] / distance) * Gravitation.G) * delta);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbGl0eS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2xpYi9SZWFsaXR5RXhjZXB0aW9uLmpzIiwiLi4vc3JjL1RoaW5nLmpzIiwiLi4vc3JjL0Fic3RyYWN0YS5qcyIsIi4uL3NyYy9kaW1lbnNpb25zL0RpbWVuc2lvbi5qcyIsIi4uL3NyYy9sYXdzL0xhdy5qcyIsIi4uL3NyYy9Db25jcmV0YS5qcyIsIi4uL3NyYy9Cb2R5LmpzIiwiLi4vc3JjL2xpYi9WZWN0b3IuanMiLCIuLi9zcmMvZGltZW5zaW9ucy9QaHlzaWNhbERpbWVuc2lvbi5qcyIsIi4uL3NyYy9Vbml2ZXJzZS5qcyIsIi4uL3NyYy9sYXdzL0dyYXZpdGF0aW9uLmpzIiwiLi4vc3JjL2RpbWVuc2lvbnMvVGltZS5qcyIsIi4uL3NyYy9sYXdzL01vdGlvbi5qcyIsIi4uL3NyYy9IZWxwZXJzLmpzIiwiLi4vc3JjL3JlbmRlcnMvUmVuZGVyZXIuanMiLCIuLi9zcmMvcmVuZGVycy9DU1NSZW5kZXJlci5qcyIsIi4uL3NyYy9yZW5kZXJzL1RocmVlSlMuanMiLCIuLi9zcmMvUmVhbGl0eS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBSZWFsaXR5RXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcclxuICAgICAgICBpZiAodHlwZW9mIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKG1lc3NhZ2UpKS5zdGFjaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7UmVhbGl0eUV4Y2VwdGlvbn07IiwiY2xhc3MgVGhpbmcge1xyXG5cclxuICAgIGhhcHBlbihkZWx0YSkge1xyXG4gICAgICAgIHJldHVybiBkZWx0YTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VGhpbmd9O1xyXG4iLCJpbXBvcnQge1RoaW5nfSBmcm9tIFwiLi9UaGluZ1wiO1xyXG5cclxuY2xhc3MgQWJzdHJhY3RhIGV4dGVuZHMgVGhpbmcge1xyXG5cclxufVxyXG5cclxuZXhwb3J0IHtBYnN0cmFjdGF9OyIsImltcG9ydCB7QWJzdHJhY3RhfSBmcm9tIFwiLi4vQWJzdHJhY3RhXCI7XHJcblxyXG5jbGFzcyBEaW1lbnNpb24gZXh0ZW5kcyBBYnN0cmFjdGEge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge0RpbWVuc2lvbn07IiwiaW1wb3J0IHtBYnN0cmFjdGF9IGZyb20gXCIuLi9BYnN0cmFjdGFcIjtcclxuXHJcbmNsYXNzIExhdyBleHRlbmRzIEFic3RyYWN0YSB7XHJcblxyXG59XHJcblxyXG5leHBvcnQge0xhd307IiwiaW1wb3J0IHtUaGluZ30gZnJvbSBcIi4vVGhpbmdcIjtcclxuXHJcbmNsYXNzIENvbmNyZXRhIGV4dGVuZHMgVGhpbmcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHR5cGUge1RoaW5nW119XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50aGluZ3MgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7VGhpbmd9IGFueVxyXG4gICAgICogQHJldHVybnMge1RoaW5nfVxyXG4gICAgICovXHJcbiAgICBhZGQoLi4uYW55KSB7XHJcbiAgICAgICAgdGhpcy50aGluZ3MucHVzaCguLi5hbnkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtUaGluZ30gYW55XHJcbiAgICAgKiBAcmV0dXJucyB7VGhpbmd9XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZSguLi5hbnkpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIGFueSkge1xyXG4gICAgICAgICAgICBjb25zdCB0aGluZ0luZGV4ID0gdGhpcy50aGluZ3MuaW5kZXhPZih0aGluZyk7XHJcbiAgICAgICAgICAgIGlmICh0aGluZ0luZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGhpbmdzLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHBhcmVudFRoaW5nKSB7XHJcbiAgICAgICAgZGVsdGEgPSBzdXBlci5oYXBwZW4oZGVsdGEsIHBhcmVudFRoaW5nKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIHRoaXMudGhpbmdzKSB7XHJcbiAgICAgICAgICAgIGRlbHRhID0gdGhpbmcuaGFwcGVuKGRlbHRhLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtDb25jcmV0YX07IiwiaW1wb3J0IHtDb25jcmV0YX0gZnJvbSBcIi4vQ29uY3JldGFcIjtcclxuXHJcbmNsYXNzIEJvZHkgZXh0ZW5kcyBDb25jcmV0YSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7bWFzcyA9IDB9KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1hc3MgPSBtYXNzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0JvZHl9OyIsIi8qKlxyXG4gKiBuLWRpbWVuc2lvbmFsIHZlY3RvclxyXG4gKi9cclxuY2xhc3MgVmVjdG9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZXMgPSB7fSkge1xyXG5cclxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModmFsdWVzKSxcclxuICAgICAgICAgICAgcHJvcGVydGllcyA9IHtcclxuICAgICAgICAgICAgICAgIHZhbHVlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBPYmplY3QudmFsdWVzKHZhbHVlcylcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBrZXlzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGtleXNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIGtleV0gb2Yga2V5cy5lbnRyaWVzKCkpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdldEl0ID0gKCkgPT4gdGhpcy52YWx1ZXNbaW5kZXhdLFxyXG4gICAgICAgICAgICAgICAgc2V0SXQgPSB2YWwgPT4gdGhpcy52YWx1ZXNbaW5kZXhdID0gdmFsO1xyXG5cclxuICAgICAgICAgICAgcHJvcGVydGllc1trZXldID0ge2VudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogZmFsc2UsIGdldDogZ2V0SXQsIHNldDogc2V0SXR9O1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzW2luZGV4XSA9IHtlbnVtZXJhYmxlOiBmYWxzZSwgY29uZmlndXJhYmxlOiBmYWxzZSwgZ2V0OiBnZXRJdCwgc2V0OiBzZXRJdH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCBwcm9wZXJ0aWVzKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgKiBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuICAgICAgICB5aWVsZCogdGhpcy52YWx1ZXMuZW50cmllcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZHVjZShjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5sZW5ndGggPyB0aGlzLnZhbHVlcy5yZWR1Y2UoY2FsbGJhY2spIDogMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc3VtKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlZHVjZSgoYywgdikgPT4gYyArIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZCh2ZWN0b3IpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHRoaXNbbl0gPSB2ZWNbbl0gKyB2ZWN0b3Jbbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkU2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dICsgc2NhbGFyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIHN1Yih2ZWN0b3IpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAtIHZlY3RvcltuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBzdWJTY2FsYXIoc2NhbGFyKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gLSBzY2FsYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgbXVsdGlwbHkodmVjdG9yKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gKiB2ZWN0b3Jbbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgbXVsdGlwbHlTY2FsYXIoc2NhbGFyKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gKiBzY2FsYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgZGl2aWRlKHZlY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dIC8gdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIGRpdmlkZVNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAvIHNjYWxhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBkb3QodmVjdG9yKSB7XHJcbiAgICAgICAgbGV0IHRvdGFsID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdGhpcy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHRvdGFsICs9IHRoaXNbbl0gKiB2ZWN0b3Jbbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b3RhbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuZ3RoU3EoKSB7XHJcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5jbG9uZSgpLnBvdygyKS5zdW0oKTtcclxuICAgICAgICBsZXQgdG90YWwgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB0aGlzLnZhbHVlcykge1xyXG4gICAgICAgICAgICB0b3RhbCArPSBuICogbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvdGFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmxlbmd0aFNxKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbGVuZ3RoKGxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZWQubXVsdGlwbHlTY2FsYXIobGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbm9ybWFsaXplZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGVTY2FsYXIodGhpcy5sZW5ndGggfHwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjdG9yfVxyXG4gICAgICovXHJcbiAgICBjbG9uZSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29weSh2ZWN0b3IpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjdG9yLmtleXMpIHtcclxuICAgICAgICAgICAgdGhpc1tuXSA9IHZlY3RvcltuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gICAgICogQHJldHVybnMge1ZlY3Rvcn1cclxuICAgICAqL1xyXG4gICAgbWFwKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc3QgdmVjdG9yID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjdG9yLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjdG9yW25dID0gY2FsbGJhY2sodmVjdG9yW25dLCBuLCBpKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHBvdyhwKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gKiogcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBkaXN0YW5jZVRvU3F1YXJlZCh2ZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWIodmVjdG9yKS5wb3coMikuc3VtO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3RhbmNlVG8odmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRpc3RhbmNlVG9TcXVhcmVkKHZlY3RvcikpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtWZWN0b3J9OyIsImltcG9ydCB7RGltZW5zaW9ufSBmcm9tIFwiLi9EaW1lbnNpb25cIjtcclxuXHJcbmNsYXNzIFBoeXNpY2FsRGltZW5zaW9uIGV4dGVuZHMgRGltZW5zaW9uIHtcclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHVuaXZlcnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtQaHlzaWNhbERpbWVuc2lvbn07IiwiaW1wb3J0IHtEaW1lbnNpb259IGZyb20gXCIuL2RpbWVuc2lvbnMvRGltZW5zaW9uXCI7XHJcbmltcG9ydCB7TGF3fSBmcm9tIFwiLi9sYXdzL0xhd1wiO1xyXG5pbXBvcnQge0JvZHl9IGZyb20gXCIuL0JvZHlcIjtcclxuaW1wb3J0IHtWZWN0b3J9IGZyb20gXCIuL2xpYi9WZWN0b3JcIjtcclxuaW1wb3J0IHtQaHlzaWNhbERpbWVuc2lvbn0gZnJvbSBcIi4vZGltZW5zaW9ucy9QaHlzaWNhbERpbWVuc2lvblwiO1xyXG5pbXBvcnQge1RoaW5nfSBmcm9tIFwiLi9UaGluZ1wiO1xyXG5pbXBvcnQge0NvbmNyZXRhfSBmcm9tIFwiLi9Db25jcmV0YVwiO1xyXG5cclxuY2xhc3MgVW5pdmVyc2UgZXh0ZW5kcyBDb25jcmV0YSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoLi4uYW55KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmxhd3MgPSBbXTtcclxuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmJvZGllcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLlZlY3RvciA9IGNsYXNzIGV4dGVuZHMgVmVjdG9yIHtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IodmFsdWVzID0ge30pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHtuYW1lOiBkaW1lbnNpb25OYW1lfSBvZiB1bml2ZXJzZS5waHlzaWNhbERpbWVuc2lvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlcy5oYXNPd25Qcm9wZXJ0eShkaW1lbnNpb25OYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbZGltZW5zaW9uTmFtZV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzdXBlcih2YWx1ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5Cb2R5ID0gY2xhc3MgZXh0ZW5kcyBCb2R5IHtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoZGVmaW5pdGlvbiA9IHt9KSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihkZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBkZWZpbml0aW9uLnBvc2l0aW9uIGluc3RhbmNlb2YgdW5pdmVyc2UuVmVjdG9yID9cclxuICAgICAgICAgICAgICAgICAgICBkZWZpbml0aW9uLnBvc2l0aW9uIDogbmV3IHVuaXZlcnNlLlZlY3RvcihkZWZpbml0aW9uLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVsb2NpdHkgPSBkZWZpbml0aW9uLnZlbG9jaXR5IGluc3RhbmNlb2YgdW5pdmVyc2UuVmVjdG9yID9cclxuICAgICAgICAgICAgICAgICAgICBkZWZpbml0aW9uLnZlbG9jaXR5IDogbmV3IHVuaXZlcnNlLlZlY3RvcihkZWZpbml0aW9uLnZlbG9jaXR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYWRkKC4uLmFueSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldCBwaHlzaWNhbERpbWVuc2lvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGltZW5zaW9ucy5maWx0ZXIoZGltZW5zaW9uID0+IGRpbWVuc2lvbiBpbnN0YW5jZW9mIFBoeXNpY2FsRGltZW5zaW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbm9uUGh5c2ljYWxEaW1lbnNpb25zKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGRpbWVuc2lvbiA9PiAhKGRpbWVuc2lvbiBpbnN0YW5jZW9mIFBoeXNpY2FsRGltZW5zaW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge1RoaW5nfSBhbnlcclxuICAgICAqIEByZXR1cm5zIHtVbml2ZXJzZX1cclxuICAgICAqL1xyXG4gICAgYWRkKC4uLmFueSkge1xyXG4gICAgICAgIHN1cGVyLmFkZCguLi5hbnkpO1xyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGluZyBpbnN0YW5jZW9mIERpbWVuc2lvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zLnB1c2godGhpbmcpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaW5nIGluc3RhbmNlb2YgTGF3KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhd3MucHVzaCh0aGluZyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpbmcgaW5zdGFuY2VvZiB0aGlzLkJvZHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9kaWVzLnB1c2godGhpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtUaGluZ30gYW55XHJcbiAgICAgKiBAcmV0dXJucyB7VW5pdmVyc2V9XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZSguLi5hbnkpIHtcclxuICAgICAgICBzdXBlci5yZW1vdmUoLi4uYW55KTtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpbmcgaW5zdGFuY2VvZiBEaW1lbnNpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRoaW5nSW5kZXggPSB0aGlzLmRpbWVuc2lvbnMuaW5kZXhPZih0aGluZyk7XHJcbiAgICAgICAgICAgICAgICB0aGluZ0luZGV4ID49IDAgJiYgdGhpcy5kaW1lbnNpb25zLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGluZyBpbnN0YW5jZW9mIExhdykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGhpbmdJbmRleCA9IHRoaXMubGF3cy5pbmRleE9mKHRoaW5nKTtcclxuICAgICAgICAgICAgICAgIHRoaW5nSW5kZXggPj0gMCAmJiB0aGlzLmxhd3Muc3BsaWNlKHRoaW5nSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaW5nIGluc3RhbmNlb2YgdGhpcy5Cb2R5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aGluZ0luZGV4ID0gdGhpcy5ib2RpZXMuaW5kZXhPZih0aGluZyk7XHJcbiAgICAgICAgICAgICAgICB0aGluZ0luZGV4ID49IDAgJiYgdGhpcy5ib2RpZXMuc3BsaWNlKHRoaW5nSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtVbml2ZXJzZX07IiwiaW1wb3J0IHtMYXd9IGZyb20gXCIuL0xhd1wiO1xyXG5pbXBvcnQge0JvZHl9IGZyb20gXCIuLi9Cb2R5XCI7XHJcblxyXG5jbGFzcyBHcmF2aXRhdGlvbiBleHRlbmRzIExhdyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgRygpIHtcclxuICAgICAgICByZXR1cm4gNi42NzM4NGUtMTE7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGhhcHBlbihkZWx0YSwgdW5pdmVyc2UpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcGh5c2ljYWxEaW1lbnNpb25zID0gdW5pdmVyc2UucGh5c2ljYWxEaW1lbnNpb25zO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHBhcnRpY2xlIG9mIHVuaXZlcnNlLmJvZGllcykge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwYXJ0aWNsZS5tYXNzKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcnRpY2xlIGluc3RhbmNlb2YgQm9keSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvdGhlclBhcnRpY2xlIG9mIHVuaXZlcnNlLmJvZGllcykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW90aGVyUGFydGljbGUubWFzcyB8fCBwYXJ0aWNsZSA9PT0gb3RoZXJQYXJ0aWNsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZlcmVuY2VzID0gb3RoZXJQYXJ0aWNsZS5wb3NpdGlvbi5zdWIocGFydGljbGUucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlU3F1YXJlZCA9IG90aGVyUGFydGljbGUucG9zaXRpb24uZGlzdGFuY2VUb1NxdWFyZWQocGFydGljbGUucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gb3RoZXJQYXJ0aWNsZS5wb3NpdGlvbi5kaXN0YW5jZVRvKHBhcnRpY2xlLnBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID4gMTAgKyAxMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG90YWxGb3JjZSA9IChvdGhlclBhcnRpY2xlLm1hc3MgLyBkaXN0YW5jZVNxdWFyZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JjZVZlY3RvciA9IG5ldyB1bml2ZXJzZS5WZWN0b3IoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW25dIG9mIGZvcmNlVmVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS52ZWxvY2l0eVtuXSArPSAoKCh0b3RhbEZvcmNlICogZGlmZmVyZW5jZXNbbl0gLyBkaXN0YW5jZSkgKiBHcmF2aXRhdGlvbi5HKSAqIGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtuXSBvZiBkaWZmZXJlbmNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVsb2NpdHkgPSAocGFydGljbGUubWFzcyAqIHBhcnRpY2xlLnZlbG9jaXR5W25dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBvdGhlclBhcnRpY2xlLm1hc3MgKiBvdGhlclBhcnRpY2xlLnZlbG9jaXR5W25dKSAvIChwYXJ0aWNsZS5tYXNzICsgb3RoZXJQYXJ0aWNsZS5tYXNzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnZlbG9jaXR5W25dID0gdmVsb2NpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlclBhcnRpY2xlLnZlbG9jaXR5W25dID0gdmVsb2NpdHk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtHcmF2aXRhdGlvbn07IiwiaW1wb3J0IHtEaW1lbnNpb259IGZyb20gXCIuL0RpbWVuc2lvblwiO1xyXG5cclxuY2xhc3MgVGltZSBleHRlbmRzIERpbWVuc2lvbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoJ3QnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICB0aGlzLm9sZFRpbWUgPSB0aGlzLnN0YXJ0VGltZTtcclxuICAgICAgICB0aGlzLl9lbGFwc2VkVGltZSA9IDA7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldCBlbGFwc2VkVGltZSgpIHtcclxuICAgICAgICB0aGlzLmRlbHRhO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGFwc2VkVGltZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGVsdGEoKSB7XHJcbiAgICAgICAgY29uc3QgbmV3VGltZSA9ICggdHlwZW9mIHBlcmZvcm1hbmNlID09PSAndW5kZWZpbmVkJyA/IERhdGUgOiBwZXJmb3JtYW5jZSApLm5vdygpLFxyXG4gICAgICAgICAgICBkaWZmID0gKCBuZXdUaW1lIC0gdGhpcy5vbGRUaW1lICkgLyAxMDAwO1xyXG5cclxuICAgICAgICB0aGlzLm9sZFRpbWUgPSBuZXdUaW1lO1xyXG4gICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lICs9IGRpZmY7XHJcblxyXG4gICAgICAgIHJldHVybiBkaWZmO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhXHJcbiAgICAgKiBAcGFyYW0ge1RoaW5nfSBwYXJlbnRUaGluZ1xyXG4gICAgICovXHJcbiAgICBoYXBwZW4oZGVsdGEsIHBhcmVudFRoaW5nKSB7XHJcbiAgICAgICAgLy9tYWtlcyBwYXJlbnQgdGhpbmcgaGFwcGVuIHJlcGVhdGVkbHksIHJlZHVjaW5nIGl0cyBkZWx0YVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBwYXJlbnRUaGluZy5oYXBwZW4oKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1RpbWV9OyIsImltcG9ydCB7TGF3fSBmcm9tIFwiLi9MYXdcIjtcclxuXHJcbmNsYXNzIE1vdGlvbiBleHRlbmRzIExhdyB7XHJcblxyXG4gICAgaGFwcGVuKGRlbHRhLCB1bml2ZXJzZSkge1xyXG5cclxuICAgICAgICBjb25zdCBwaHlzaWNhbERpbWVuc2lvbnMgPSB1bml2ZXJzZS5waHlzaWNhbERpbWVuc2lvbnM7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdW5pdmVyc2UudGhpbmdzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGluZyBpbnN0YW5jZW9mIHVuaXZlcnNlLkJvZHkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qge25hbWU6IGRpbWVuc2lvbk5hbWV9IG9mIHBoeXNpY2FsRGltZW5zaW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaW5nLnBvc2l0aW9uW2RpbWVuc2lvbk5hbWVdID0gdGhpbmcucG9zaXRpb25bZGltZW5zaW9uTmFtZV0gKyAodGhpbmcudmVsb2NpdHlbZGltZW5zaW9uTmFtZV0gKiBkZWx0YSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtNb3Rpb259OyIsImltcG9ydCB7VW5pdmVyc2V9IGZyb20gXCIuL1VuaXZlcnNlXCI7XHJcbmltcG9ydCB7UGh5c2ljYWxEaW1lbnNpb259IGZyb20gXCIuL2RpbWVuc2lvbnMvUGh5c2ljYWxEaW1lbnNpb25cIjtcclxuaW1wb3J0IHtUaW1lfSBmcm9tIFwiLi9kaW1lbnNpb25zL1RpbWVcIjtcclxuaW1wb3J0IHtHcmF2aXRhdGlvbn0gZnJvbSBcIi4vbGF3cy9HcmF2aXRhdGlvblwiO1xyXG5pbXBvcnQge01vdGlvbn0gZnJvbSBcIi4vbGF3cy9Nb3Rpb25cIjtcclxuXHJcbmZ1bmN0aW9uIGJpZ0JhbmcoKSB7XHJcbiAgICByZXR1cm4gbmV3IFVuaXZlcnNlKFxyXG4gICAgICAgIG5ldyBUaW1lKCksXHJcbiAgICAgICAgbmV3IFBoeXNpY2FsRGltZW5zaW9uKCd4JyksXHJcbiAgICAgICAgbmV3IFBoeXNpY2FsRGltZW5zaW9uKCd5JyksXHJcbiAgICAgICAgbmV3IFBoeXNpY2FsRGltZW5zaW9uKCd6JyksXHJcbiAgICAgICAgbmV3IE1vdGlvbigpLFxyXG4gICAgICAgIG5ldyBHcmF2aXRhdGlvbigpXHJcbiAgICApO1xyXG59XHJcblxyXG5leHBvcnQge2JpZ0Jhbmd9OyIsImNvbnN0IHJlbmRlcmVycyA9IFtdO1xyXG5cclxubGV0IHJlbmRlcmluZ1N0YXJ0ZWQgPSBmYWxzZTtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gICAgaWYgKCFyZW5kZXJpbmdTdGFydGVkKSB7XHJcbiAgICAgICAgcmVuZGVyaW5nU3RhcnRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGxldCBsYXN0VGltZSA9IDA7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIHJlbmRlcih0aW1lKSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlbmRlcmVyIG9mIHJlbmRlcmVycykge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyZXIucmVhZHkgJiYgcmVuZGVyZXIudXBkYXRlKHRpbWUgLSBsYXN0VGltZSwgdGltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGFzdFRpbWUgPSB0aW1lO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZW5kZXJlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIHJlbmRlcmVycy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIHN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtVbml2ZXJzZX0gdW5pdmVyc2VcclxuICAgICAqL1xyXG4gICAgcmVuZGVycyh1bml2ZXJzZSkge1xyXG4gICAgICAgIHRoaXMudW5pdmVyc2UgPSB1bml2ZXJzZTtcclxuICAgICAgICB0aGlzLnJlYWR5ID0gdGhpcy5zZXR1cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkZWx0YSwgdGltZSkge1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7UmVuZGVyZXJ9OyIsImltcG9ydCB7UmVuZGVyZXJ9IGZyb20gXCIuL1JlbmRlcmVyXCI7XHJcblxyXG5jbGFzcyBDU1NSZW5kZXJlciBleHRlbmRzIFJlbmRlcmVyIHtcclxuXHJcbiAgICBzZXR1cCgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIHRoaXMudW5pdmVyc2UuYm9kaWVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2JvZHknKTtcclxuICAgICAgICAgICAgdGhpbmcucmVuZGVyID0gZWw7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGVsdGEsIHRpbWUpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIHRoaXMudW5pdmVyc2UuYm9kaWVzKSB7XHJcbiAgICAgICAgICAgIHRoaW5nLnJlbmRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoJyArICh0aGluZy5wb3NpdGlvbi52YWx1ZXMubWFwKHYgPT4gKHYgLyA1MDAwMDApICsgJ3B4Jykuam9pbignLCcpKSArICcpJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge0NTU1JlbmRlcmVyfTsiLCJpbXBvcnQge1JlbmRlcmVyfSBmcm9tIFwiLi9SZW5kZXJlclwiO1xyXG5pbXBvcnQge1JlYWxpdHlFeGNlcHRpb259IGZyb20gXCIuLi9saWIvUmVhbGl0eUV4Y2VwdGlvblwiO1xyXG5cclxuY2xhc3MgVGhyZWVSZW5kZXJlciBleHRlbmRzIFJlbmRlcmVyIHtcclxuXHJcbiAgICBzZXR1cCgpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBUSFJFRSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlYWxpdHlFeGNlcHRpb24oJ3RocmVlLmpzIG5vdCBpbmNsdWRlZCcpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoVEhSRUUuUkVWSVNJT04gPCA4Nikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVhbGl0eUV4Y2VwdGlvbigndGhyZWUuanMgbW9zdCBiZSBuZXdlciB0aGFuIDg1Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgMTAwMDApO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSAxMDAwO1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdGhpcy51bml2ZXJzZS5ib2RpZXMpIHtcclxuICAgICAgICAgICAgdGhpbmcucmVuZGVyID0gbmV3IFRIUkVFLk1lc2goXHJcbiAgICAgICAgICAgICAgICBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMTAwKSxcclxuICAgICAgICAgICAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6IDB4ZmYwMDAwLCB3aXJlZnJhbWU6IHRydWV9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGluZy5yZW5kZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0dXAoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRlbHRhLCB0aW1lKSB7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdGhpcy51bml2ZXJzZS5ib2RpZXMpIHtcclxuICAgICAgICAgICAgdGhpbmcucmVuZGVyLnBvc2l0aW9uLnNldChcclxuICAgICAgICAgICAgICAgIHRoaW5nLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICB0aGluZy5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICAgICAgdGhpbmcucG9zaXRpb24uelxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtUaHJlZVJlbmRlcmVyfTsiLCJleHBvcnQge1JlYWxpdHlFeGNlcHRpb24gYXMgRXhjZXB0aW9ufSBmcm9tICcuL2xpYi9SZWFsaXR5RXhjZXB0aW9uJztcclxuZXhwb3J0IHtVbml2ZXJzZX0gZnJvbSAnLi9Vbml2ZXJzZSc7XHJcbmV4cG9ydCB7TGF3fSBmcm9tICcuL2xhd3MvTGF3JztcclxuZXhwb3J0IHtHcmF2aXRhdGlvbn0gZnJvbSAnLi9sYXdzL0dyYXZpdGF0aW9uJztcclxuZXhwb3J0IHtUaW1lfSBmcm9tICcuL2RpbWVuc2lvbnMvVGltZSc7XHJcbmV4cG9ydCB7UGh5c2ljYWxEaW1lbnNpb259IGZyb20gJy4vZGltZW5zaW9ucy9QaHlzaWNhbERpbWVuc2lvbic7XHJcbmV4cG9ydCB7VmVjdG9yfSBmcm9tICcuL2xpYi9WZWN0b3InO1xyXG5leHBvcnQgKiBmcm9tICcuL0hlbHBlcnMnO1xyXG5leHBvcnQge0NTU1JlbmRlcmVyfSBmcm9tICcuL3JlbmRlcnMvQ1NTUmVuZGVyZXInO1xyXG5leHBvcnQge1RocmVlUmVuZGVyZXJ9IGZyb20gJy4vcmVuZGVycy9UaHJlZUpTJztcclxuXHJcbi8vV2hhdCBpcyB0aGUgbmF0dXJlIG9mIHJlYWxpdHk/XHJcbmV4cG9ydCBjb25zdCBuYXR1cmUgPSB1bmRlZmluZWQ7Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztDQUFBLE1BQU0sZ0JBQWdCLFNBQVMsS0FBSyxDQUFDO0NBQ3JDLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRTtDQUN6QixRQUFRLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUN2QixRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJ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
