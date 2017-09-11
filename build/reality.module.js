/**
 * All the units are metre scaled
 */

/**
 * Speed of light in vacuum in metres per second
 * @type {number}
 */
const c = 299792458;

/**
 * Julian year
 * @type {number}
 */
const a = 365.25;

/**
 * light-year
 * @type {number}
 */
const ly = c * a * 86400;

/**
 * kilolight-year
 * @type {number}
 */
const kly = 1000 * ly;

/**
 * megalight-year
 * @type {number}
 */
const Mly = 1000000 * ly;

/**
 * gigalight-year
 * @type {number}
 */
const Gly = 1000000000 * ly;

/**
 * Astronomical unit
 * @type {number}
 */
const AU = 1.496 * 10 ** 11;

/**
 * The gravitational constant
 * @type {number}
 */
const G = 6.67384e-11;

//export const EARTH_ANGULAR_VELOCITY_METRES_PER_SECOND = 1.990986 * 10 ** -7;

var units = Object.freeze({
	c: c,
	a: a,
	ly: ly,
	kly: kly,
	Mly: Mly,
	Gly: Gly,
	AU: AU,
	G: G
});

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

    constructor() {

        /**
         * @type {Universe}
         * @private
         */
        this._universe = null;

        /**
         * @type {Thing}
         * @private
         */
        this._parentThing = null;
    }

    /**
     * @param {Number} delta
     * @returns {Number}
     */
    happen(delta) {
        return delta;
    }

    /**
     * @returns {Thing}
     */
    get parentThing() {
        return this._parentThing;
    }

    /**
     * @param {Thing} thing
     */
    set parentThing(thing) {
        this._universe = null;
        this._parentThing = thing;
    }

    /**
     * @returns {Universe}
     */
    get universe() {

        if (this._universe) {
            return this._universe;
        }

        let thing = this.parentThing;
        while (thing && !(thing instanceof Universe)) {
            thing = thing.parentThing;
        }
        return this._universe = thing;
    }

}

class Abstracta extends Thing {

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
        for (const thing of any) {
            thing.parentThing = this;
        }
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
                thing.parentThing = null;
            }
        }
        return this;
    }

    happen(delta) {
        delta = super.happen(delta);
        for (const thing of this.things) {
            delta = thing.happen(delta);
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
    constructor({mass = 0, size}) {
        super();

        this.mass = mass;

        /**
         * @type {Vector}
         */
        this.size = size;
    }

    get isMassive() {
        return !!this.mass;
    }

    get volume() {
        return this.size.reduce((c, v) => c * v);
    }

    get density() {
        const volume = this.volume;
        if (volume && this.isMassive) {
            return this.mass / volume;
        }
        return 0; //Density of mass-less stuff? What about a photon?
    }

}

class Dimension extends Abstracta {

    constructor(name) {
        super();
        this.name = name;
    }

}

class PhysicalDimension extends Dimension {

}

class Space extends Concreta {
    constructor() {
        super(...arguments);
    }

    get physicalDimensions() {
        return this.things.filter(dimension => dimension instanceof PhysicalDimension);
    }

    get nonPhysicalDimensions() {
        return this.things.filter(dimension => !(dimension instanceof PhysicalDimension));
    }
}

class Universe extends Concreta {

    constructor(...any) {
        super();

        const universe = this;

        this.laws = [];
        this.bodies = [];

        this.Vector = class extends Vector {
            constructor(values = {}) {

                if (universe.space) {
                    for (const {name: dimensionName} of universe.space.physicalDimensions) {
                        if (!values.hasOwnProperty(dimensionName)) {
                            values[dimensionName] = 0;
                        }
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

                this.size = definition.size instanceof universe.Vector ?
                    definition.size : new universe.Vector(definition.size);
            }
        };

        this.add(...any);

    }

    /**
     * @param {Thing} any
     * @returns {Universe}
     */
    add(...any) {
        super.add(...any);
        for (const thing of any) {
            if (thing instanceof Law) {
                this.laws.push(thing);
            } else if (thing instanceof this.Body) {
                this.bodies.push(thing);
            } else if (!(thing instanceof Space)) {
                throw new RealityException('Invalid object type');
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
            if (thing instanceof Law) {
                const thingIndex = this.laws.indexOf(thing);
                thingIndex >= 0 && this.laws.splice(thingIndex, 1);
            } else if (thing instanceof this.Body) {
                const thingIndex = this.bodies.indexOf(thing);
                thingIndex >= 0 && this.bodies.splice(thingIndex, 1);
            } else if (!(thing instanceof Space)) {
                throw new RealityException('Invalid object type');
            }
        }
        return this;
    }

    /**
     * @returns {Space}
     */
    get space() {
        return this._space || (this._space = this.things.find(thing => thing instanceof Space));
    }

}

class Gravitation extends Law {

    /**
     * @return {number}
     */
    static get G() {
        return G;
    }


    happen(delta) {

        for (const particle of this.universe.bodies) {

            if (!particle.isMassive) {
                continue;
            }

            if (particle instanceof Body) {

                for (const otherParticle of this.universe.bodies) {

                    if (!otherParticle.isMassive || particle === otherParticle) {
                        continue;
                    }

                    const differences = otherParticle.position.sub(particle.position);
                    const distanceSquared = otherParticle.position.distanceToSquared(particle.position);
                    const distance = otherParticle.position.distanceTo(particle.position);

                    if (distance > 10 + 10) {

                        const totalForce = (otherParticle.mass / distanceSquared);
                        const forceVector = new this.universe.Vector();

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
     */
    happen(delta) {
        //makes parent universe happen repeatedly, reducing its delta
        setTimeout(() => this.universe.happen(), 1000 / 60);
        return this.delta;
    }

}

class Motion extends Law {

    happen(delta) {

        const physicalDimensions = this.universe.space.physicalDimensions;

        for (const thing of this.universe.things) {
            if (thing instanceof this.universe.Body) {
                for (const {name: dimensionName} of physicalDimensions) {
                    thing.position[dimensionName] = thing.position[dimensionName] + (thing.velocity[dimensionName] * delta);
                }
            }
        }

        return delta;
    }

}

const SUN = {
    MASS: 1.98855 * 10 ** 30,
    RADIUS: 696000000,
    POSITION: {x: 0, y: 0, z: 0}
};

const EARTH = {
    MASS: 5.9736e+24,
    RADIUS: 6378000.137,
    POSITION: {x: AU, y: 0, z: 0}
};

const MOON = {
    MASS: 7.347550162055999e+22,
    RADIUS: 1738000,
    POSITION: {x: 0, y: 0, z: 0}, //relative to earth?
    DISTANCE_TO: {
        EARTH: 384400000
    }
};

function createSolarSystem({sunEarthMoon = true} = {sunEarthMoon: true}) {
    const universe = bigBang();

    const sun = new universe.Body({
        mass: SUN.MASS,
        size: new universe.Vector({
            x: SUN.RADIUS * 2,
            y: SUN.RADIUS * 2,
            z: SUN.RADIUS * 2
        })
    });

    const earth = new universe.Body({
        mass: EARTH.MASS,
        size: new universe.Vector({
            x: EARTH.RADIUS * 2,
            y: EARTH.RADIUS * 2,
            z: EARTH.RADIUS * 2
        }),
        position: new universe.Vector({
            z: AU,
        })
    });

    const moon = new universe.Body({
        mass: MOON.MASS,
        size: new universe.Vector({
            x: MOON.RADIUS * 2,
            y: MOON.RADIUS * 2,
            z: MOON.RADIUS * 2
        }),
        position: new universe.Vector({
            x: 7900000,
            z: AU - MOON.DISTANCE_TO.EARTH,
        }),
        velocity: new universe.Vector({
            x: 0
        })
    });

    universe.add(sun);
    universe.add(earth);
    universe.add(moon);

    return universe;
}

function bigBang() {
    return new Universe(
        new Space().add(
            new Time(),
            new PhysicalDimension('x'),
            new PhysicalDimension('y'),
            new PhysicalDimension('z')
        ),
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

    constructor(options = {}) {
        this.ready = false;

        this.metre = 100;
        this.pixelsPerMetre = options.pixelsPerMetre || 100;

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
            thing.render.style.transform = 'translate3d(' + (
                thing.position.values.map(v => (v / this.metre * this.pixelsPerMetre
                ) + 'px').join(',')) + ')';
        }
    }

}

class ThreeRenderer extends Renderer {

    constructor() {
        super(...arguments);
    }

    setup() {

        if (typeof THREE === 'undefined') {
            throw new RealityException('three.js not included');
        } else if (THREE.REVISION < 86) {
            throw new RealityException('three.js most be newer than 85');
        }

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, AU * 2);
        this.camera.position.z = AU - EARTH.RADIUS;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        for (const thing of this.universe.bodies) {
            console.log(thing.size.x, thing.size.y, thing.size.z);
            thing.render = new THREE.Mesh(
                new THREE.CubeGeometry(thing.size.x, thing.size.y, thing.size.z),
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

const UNIT = units;

//What is the nature of reality?
const nature = undefined;

export { UNIT, nature, RealityException as Exception, Universe, Space, Law, Gravitation, Time, PhysicalDimension, Vector, CSSRenderer, ThreeRenderer, bigBang, createSolarSystem };
