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

export { nature, RealityException as Exception, Universe, Law, Gravitation, Time, PhysicalDimension, Vector, CSSRenderer, ThreeRenderer, bigBang };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbGl0eS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9saWIvUmVhbGl0eUV4Y2VwdGlvbi5qcyIsIi4uL3NyYy9UaGluZy5qcyIsIi4uL3NyYy9BYnN0cmFjdGEuanMiLCIuLi9zcmMvZGltZW5zaW9ucy9EaW1lbnNpb24uanMiLCIuLi9zcmMvbGF3cy9MYXcuanMiLCIuLi9zcmMvZGltZW5zaW9ucy9QaHlzaWNhbERpbWVuc2lvbi5qcyIsIi4uL3NyYy9Db25jcmV0YS5qcyIsIi4uL3NyYy9saWIvVmVjdG9yLmpzIiwiLi4vc3JjL0JvZHkuanMiLCIuLi9zcmMvVW5pdmVyc2UuanMiLCIuLi9zcmMvbGF3cy9HcmF2aXRhdGlvbi5qcyIsIi4uL3NyYy9kaW1lbnNpb25zL1RpbWUuanMiLCIuLi9zcmMvbGF3cy9Nb3Rpb24uanMiLCIuLi9zcmMvSGVscGVycy5qcyIsIi4uL3NyYy9yZW5kZXJzL1JlbmRlcmVyLmpzIiwiLi4vc3JjL3JlbmRlcnMvQ1NTUmVuZGVyZXIuanMiLCIuLi9zcmMvcmVuZGVycy9UaHJlZUpTLmpzIiwiLi4vc3JjL1JlYWxpdHkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUmVhbGl0eUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcihtZXNzYWdlKSkuc3RhY2s7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1JlYWxpdHlFeGNlcHRpb259OyIsImNsYXNzIFRoaW5nIHtcclxuXHJcbiAgICBoYXBwZW4oZGVsdGEpIHtcclxuICAgICAgICByZXR1cm4gZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1RoaW5nfTtcclxuIiwiaW1wb3J0IHtUaGluZ30gZnJvbSBcIi4vVGhpbmdcIjtcclxuXHJcbmNsYXNzIEFic3RyYWN0YSBleHRlbmRzIFRoaW5nIHtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7QWJzdHJhY3RhfTsiLCJpbXBvcnQge0Fic3RyYWN0YX0gZnJvbSBcIi4uL0Fic3RyYWN0YVwiO1xyXG5cclxuY2xhc3MgRGltZW5zaW9uIGV4dGVuZHMgQWJzdHJhY3RhIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtEaW1lbnNpb259OyIsImltcG9ydCB7QWJzdHJhY3RhfSBmcm9tIFwiLi4vQWJzdHJhY3RhXCI7XHJcblxyXG5jbGFzcyBMYXcgZXh0ZW5kcyBBYnN0cmFjdGEge1xyXG5cclxufVxyXG5cclxuZXhwb3J0IHtMYXd9OyIsImltcG9ydCB7RGltZW5zaW9ufSBmcm9tIFwiLi9EaW1lbnNpb25cIjtcclxuXHJcbmNsYXNzIFBoeXNpY2FsRGltZW5zaW9uIGV4dGVuZHMgRGltZW5zaW9uIHtcclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHVuaXZlcnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtQaHlzaWNhbERpbWVuc2lvbn07IiwiaW1wb3J0IHtUaGluZ30gZnJvbSBcIi4vVGhpbmdcIjtcclxuXHJcbmNsYXNzIENvbmNyZXRhIGV4dGVuZHMgVGhpbmcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHR5cGUge1RoaW5nW119XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50aGluZ3MgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7VGhpbmd9IGFueVxyXG4gICAgICogQHJldHVybnMge1RoaW5nfVxyXG4gICAgICovXHJcbiAgICBhZGQoLi4uYW55KSB7XHJcbiAgICAgICAgdGhpcy50aGluZ3MucHVzaCguLi5hbnkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtUaGluZ30gYW55XHJcbiAgICAgKiBAcmV0dXJucyB7VGhpbmd9XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZSguLi5hbnkpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIGFueSkge1xyXG4gICAgICAgICAgICBjb25zdCB0aGluZ0luZGV4ID0gdGhpcy50aGluZ3MuaW5kZXhPZih0aGluZyk7XHJcbiAgICAgICAgICAgIGlmICh0aGluZ0luZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGhpbmdzLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHBhcmVudFRoaW5nKSB7XHJcbiAgICAgICAgZGVsdGEgPSBzdXBlci5oYXBwZW4oZGVsdGEsIHBhcmVudFRoaW5nKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIHRoaXMudGhpbmdzKSB7XHJcbiAgICAgICAgICAgIGRlbHRhID0gdGhpbmcuaGFwcGVuKGRlbHRhLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtDb25jcmV0YX07IiwiLyoqXHJcbiAqIG4tZGltZW5zaW9uYWwgdmVjdG9yXHJcbiAqL1xyXG5jbGFzcyBWZWN0b3Ige1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlcyA9IHt9KSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZXMpLFxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0ge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IE9iamVjdC52YWx1ZXModmFsdWVzKVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGtleXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZToga2V5c1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IFtpbmRleCwga2V5XSBvZiBrZXlzLmVudHJpZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2V0SXQgPSAoKSA9PiB0aGlzLnZhbHVlc1tpbmRleF0sXHJcbiAgICAgICAgICAgICAgICBzZXRJdCA9IHZhbCA9PiB0aGlzLnZhbHVlc1tpbmRleF0gPSB2YWw7XHJcblxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzW2tleV0gPSB7ZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiBmYWxzZSwgZ2V0OiBnZXRJdCwgc2V0OiBzZXRJdH07XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXNbaW5kZXhdID0ge2VudW1lcmFibGU6IGZhbHNlLCBjb25maWd1cmFibGU6IGZhbHNlLCBnZXQ6IGdldEl0LCBzZXQ6IHNldEl0fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAqIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgIHlpZWxkKiB0aGlzLnZhbHVlcy5lbnRyaWVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVkdWNlKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLmxlbmd0aCA/IHRoaXMudmFsdWVzLnJlZHVjZShjYWxsYmFjaykgOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzdW0oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVkdWNlKChjLCB2KSA9PiBjICsgdik7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKHZlY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdGhpc1tuXSA9IHZlY1tuXSArIHZlY3RvcltuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBhZGRTY2FsYXIoc2NhbGFyKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gKyBzY2FsYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgc3ViKHZlY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dIC0gdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YlNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAtIHNjYWxhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBtdWx0aXBseSh2ZWN0b3IpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAqIHZlY3RvcltuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBtdWx0aXBseVNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAqIHNjYWxhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBkaXZpZGUodmVjdG9yKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gLyB2ZWN0b3Jbbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgZGl2aWRlU2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dIC8gc2NhbGFyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIGRvdCh2ZWN0b3IpIHtcclxuICAgICAgICBsZXQgdG90YWwgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB0aGlzLmtleXMpIHtcclxuICAgICAgICAgICAgdG90YWwgKz0gdGhpc1tuXSAqIHZlY3RvcltuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvdGFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsZW5ndGhTcSgpIHtcclxuICAgICAgICAvL3JldHVybiB0aGlzLmNsb25lKCkucG93KDIpLnN1bSgpO1xyXG4gICAgICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHRoaXMudmFsdWVzKSB7XHJcbiAgICAgICAgICAgIHRvdGFsICs9IG4gKiBuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG90YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMubGVuZ3RoU3EpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsZW5ndGgobGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplZC5tdWx0aXBseVNjYWxhcihsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBub3JtYWxpemVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZVNjYWxhcih0aGlzLmxlbmd0aCB8fCAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHtWZWN0b3J9XHJcbiAgICAgKi9cclxuICAgIGNsb25lKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb3B5KHZlY3Rvcikge1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWN0b3Iua2V5cykge1xyXG4gICAgICAgICAgICB0aGlzW25dID0gdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjdG9yfVxyXG4gICAgICovXHJcbiAgICBtYXAoY2FsbGJhY2spIHtcclxuICAgICAgICBjb25zdCB2ZWN0b3IgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWN0b3Iua2V5cykge1xyXG4gICAgICAgICAgICB2ZWN0b3Jbbl0gPSBjYWxsYmFjayh2ZWN0b3Jbbl0sIG4sIGkpO1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcG93KHApIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAqKiBwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3RhbmNlVG9TcXVhcmVkKHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1Yih2ZWN0b3IpLnBvdygyKS5zdW07XHJcbiAgICB9XHJcblxyXG4gICAgZGlzdGFuY2VUbyh2ZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZGlzdGFuY2VUb1NxdWFyZWQodmVjdG9yKSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1ZlY3Rvcn07IiwiaW1wb3J0IHtDb25jcmV0YX0gZnJvbSBcIi4vQ29uY3JldGFcIjtcclxuXHJcbmNsYXNzIEJvZHkgZXh0ZW5kcyBDb25jcmV0YSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7bWFzcyA9IDB9KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1hc3MgPSBtYXNzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0JvZHl9OyIsImltcG9ydCB7RGltZW5zaW9ufSBmcm9tIFwiLi9kaW1lbnNpb25zL0RpbWVuc2lvblwiO1xyXG5pbXBvcnQge0xhd30gZnJvbSBcIi4vbGF3cy9MYXdcIjtcclxuaW1wb3J0IHtQaHlzaWNhbERpbWVuc2lvbn0gZnJvbSBcIi4vZGltZW5zaW9ucy9QaHlzaWNhbERpbWVuc2lvblwiO1xyXG5pbXBvcnQge1RoaW5nfSBmcm9tIFwiLi9UaGluZ1wiO1xyXG5pbXBvcnQge0NvbmNyZXRhfSBmcm9tIFwiLi9Db25jcmV0YVwiO1xyXG5pbXBvcnQge1ZlY3Rvcn0gZnJvbSBcIi4vbGliL1ZlY3RvclwiO1xyXG5pbXBvcnQge0JvZHl9IGZyb20gXCIuL0JvZHlcIjtcclxuXHJcbmNsYXNzIFVuaXZlcnNlIGV4dGVuZHMgQ29uY3JldGEge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKC4uLmFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5sYXdzID0gW107XHJcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gW107XHJcbiAgICAgICAgdGhpcy5ib2RpZXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5WZWN0b3IgPSBjbGFzcyBleHRlbmRzIFZlY3RvciB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcyA9IHt9KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB7bmFtZTogZGltZW5zaW9uTmFtZX0gb2YgdW5pdmVyc2UucGh5c2ljYWxEaW1lbnNpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXMuaGFzT3duUHJvcGVydHkoZGltZW5zaW9uTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2RpbWVuc2lvbk5hbWVdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc3VwZXIodmFsdWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuQm9keSA9IGNsYXNzIGV4dGVuZHMgQm9keSB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGRlZmluaXRpb24gPSB7fSkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoZGVmaW5pdGlvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gZGVmaW5pdGlvbi5wb3NpdGlvbiBpbnN0YW5jZW9mIHVuaXZlcnNlLlZlY3RvciA/XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5pdGlvbi5wb3NpdGlvbiA6IG5ldyB1bml2ZXJzZS5WZWN0b3IoZGVmaW5pdGlvbi5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0gZGVmaW5pdGlvbi52ZWxvY2l0eSBpbnN0YW5jZW9mIHVuaXZlcnNlLlZlY3RvciA/XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5pdGlvbi52ZWxvY2l0eSA6IG5ldyB1bml2ZXJzZS5WZWN0b3IoZGVmaW5pdGlvbi52ZWxvY2l0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZCguLi5hbnkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGh5c2ljYWxEaW1lbnNpb25zKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGRpbWVuc2lvbiA9PiBkaW1lbnNpb24gaW5zdGFuY2VvZiBQaHlzaWNhbERpbWVuc2lvbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5vblBoeXNpY2FsRGltZW5zaW9ucygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaW1lbnNpb25zLmZpbHRlcihkaW1lbnNpb24gPT4gIShkaW1lbnNpb24gaW5zdGFuY2VvZiBQaHlzaWNhbERpbWVuc2lvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtUaGluZ30gYW55XHJcbiAgICAgKiBAcmV0dXJucyB7VW5pdmVyc2V9XHJcbiAgICAgKi9cclxuICAgIGFkZCguLi5hbnkpIHtcclxuICAgICAgICBzdXBlci5hZGQoLi4uYW55KTtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpbmcgaW5zdGFuY2VvZiBEaW1lbnNpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGltZW5zaW9ucy5wdXNoKHRoaW5nKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGluZyBpbnN0YW5jZW9mIExhdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXdzLnB1c2godGhpbmcpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaW5nIGluc3RhbmNlb2YgdGhpcy5Cb2R5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvZGllcy5wdXNoKHRoaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7VGhpbmd9IGFueVxyXG4gICAgICogQHJldHVybnMge1VuaXZlcnNlfVxyXG4gICAgICovXHJcbiAgICByZW1vdmUoLi4uYW55KSB7XHJcbiAgICAgICAgc3VwZXIucmVtb3ZlKC4uLmFueSk7XHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaW5nIGluc3RhbmNlb2YgRGltZW5zaW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aGluZ0luZGV4ID0gdGhpcy5kaW1lbnNpb25zLmluZGV4T2YodGhpbmcpO1xyXG4gICAgICAgICAgICAgICAgdGhpbmdJbmRleCA+PSAwICYmIHRoaXMuZGltZW5zaW9ucy5zcGxpY2UodGhpbmdJbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpbmcgaW5zdGFuY2VvZiBMYXcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRoaW5nSW5kZXggPSB0aGlzLmxhd3MuaW5kZXhPZih0aGluZyk7XHJcbiAgICAgICAgICAgICAgICB0aGluZ0luZGV4ID49IDAgJiYgdGhpcy5sYXdzLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGluZyBpbnN0YW5jZW9mIHRoaXMuQm9keSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGhpbmdJbmRleCA9IHRoaXMuYm9kaWVzLmluZGV4T2YodGhpbmcpO1xyXG4gICAgICAgICAgICAgICAgdGhpbmdJbmRleCA+PSAwICYmIHRoaXMuYm9kaWVzLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VW5pdmVyc2V9OyIsImltcG9ydCB7TGF3fSBmcm9tIFwiLi9MYXdcIjtcclxuaW1wb3J0IHtCb2R5fSBmcm9tIFwiLi4vQm9keVwiO1xyXG5cclxuY2xhc3MgR3Jhdml0YXRpb24gZXh0ZW5kcyBMYXcge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IEcoKSB7XHJcbiAgICAgICAgcmV0dXJuIDYuNjczODRlLTExO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHVuaXZlcnNlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHBoeXNpY2FsRGltZW5zaW9ucyA9IHVuaXZlcnNlLnBoeXNpY2FsRGltZW5zaW9ucztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBwYXJ0aWNsZSBvZiB1bml2ZXJzZS5ib2RpZXMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGFydGljbGUubWFzcykge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJ0aWNsZSBpbnN0YW5jZW9mIEJvZHkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgb3RoZXJQYXJ0aWNsZSBvZiB1bml2ZXJzZS5ib2RpZXMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdGhlclBhcnRpY2xlLm1hc3MgfHwgcGFydGljbGUgPT09IG90aGVyUGFydGljbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaWZmZXJlbmNlcyA9IG90aGVyUGFydGljbGUucG9zaXRpb24uc3ViKHBhcnRpY2xlLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZVNxdWFyZWQgPSBvdGhlclBhcnRpY2xlLnBvc2l0aW9uLmRpc3RhbmNlVG9TcXVhcmVkKHBhcnRpY2xlLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IG90aGVyUGFydGljbGUucG9zaXRpb24uZGlzdGFuY2VUbyhwYXJ0aWNsZS5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDEwICsgMTApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFsRm9yY2UgPSAob3RoZXJQYXJ0aWNsZS5tYXNzIC8gZGlzdGFuY2VTcXVhcmVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9yY2VWZWN0b3IgPSBuZXcgdW5pdmVyc2UuVmVjdG9yKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtuXSBvZiBmb3JjZVZlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHlbbl0gKz0gKCgodG90YWxGb3JjZSAqIGRpZmZlcmVuY2VzW25dIC8gZGlzdGFuY2UpICogR3Jhdml0YXRpb24uRykpOyAvL3Nob3VsZCBhcHBseSBkZWx0YT8gICogZGVsdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtuXSBvZiBkaWZmZXJlbmNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVsb2NpdHkgPSAocGFydGljbGUubWFzcyAqIHBhcnRpY2xlLnZlbG9jaXR5W25dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBvdGhlclBhcnRpY2xlLm1hc3MgKiBvdGhlclBhcnRpY2xlLnZlbG9jaXR5W25dKSAvIChwYXJ0aWNsZS5tYXNzICsgb3RoZXJQYXJ0aWNsZS5tYXNzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnZlbG9jaXR5W25dID0gdmVsb2NpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlclBhcnRpY2xlLnZlbG9jaXR5W25dID0gdmVsb2NpdHk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtHcmF2aXRhdGlvbn07IiwiaW1wb3J0IHtEaW1lbnNpb259IGZyb20gXCIuL0RpbWVuc2lvblwiO1xyXG5cclxuY2xhc3MgVGltZSBleHRlbmRzIERpbWVuc2lvbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoJ3QnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICB0aGlzLm9sZFRpbWUgPSB0aGlzLnN0YXJ0VGltZTtcclxuICAgICAgICB0aGlzLl9lbGFwc2VkVGltZSA9IDA7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldCBlbGFwc2VkVGltZSgpIHtcclxuICAgICAgICB0aGlzLmRlbHRhO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbGFwc2VkVGltZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGVsdGEoKSB7XHJcbiAgICAgICAgY29uc3QgbmV3VGltZSA9ICggdHlwZW9mIHBlcmZvcm1hbmNlID09PSAndW5kZWZpbmVkJyA/IERhdGUgOiBwZXJmb3JtYW5jZSApLm5vdygpLFxyXG4gICAgICAgICAgICBkaWZmID0gKCBuZXdUaW1lIC0gdGhpcy5vbGRUaW1lICkgLyAxMDAwO1xyXG5cclxuICAgICAgICB0aGlzLm9sZFRpbWUgPSBuZXdUaW1lO1xyXG4gICAgICAgIHRoaXMuX2VsYXBzZWRUaW1lICs9IGRpZmY7XHJcblxyXG4gICAgICAgIHJldHVybiBkaWZmO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhXHJcbiAgICAgKiBAcGFyYW0ge1RoaW5nfSBwYXJlbnRUaGluZ1xyXG4gICAgICovXHJcbiAgICBoYXBwZW4oZGVsdGEsIHBhcmVudFRoaW5nKSB7XHJcbiAgICAgICAgLy9tYWtlcyBwYXJlbnQgdGhpbmcgaGFwcGVuIHJlcGVhdGVkbHksIHJlZHVjaW5nIGl0cyBkZWx0YVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBwYXJlbnRUaGluZy5oYXBwZW4oKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1RpbWV9OyIsImltcG9ydCB7TGF3fSBmcm9tIFwiLi9MYXdcIjtcclxuXHJcbmNsYXNzIE1vdGlvbiBleHRlbmRzIExhdyB7XHJcblxyXG4gICAgaGFwcGVuKGRlbHRhLCB1bml2ZXJzZSkge1xyXG5cclxuICAgICAgICBjb25zdCBwaHlzaWNhbERpbWVuc2lvbnMgPSB1bml2ZXJzZS5waHlzaWNhbERpbWVuc2lvbnM7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdW5pdmVyc2UudGhpbmdzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGluZyBpbnN0YW5jZW9mIHVuaXZlcnNlLkJvZHkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qge25hbWU6IGRpbWVuc2lvbk5hbWV9IG9mIHBoeXNpY2FsRGltZW5zaW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaW5nLnBvc2l0aW9uW2RpbWVuc2lvbk5hbWVdID0gdGhpbmcucG9zaXRpb25bZGltZW5zaW9uTmFtZV0gKyAodGhpbmcudmVsb2NpdHlbZGltZW5zaW9uTmFtZV0gKiBkZWx0YSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtNb3Rpb259OyIsImltcG9ydCB7VW5pdmVyc2V9IGZyb20gXCIuL1VuaXZlcnNlXCI7XHJcbmltcG9ydCB7UGh5c2ljYWxEaW1lbnNpb259IGZyb20gXCIuL2RpbWVuc2lvbnMvUGh5c2ljYWxEaW1lbnNpb25cIjtcclxuaW1wb3J0IHtUaW1lfSBmcm9tIFwiLi9kaW1lbnNpb25zL1RpbWVcIjtcclxuaW1wb3J0IHtHcmF2aXRhdGlvbn0gZnJvbSBcIi4vbGF3cy9HcmF2aXRhdGlvblwiO1xyXG5pbXBvcnQge01vdGlvbn0gZnJvbSBcIi4vbGF3cy9Nb3Rpb25cIjtcclxuXHJcbmZ1bmN0aW9uIGJpZ0JhbmcoKSB7XHJcbiAgICByZXR1cm4gbmV3IFVuaXZlcnNlKFxyXG4gICAgICAgIG5ldyBUaW1lKCksXHJcbiAgICAgICAgbmV3IFBoeXNpY2FsRGltZW5zaW9uKCd4JyksXHJcbiAgICAgICAgbmV3IFBoeXNpY2FsRGltZW5zaW9uKCd5JyksXHJcbiAgICAgICAgbmV3IFBoeXNpY2FsRGltZW5zaW9uKCd6JyksXHJcbiAgICAgICAgbmV3IE1vdGlvbigpLFxyXG4gICAgICAgIG5ldyBHcmF2aXRhdGlvbigpXHJcbiAgICApO1xyXG59XHJcblxyXG5leHBvcnQge2JpZ0Jhbmd9OyIsImNvbnN0IHJlbmRlcmVycyA9IFtdO1xyXG5cclxubGV0IHJlbmRlcmluZ1N0YXJ0ZWQgPSBmYWxzZTtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gICAgaWYgKCFyZW5kZXJpbmdTdGFydGVkKSB7XHJcbiAgICAgICAgcmVuZGVyaW5nU3RhcnRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGxldCBsYXN0VGltZSA9IDA7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIHJlbmRlcih0aW1lKSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlbmRlcmVyIG9mIHJlbmRlcmVycykge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyZXIucmVhZHkgJiYgcmVuZGVyZXIudXBkYXRlKHRpbWUgLSBsYXN0VGltZSwgdGltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGFzdFRpbWUgPSB0aW1lO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZW5kZXJlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIHJlbmRlcmVycy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIHN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtVbml2ZXJzZX0gdW5pdmVyc2VcclxuICAgICAqL1xyXG4gICAgcmVuZGVycyh1bml2ZXJzZSkge1xyXG4gICAgICAgIHRoaXMudW5pdmVyc2UgPSB1bml2ZXJzZTtcclxuICAgICAgICB0aGlzLnJlYWR5ID0gdGhpcy5zZXR1cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkZWx0YSwgdGltZSkge1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7UmVuZGVyZXJ9OyIsImltcG9ydCB7UmVuZGVyZXJ9IGZyb20gXCIuL1JlbmRlcmVyXCI7XHJcblxyXG5jbGFzcyBDU1NSZW5kZXJlciBleHRlbmRzIFJlbmRlcmVyIHtcclxuXHJcbiAgICBzZXR1cCgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIHRoaXMudW5pdmVyc2UuYm9kaWVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2JvZHknKTtcclxuICAgICAgICAgICAgdGhpbmcucmVuZGVyID0gZWw7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGVsdGEsIHRpbWUpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIHRoaXMudW5pdmVyc2UuYm9kaWVzKSB7XHJcbiAgICAgICAgICAgIHRoaW5nLnJlbmRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoJyArICh0aGluZy5wb3NpdGlvbi52YWx1ZXMubWFwKHYgPT4gKHYgLyA1MDAwMDApICsgJ3B4Jykuam9pbignLCcpKSArICcpJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge0NTU1JlbmRlcmVyfTsiLCJpbXBvcnQge1JlbmRlcmVyfSBmcm9tIFwiLi9SZW5kZXJlclwiO1xyXG5pbXBvcnQge1JlYWxpdHlFeGNlcHRpb259IGZyb20gXCIuLi9saWIvUmVhbGl0eUV4Y2VwdGlvblwiO1xyXG5cclxuY2xhc3MgVGhyZWVSZW5kZXJlciBleHRlbmRzIFJlbmRlcmVyIHtcclxuXHJcbiAgICBzZXR1cCgpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBUSFJFRSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlYWxpdHlFeGNlcHRpb24oJ3RocmVlLmpzIG5vdCBpbmNsdWRlZCcpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoVEhSRUUuUkVWSVNJT04gPCA4Nikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVhbGl0eUV4Y2VwdGlvbigndGhyZWUuanMgbW9zdCBiZSBuZXdlciB0aGFuIDg1Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgMTAwMDApO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSAxMDAwO1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdGhpcy51bml2ZXJzZS5ib2RpZXMpIHtcclxuICAgICAgICAgICAgdGhpbmcucmVuZGVyID0gbmV3IFRIUkVFLk1lc2goXHJcbiAgICAgICAgICAgICAgICBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMTAwKSxcclxuICAgICAgICAgICAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6IDB4ZmYwMDAwLCB3aXJlZnJhbWU6IHRydWV9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGluZy5yZW5kZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuc2V0dXAoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRlbHRhLCB0aW1lKSB7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdGhpbmcgb2YgdGhpcy51bml2ZXJzZS5ib2RpZXMpIHtcclxuICAgICAgICAgICAgdGhpbmcucmVuZGVyLnBvc2l0aW9uLnNldChcclxuICAgICAgICAgICAgICAgIHRoaW5nLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICB0aGluZy5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICAgICAgdGhpbmcucG9zaXRpb24uelxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtUaHJlZVJlbmRlcmVyfTsiLCJleHBvcnQge1JlYWxpdHlFeGNlcHRpb24gYXMgRXhjZXB0aW9ufSBmcm9tICcuL2xpYi9SZWFsaXR5RXhjZXB0aW9uJztcclxuZXhwb3J0IHtVbml2ZXJzZX0gZnJvbSAnLi9Vbml2ZXJzZSc7XHJcbmV4cG9ydCB7TGF3fSBmcm9tICcuL2xhd3MvTGF3JztcclxuZXhwb3J0IHtHcmF2aXRhdGlvbn0gZnJvbSAnLi9sYXdzL0dyYXZpdGF0aW9uJztcclxuZXhwb3J0IHtUaW1lfSBmcm9tICcuL2RpbWVuc2lvbnMvVGltZSc7XHJcbmV4cG9ydCB7UGh5c2ljYWxEaW1lbnNpb259IGZyb20gJy4vZGltZW5zaW9ucy9QaHlzaWNhbERpbWVuc2lvbic7XHJcbmV4cG9ydCB7VmVjdG9yfSBmcm9tICcuL2xpYi9WZWN0b3InO1xyXG5leHBvcnQgKiBmcm9tICcuL0hlbHBlcnMnO1xyXG5leHBvcnQge0NTU1JlbmRlcmVyfSBmcm9tICcuL3JlbmRlcnMvQ1NTUmVuZGVyZXInO1xyXG5leHBvcnQge1RocmVlUmVuZGVyZXJ9IGZyb20gJy4vcmVuZGVycy9UaHJlZUpTJztcclxuXHJcbi8vV2hhdCBpcyB0aGUgbmF0dXJlIG9mIHJlYWxpdHk/XHJcbmV4cG9ydCBjb25zdCBuYXR1cmUgPSB1bmRlZmluZWQ7Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sZ0JBQWdCLFNBQVMsS0FBSyxDQUFDO0lBQ2pDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7UUFDakIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FB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
