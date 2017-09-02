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

export { nature, RealityException as Exception, Universe, Law, Gravitation, Time, PhysicalDimension, Vector, CSSRenderer, ThreeRenderer, bigBang };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbGl0eS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9saWIvUmVhbGl0eUV4Y2VwdGlvbi5qcyIsIi4uL3NyYy9UaGluZy5qcyIsIi4uL3NyYy9BYnN0cmFjdGEuanMiLCIuLi9zcmMvZGltZW5zaW9ucy9EaW1lbnNpb24uanMiLCIuLi9zcmMvbGF3cy9MYXcuanMiLCIuLi9zcmMvQ29uY3JldGEuanMiLCIuLi9zcmMvQm9keS5qcyIsIi4uL3NyYy9saWIvVmVjdG9yLmpzIiwiLi4vc3JjL2RpbWVuc2lvbnMvUGh5c2ljYWxEaW1lbnNpb24uanMiLCIuLi9zcmMvVW5pdmVyc2UuanMiLCIuLi9zcmMvbGF3cy9HcmF2aXRhdGlvbi5qcyIsIi4uL3NyYy9kaW1lbnNpb25zL1RpbWUuanMiLCIuLi9zcmMvbGF3cy9Nb3Rpb24uanMiLCIuLi9zcmMvSGVscGVycy5qcyIsIi4uL3NyYy9yZW5kZXJzL1JlbmRlcmVyLmpzIiwiLi4vc3JjL3JlbmRlcnMvQ1NTUmVuZGVyZXIuanMiLCIuLi9zcmMvcmVuZGVycy9UaHJlZUpTLmpzIiwiLi4vc3JjL1JlYWxpdHkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUmVhbGl0eUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcihtZXNzYWdlKSkuc3RhY2s7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge1JlYWxpdHlFeGNlcHRpb259OyIsImNsYXNzIFRoaW5nIHtcclxuXHJcbiAgICBoYXBwZW4oZGVsdGEpIHtcclxuICAgICAgICByZXR1cm4gZGVsdGE7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1RoaW5nfTtcclxuIiwiaW1wb3J0IHtUaGluZ30gZnJvbSBcIi4vVGhpbmdcIjtcclxuXHJcbmNsYXNzIEFic3RyYWN0YSBleHRlbmRzIFRoaW5nIHtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7QWJzdHJhY3RhfTsiLCJpbXBvcnQge0Fic3RyYWN0YX0gZnJvbSBcIi4uL0Fic3RyYWN0YVwiO1xyXG5cclxuY2xhc3MgRGltZW5zaW9uIGV4dGVuZHMgQWJzdHJhY3RhIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtEaW1lbnNpb259OyIsImltcG9ydCB7QWJzdHJhY3RhfSBmcm9tIFwiLi4vQWJzdHJhY3RhXCI7XHJcblxyXG5jbGFzcyBMYXcgZXh0ZW5kcyBBYnN0cmFjdGEge1xyXG5cclxufVxyXG5cclxuZXhwb3J0IHtMYXd9OyIsImltcG9ydCB7VGhpbmd9IGZyb20gXCIuL1RoaW5nXCI7XHJcblxyXG5jbGFzcyBDb25jcmV0YSBleHRlbmRzIFRoaW5nIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEB0eXBlIHtUaGluZ1tdfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGhpbmdzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge1RoaW5nfSBhbnlcclxuICAgICAqIEByZXR1cm5zIHtUaGluZ31cclxuICAgICAqL1xyXG4gICAgYWRkKC4uLmFueSkge1xyXG4gICAgICAgIHRoaXMudGhpbmdzLnB1c2goLi4uYW55KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7VGhpbmd9IGFueVxyXG4gICAgICogQHJldHVybnMge1RoaW5nfVxyXG4gICAgICovXHJcbiAgICByZW1vdmUoLi4uYW55KSB7XHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiBhbnkpIHtcclxuICAgICAgICAgICAgY29uc3QgdGhpbmdJbmRleCA9IHRoaXMudGhpbmdzLmluZGV4T2YodGhpbmcpO1xyXG4gICAgICAgICAgICBpZiAodGhpbmdJbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRoaW5ncy5zcGxpY2UodGhpbmdJbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaGFwcGVuKGRlbHRhLCBwYXJlbnRUaGluZykge1xyXG4gICAgICAgIGRlbHRhID0gc3VwZXIuaGFwcGVuKGRlbHRhLCBwYXJlbnRUaGluZyk7XHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiB0aGlzLnRoaW5ncykge1xyXG4gICAgICAgICAgICBkZWx0YSA9IHRoaW5nLmhhcHBlbihkZWx0YSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZWx0YTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7Q29uY3JldGF9OyIsImltcG9ydCB7Q29uY3JldGF9IGZyb20gXCIuL0NvbmNyZXRhXCI7XHJcblxyXG5jbGFzcyBCb2R5IGV4dGVuZHMgQ29uY3JldGEge1xyXG4gICAgY29uc3RydWN0b3Ioe21hc3MgPSAwfSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5tYXNzID0gbWFzcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtCb2R5fTsiLCIvKipcclxuICogbi1kaW1lbnNpb25hbCB2ZWN0b3JcclxuICovXHJcbmNsYXNzIFZlY3RvciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFsdWVzID0ge30pIHtcclxuXHJcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlcyksXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogT2JqZWN0LnZhbHVlcyh2YWx1ZXMpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAga2V5czoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBrZXlzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgW2luZGV4LCBrZXldIG9mIGtleXMuZW50cmllcygpKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBnZXRJdCA9ICgpID0+IHRoaXMudmFsdWVzW2luZGV4XSxcclxuICAgICAgICAgICAgICAgIHNldEl0ID0gdmFsID0+IHRoaXMudmFsdWVzW2luZGV4XSA9IHZhbDtcclxuXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXNba2V5XSA9IHtlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IGZhbHNlLCBnZXQ6IGdldEl0LCBzZXQ6IHNldEl0fTtcclxuICAgICAgICAgICAgcHJvcGVydGllc1tpbmRleF0gPSB7ZW51bWVyYWJsZTogZmFsc2UsIGNvbmZpZ3VyYWJsZTogZmFsc2UsIGdldDogZ2V0SXQsIHNldDogc2V0SXR9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywgcHJvcGVydGllcyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgICogW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgeWllbGQqIHRoaXMudmFsdWVzLmVudHJpZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWR1Y2UoY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMubGVuZ3RoID8gdGhpcy52YWx1ZXMucmVkdWNlKGNhbGxiYWNrKSA6IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN1bSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWR1Y2UoKGMsIHYpID0+IGMgKyB2KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQodmVjdG9yKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB0aGlzW25dID0gdmVjW25dICsgdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFNjYWxhcihzY2FsYXIpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSArIHNjYWxhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBzdWIodmVjdG9yKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gLSB2ZWN0b3Jbbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgc3ViU2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dIC0gc2NhbGFyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIG11bHRpcGx5KHZlY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dICogdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIG11bHRpcGx5U2NhbGFyKHNjYWxhcikge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dICogc2NhbGFyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmVjO1xyXG4gICAgfVxyXG5cclxuICAgIGRpdmlkZSh2ZWN0b3IpIHtcclxuICAgICAgICBjb25zdCB2ZWMgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlYy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY1tuXSA9IHZlY1tuXSAvIHZlY3RvcltuXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYztcclxuICAgIH1cclxuXHJcbiAgICBkaXZpZGVTY2FsYXIoc2NhbGFyKSB7XHJcbiAgICAgICAgY29uc3QgdmVjID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbiBvZiB2ZWMua2V5cykge1xyXG4gICAgICAgICAgICB2ZWNbbl0gPSB2ZWNbbl0gLyBzY2FsYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgZG90KHZlY3Rvcikge1xyXG4gICAgICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHRoaXMua2V5cykge1xyXG4gICAgICAgICAgICB0b3RhbCArPSB0aGlzW25dICogdmVjdG9yW25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG90YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbmd0aFNxKCkge1xyXG4gICAgICAgIC8vcmV0dXJuIHRoaXMuY2xvbmUoKS5wb3coMikuc3VtKCk7XHJcbiAgICAgICAgbGV0IHRvdGFsID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdGhpcy52YWx1ZXMpIHtcclxuICAgICAgICAgICAgdG90YWwgKz0gbiAqIG47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b3RhbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5sZW5ndGhTcSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGxlbmd0aChsZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemVkLm11bHRpcGx5U2NhbGFyKGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5vcm1hbGl6ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlU2NhbGFyKHRoaXMubGVuZ3RoIHx8IDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge1ZlY3Rvcn1cclxuICAgICAqL1xyXG4gICAgY2xvbmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvcHkodmVjdG9yKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlY3Rvci5rZXlzKSB7XHJcbiAgICAgICAgICAgIHRoaXNbbl0gPSB2ZWN0b3Jbbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcclxuICAgICAqIEByZXR1cm5zIHtWZWN0b3J9XHJcbiAgICAgKi9cclxuICAgIG1hcChjYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnN0IHZlY3RvciA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIHZlY3Rvci5rZXlzKSB7XHJcbiAgICAgICAgICAgIHZlY3RvcltuXSA9IGNhbGxiYWNrKHZlY3RvcltuXSwgbiwgaSk7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBwb3cocCkge1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG4gb2YgdmVjLmtleXMpIHtcclxuICAgICAgICAgICAgdmVjW25dID0gdmVjW25dICoqIHA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzdGFuY2VUb1NxdWFyZWQodmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKHZlY3RvcikucG93KDIpLnN1bTtcclxuICAgIH1cclxuXHJcbiAgICBkaXN0YW5jZVRvKHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kaXN0YW5jZVRvU3F1YXJlZCh2ZWN0b3IpKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VmVjdG9yfTsiLCJpbXBvcnQge0RpbWVuc2lvbn0gZnJvbSBcIi4vRGltZW5zaW9uXCI7XHJcblxyXG5jbGFzcyBQaHlzaWNhbERpbWVuc2lvbiBleHRlbmRzIERpbWVuc2lvbiB7XHJcblxyXG4gICAgaGFwcGVuKGRlbHRhLCB1bml2ZXJzZSkge1xyXG4gICAgICAgIHJldHVybiBkZWx0YTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7UGh5c2ljYWxEaW1lbnNpb259OyIsImltcG9ydCB7RGltZW5zaW9ufSBmcm9tIFwiLi9kaW1lbnNpb25zL0RpbWVuc2lvblwiO1xyXG5pbXBvcnQge0xhd30gZnJvbSBcIi4vbGF3cy9MYXdcIjtcclxuaW1wb3J0IHtCb2R5fSBmcm9tIFwiLi9Cb2R5XCI7XHJcbmltcG9ydCB7VmVjdG9yfSBmcm9tIFwiLi9saWIvVmVjdG9yXCI7XHJcbmltcG9ydCB7UGh5c2ljYWxEaW1lbnNpb259IGZyb20gXCIuL2RpbWVuc2lvbnMvUGh5c2ljYWxEaW1lbnNpb25cIjtcclxuaW1wb3J0IHtUaGluZ30gZnJvbSBcIi4vVGhpbmdcIjtcclxuaW1wb3J0IHtDb25jcmV0YX0gZnJvbSBcIi4vQ29uY3JldGFcIjtcclxuXHJcbmNsYXNzIFVuaXZlcnNlIGV4dGVuZHMgQ29uY3JldGEge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKC4uLmFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5sYXdzID0gW107XHJcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gW107XHJcbiAgICAgICAgdGhpcy5ib2RpZXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5WZWN0b3IgPSBjbGFzcyBleHRlbmRzIFZlY3RvciB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlcyA9IHt9KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB7bmFtZTogZGltZW5zaW9uTmFtZX0gb2YgdW5pdmVyc2UucGh5c2ljYWxEaW1lbnNpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXMuaGFzT3duUHJvcGVydHkoZGltZW5zaW9uTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2RpbWVuc2lvbk5hbWVdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc3VwZXIodmFsdWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuQm9keSA9IGNsYXNzIGV4dGVuZHMgQm9keSB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGRlZmluaXRpb24gPSB7fSkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoZGVmaW5pdGlvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gZGVmaW5pdGlvbi5wb3NpdGlvbiBpbnN0YW5jZW9mIHVuaXZlcnNlLlZlY3RvciA/XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5pdGlvbi5wb3NpdGlvbiA6IG5ldyB1bml2ZXJzZS5WZWN0b3IoZGVmaW5pdGlvbi5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0gZGVmaW5pdGlvbi52ZWxvY2l0eSBpbnN0YW5jZW9mIHVuaXZlcnNlLlZlY3RvciA/XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5pdGlvbi52ZWxvY2l0eSA6IG5ldyB1bml2ZXJzZS5WZWN0b3IoZGVmaW5pdGlvbi52ZWxvY2l0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZCguLi5hbnkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGh5c2ljYWxEaW1lbnNpb25zKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpbWVuc2lvbnMuZmlsdGVyKGRpbWVuc2lvbiA9PiBkaW1lbnNpb24gaW5zdGFuY2VvZiBQaHlzaWNhbERpbWVuc2lvbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5vblBoeXNpY2FsRGltZW5zaW9ucygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaW1lbnNpb25zLmZpbHRlcihkaW1lbnNpb24gPT4gIShkaW1lbnNpb24gaW5zdGFuY2VvZiBQaHlzaWNhbERpbWVuc2lvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtUaGluZ30gYW55XHJcbiAgICAgKiBAcmV0dXJucyB7VW5pdmVyc2V9XHJcbiAgICAgKi9cclxuICAgIGFkZCguLi5hbnkpIHtcclxuICAgICAgICBzdXBlci5hZGQoLi4uYW55KTtcclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpbmcgaW5zdGFuY2VvZiBEaW1lbnNpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGltZW5zaW9ucy5wdXNoKHRoaW5nKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGluZyBpbnN0YW5jZW9mIExhdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXdzLnB1c2godGhpbmcpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaW5nIGluc3RhbmNlb2YgdGhpcy5Cb2R5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvZGllcy5wdXNoKHRoaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7VGhpbmd9IGFueVxyXG4gICAgICogQHJldHVybnMge1VuaXZlcnNlfVxyXG4gICAgICovXHJcbiAgICByZW1vdmUoLi4uYW55KSB7XHJcbiAgICAgICAgc3VwZXIucmVtb3ZlKC4uLmFueSk7XHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaW5nIGluc3RhbmNlb2YgRGltZW5zaW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aGluZ0luZGV4ID0gdGhpcy5kaW1lbnNpb25zLmluZGV4T2YodGhpbmcpO1xyXG4gICAgICAgICAgICAgICAgdGhpbmdJbmRleCA+PSAwICYmIHRoaXMuZGltZW5zaW9ucy5zcGxpY2UodGhpbmdJbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpbmcgaW5zdGFuY2VvZiBMYXcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRoaW5nSW5kZXggPSB0aGlzLmxhd3MuaW5kZXhPZih0aGluZyk7XHJcbiAgICAgICAgICAgICAgICB0aGluZ0luZGV4ID49IDAgJiYgdGhpcy5sYXdzLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGluZyBpbnN0YW5jZW9mIHRoaXMuQm9keSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGhpbmdJbmRleCA9IHRoaXMuYm9kaWVzLmluZGV4T2YodGhpbmcpO1xyXG4gICAgICAgICAgICAgICAgdGhpbmdJbmRleCA+PSAwICYmIHRoaXMuYm9kaWVzLnNwbGljZSh0aGluZ0luZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VW5pdmVyc2V9OyIsImltcG9ydCB7TGF3fSBmcm9tIFwiLi9MYXdcIjtcclxuaW1wb3J0IHtCb2R5fSBmcm9tIFwiLi4vQm9keVwiO1xyXG5cclxuY2xhc3MgR3Jhdml0YXRpb24gZXh0ZW5kcyBMYXcge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IEcoKSB7XHJcbiAgICAgICAgcmV0dXJuIDYuNjczODRlLTExO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBoYXBwZW4oZGVsdGEsIHVuaXZlcnNlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHBoeXNpY2FsRGltZW5zaW9ucyA9IHVuaXZlcnNlLnBoeXNpY2FsRGltZW5zaW9ucztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBwYXJ0aWNsZSBvZiB1bml2ZXJzZS5ib2RpZXMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGFydGljbGUubWFzcykge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJ0aWNsZSBpbnN0YW5jZW9mIEJvZHkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgb3RoZXJQYXJ0aWNsZSBvZiB1bml2ZXJzZS5ib2RpZXMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdGhlclBhcnRpY2xlLm1hc3MgfHwgcGFydGljbGUgPT09IG90aGVyUGFydGljbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaWZmZXJlbmNlcyA9IG90aGVyUGFydGljbGUucG9zaXRpb24uc3ViKHBhcnRpY2xlLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZVNxdWFyZWQgPSBvdGhlclBhcnRpY2xlLnBvc2l0aW9uLmRpc3RhbmNlVG9TcXVhcmVkKHBhcnRpY2xlLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IG90aGVyUGFydGljbGUucG9zaXRpb24uZGlzdGFuY2VUbyhwYXJ0aWNsZS5wb3NpdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDEwICsgMTApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFsRm9yY2UgPSAob3RoZXJQYXJ0aWNsZS5tYXNzIC8gZGlzdGFuY2VTcXVhcmVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9yY2VWZWN0b3IgPSBuZXcgdW5pdmVyc2UuVmVjdG9yKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtuXSBvZiBmb3JjZVZlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHlbbl0gKz0gKCgodG90YWxGb3JjZSAqIGRpZmZlcmVuY2VzW25dIC8gZGlzdGFuY2UpICogR3Jhdml0YXRpb24uRykgKiBkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBbbl0gb2YgZGlmZmVyZW5jZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gKHBhcnRpY2xlLm1hc3MgKiBwYXJ0aWNsZS52ZWxvY2l0eVtuXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgb3RoZXJQYXJ0aWNsZS5tYXNzICogb3RoZXJQYXJ0aWNsZS52ZWxvY2l0eVtuXSkgLyAocGFydGljbGUubWFzcyArIG90aGVyUGFydGljbGUubWFzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS52ZWxvY2l0eVtuXSA9IHZlbG9jaXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQYXJ0aWNsZS52ZWxvY2l0eVtuXSA9IHZlbG9jaXR5O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkZWx0YTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7R3Jhdml0YXRpb259OyIsImltcG9ydCB7RGltZW5zaW9ufSBmcm9tIFwiLi9EaW1lbnNpb25cIjtcclxuXHJcbmNsYXNzIFRpbWUgZXh0ZW5kcyBEaW1lbnNpb24ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCd0Jyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgdGhpcy5vbGRUaW1lID0gdGhpcy5zdGFydFRpbWU7XHJcbiAgICAgICAgdGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgZWxhcHNlZFRpbWUoKSB7XHJcbiAgICAgICAgdGhpcy5kZWx0YTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxhcHNlZFRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRlbHRhKCkge1xyXG4gICAgICAgIGNvbnN0IG5ld1RpbWUgPSAoIHR5cGVvZiBwZXJmb3JtYW5jZSA9PT0gJ3VuZGVmaW5lZCcgPyBEYXRlIDogcGVyZm9ybWFuY2UgKS5ub3coKSxcclxuICAgICAgICAgICAgZGlmZiA9ICggbmV3VGltZSAtIHRoaXMub2xkVGltZSApIC8gMTAwMDtcclxuXHJcbiAgICAgICAgdGhpcy5vbGRUaW1lID0gbmV3VGltZTtcclxuICAgICAgICB0aGlzLl9lbGFwc2VkVGltZSArPSBkaWZmO1xyXG5cclxuICAgICAgICByZXR1cm4gZGlmZjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YVxyXG4gICAgICogQHBhcmFtIHtUaGluZ30gcGFyZW50VGhpbmdcclxuICAgICAqL1xyXG4gICAgaGFwcGVuKGRlbHRhLCBwYXJlbnRUaGluZykge1xyXG4gICAgICAgIC8vbWFrZXMgcGFyZW50IHRoaW5nIGhhcHBlbiByZXBlYXRlZGx5LCByZWR1Y2luZyBpdHMgZGVsdGFcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcGFyZW50VGhpbmcuaGFwcGVuKCkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlbHRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtUaW1lfTsiLCJpbXBvcnQge0xhd30gZnJvbSBcIi4vTGF3XCI7XHJcblxyXG5jbGFzcyBNb3Rpb24gZXh0ZW5kcyBMYXcge1xyXG5cclxuICAgIGhhcHBlbihkZWx0YSwgdW5pdmVyc2UpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcGh5c2ljYWxEaW1lbnNpb25zID0gdW5pdmVyc2UucGh5c2ljYWxEaW1lbnNpb25zO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIHVuaXZlcnNlLnRoaW5ncykge1xyXG4gICAgICAgICAgICBpZiAodGhpbmcgaW5zdGFuY2VvZiB1bml2ZXJzZS5Cb2R5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHtuYW1lOiBkaW1lbnNpb25OYW1lfSBvZiBwaHlzaWNhbERpbWVuc2lvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGluZy5wb3NpdGlvbltkaW1lbnNpb25OYW1lXSA9IHRoaW5nLnBvc2l0aW9uW2RpbWVuc2lvbk5hbWVdICsgKHRoaW5nLnZlbG9jaXR5W2RpbWVuc2lvbk5hbWVdICogZGVsdGEpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkZWx0YTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7TW90aW9ufTsiLCJpbXBvcnQge1VuaXZlcnNlfSBmcm9tIFwiLi9Vbml2ZXJzZVwiO1xyXG5pbXBvcnQge1BoeXNpY2FsRGltZW5zaW9ufSBmcm9tIFwiLi9kaW1lbnNpb25zL1BoeXNpY2FsRGltZW5zaW9uXCI7XHJcbmltcG9ydCB7VGltZX0gZnJvbSBcIi4vZGltZW5zaW9ucy9UaW1lXCI7XHJcbmltcG9ydCB7R3Jhdml0YXRpb259IGZyb20gXCIuL2xhd3MvR3Jhdml0YXRpb25cIjtcclxuaW1wb3J0IHtNb3Rpb259IGZyb20gXCIuL2xhd3MvTW90aW9uXCI7XHJcblxyXG5mdW5jdGlvbiBiaWdCYW5nKCkge1xyXG4gICAgcmV0dXJuIG5ldyBVbml2ZXJzZShcclxuICAgICAgICBuZXcgVGltZSgpLFxyXG4gICAgICAgIG5ldyBQaHlzaWNhbERpbWVuc2lvbigneCcpLFxyXG4gICAgICAgIG5ldyBQaHlzaWNhbERpbWVuc2lvbigneScpLFxyXG4gICAgICAgIG5ldyBQaHlzaWNhbERpbWVuc2lvbigneicpLFxyXG4gICAgICAgIG5ldyBNb3Rpb24oKSxcclxuICAgICAgICBuZXcgR3Jhdml0YXRpb24oKVxyXG4gICAgKTtcclxufVxyXG5cclxuZXhwb3J0IHtiaWdCYW5nfTsiLCJjb25zdCByZW5kZXJlcnMgPSBbXTtcclxuXHJcbmxldCByZW5kZXJpbmdTdGFydGVkID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiBzdGFydCgpIHtcclxuICAgIGlmICghcmVuZGVyaW5nU3RhcnRlZCkge1xyXG4gICAgICAgIHJlbmRlcmluZ1N0YXJ0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBsZXQgbGFzdFRpbWUgPSAwO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiByZW5kZXIodGltZSkge1xyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCByZW5kZXJlciBvZiByZW5kZXJlcnMpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlcmVyLnJlYWR5ICYmIHJlbmRlcmVyLnVwZGF0ZSh0aW1lIC0gbGFzdFRpbWUsIHRpbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxhc3RUaW1lID0gdGltZTtcclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUmVuZGVyZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcclxuICAgICAgICByZW5kZXJlcnMucHVzaCh0aGlzKTtcclxuICAgICAgICBzdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7VW5pdmVyc2V9IHVuaXZlcnNlXHJcbiAgICAgKi9cclxuICAgIHJlbmRlcnModW5pdmVyc2UpIHtcclxuICAgICAgICB0aGlzLnVuaXZlcnNlID0gdW5pdmVyc2U7XHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IHRoaXMuc2V0dXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cCgpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGVsdGEsIHRpbWUpIHtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQge1JlbmRlcmVyfTsiLCJpbXBvcnQge1JlbmRlcmVyfSBmcm9tIFwiLi9SZW5kZXJlclwiO1xyXG5cclxuY2xhc3MgQ1NTUmVuZGVyZXIgZXh0ZW5kcyBSZW5kZXJlciB7XHJcblxyXG4gICAgc2V0dXAoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiB0aGlzLnVuaXZlcnNlLmJvZGllcykge1xyXG4gICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdib2R5Jyk7XHJcbiAgICAgICAgICAgIHRoaW5nLnJlbmRlciA9IGVsO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRlbHRhLCB0aW1lKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCB0aGluZyBvZiB0aGlzLnVuaXZlcnNlLmJvZGllcykge1xyXG4gICAgICAgICAgICB0aGluZy5yZW5kZXIuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNkKCcgKyAodGhpbmcucG9zaXRpb24udmFsdWVzLm1hcCh2ID0+ICh2IC8gNTAwMDAwKSArICdweCcpLmpvaW4oJywnKSkgKyAnKSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IHtDU1NSZW5kZXJlcn07IiwiaW1wb3J0IHtSZW5kZXJlcn0gZnJvbSBcIi4vUmVuZGVyZXJcIjtcclxuaW1wb3J0IHtSZWFsaXR5RXhjZXB0aW9ufSBmcm9tIFwiLi4vbGliL1JlYWxpdHlFeGNlcHRpb25cIjtcclxuXHJcbmNsYXNzIFRocmVlUmVuZGVyZXIgZXh0ZW5kcyBSZW5kZXJlciB7XHJcblxyXG4gICAgc2V0dXAoKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgVEhSRUUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWFsaXR5RXhjZXB0aW9uKCd0aHJlZS5qcyBub3QgaW5jbHVkZWQnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFRIUkVFLlJFVklTSU9OIDwgODYpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlYWxpdHlFeGNlcHRpb24oJ3RocmVlLmpzIG1vc3QgYmUgbmV3ZXIgdGhhbiA4NScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDEsIDEwMDAwKTtcclxuICAgICAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gMTAwMDtcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIHRoaXMudW5pdmVyc2UuYm9kaWVzKSB7XHJcbiAgICAgICAgICAgIHRoaW5nLnJlbmRlciA9IG5ldyBUSFJFRS5NZXNoKFxyXG4gICAgICAgICAgICAgICAgbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDEwMCksXHJcbiAgICAgICAgICAgICAgICBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOiAweGZmMDAwMCwgd2lyZWZyYW1lOiB0cnVlfSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpbmcucmVuZGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNldHVwKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkZWx0YSwgdGltZSkge1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHRoaW5nIG9mIHRoaXMudW5pdmVyc2UuYm9kaWVzKSB7XHJcbiAgICAgICAgICAgIHRoaW5nLnJlbmRlci5wb3NpdGlvbi5zZXQoXHJcbiAgICAgICAgICAgICAgICB0aGluZy5wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgICAgdGhpbmcucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgICAgIHRoaW5nLnBvc2l0aW9uLnpcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7VGhyZWVSZW5kZXJlcn07IiwiZXhwb3J0IHtSZWFsaXR5RXhjZXB0aW9uIGFzIEV4Y2VwdGlvbn0gZnJvbSAnLi9saWIvUmVhbGl0eUV4Y2VwdGlvbic7XHJcbmV4cG9ydCB7VW5pdmVyc2V9IGZyb20gJy4vVW5pdmVyc2UnO1xyXG5leHBvcnQge0xhd30gZnJvbSAnLi9sYXdzL0xhdyc7XHJcbmV4cG9ydCB7R3Jhdml0YXRpb259IGZyb20gJy4vbGF3cy9HcmF2aXRhdGlvbic7XHJcbmV4cG9ydCB7VGltZX0gZnJvbSAnLi9kaW1lbnNpb25zL1RpbWUnO1xyXG5leHBvcnQge1BoeXNpY2FsRGltZW5zaW9ufSBmcm9tICcuL2RpbWVuc2lvbnMvUGh5c2ljYWxEaW1lbnNpb24nO1xyXG5leHBvcnQge1ZlY3Rvcn0gZnJvbSAnLi9saWIvVmVjdG9yJztcclxuZXhwb3J0ICogZnJvbSAnLi9IZWxwZXJzJztcclxuZXhwb3J0IHtDU1NSZW5kZXJlcn0gZnJvbSAnLi9yZW5kZXJzL0NTU1JlbmRlcmVyJztcclxuZXhwb3J0IHtUaHJlZVJlbmRlcmVyfSBmcm9tICcuL3JlbmRlcnMvVGhyZWVKUyc7XHJcblxyXG4vL1doYXQgaXMgdGhlIG5hdHVyZSBvZiByZWFsaXR5P1xyXG5leHBvcnQgY29uc3QgbmF0dXJlID0gdW5kZWZpbmVkOyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLGdCQUFnQixTQUFTLEtBQUssQ0FBQztJQUNqQyxXQUFXLENBQUMsT0FBTyxFQUFFO1FBQ2pCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDbEMs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
