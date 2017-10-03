/**
 * All the units are metre scaled
 */

/**
 * Pi
 * @type {number}
 */
const Pi = 3.1415926535897932384626433832795028841968;

/**
 * Speed of light in vacuum
 * @unit m/s
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
const AU = 149597870700;

/**
 * parsec
 * @type {number}
 */
const pc = 206264.806247096 * AU;

/**
 * kiloparsec
 * @type {number}
 */
const kpc = 1000 * pc;

/**
 * megaparsec
 * @type {number}
 */
const Mpc = 1000000 * pc;

/**
 * gigaparsec
 * @type {number}
 */
const Gpc = 1000000000 * pc;

/**
 * The gravitational constant
 * @type {number}
 */
const G = 6.67384e-11;

/**
 * Standard gravity
 * @unit m/s²
 * @type {number}
 */
const g = 9.80665;

/**
 * kilogram
 * @type {number}
 */
const kg = 0; //TODO define masss of 1 kg

/**
 * Metre
 * @unit length
 * @type {number}
 */
const m = 1 / c;

/**
 * planck constant
 * @unit Js
 * @type {number}
 */
const h = 6.626070040 * 10 ** -34;

/**
 * minus charge of electron
 * @unit As
 * @type {number}
 */
const e = 1.602189e-19;

/**
 * proton mass
 * @unit kg
 * @type {number}
 */
const m_p = 1.672621898 * 10 ** -27;

/**
 * electron mass
 * @unit kg
 * @type {number}
 */
const m_e = 9.10938356 * 10 ** -31;

/**
 * neutron mass
 * @unit kg
 * @type {number}
 */
const m_n = 1.674927471 * 10 ** -27;

/**
 * Avogadro
 * @unit 1/mol
 * @type {number}
 */
const N_A = 6.02205e+23;

/**
 * Square root of 2
 * @type {number}
 */
const SQRT2 = 1.41421356237309504880168872420969807857;

/**
 * Boltzmann constant
 * @unit
 * @type {number}
 */
const k_B = 1.38066e-23;

var units = Object.freeze({
	Pi: Pi,
	c: c,
	a: a,
	ly: ly,
	kly: kly,
	Mly: Mly,
	Gly: Gly,
	AU: AU,
	pc: pc,
	kpc: kpc,
	Mpc: Mpc,
	Gpc: Gpc,
	G: G,
	g: g,
	kg: kg,
	m: m,
	h: h,
	e: e,
	m_p: m_p,
	m_e: m_e,
	m_n: m_n,
	N_A: N_A,
	SQRT2: SQRT2,
	k_B: k_B
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

        /**
         * @type {Number}
         */
        this.eventDeltaDilation = 1;

        this.bornAt = Date.now();

        this._existenceTime = 0;

    }

    get eventDelta() {
        return this.universe._eventDelta * this.eventDeltaDilation;
    }

    /**
     * @returns {Number}
     */
    happen() {
        this._existenceTime += this.eventDelta * 1000;
    }

    get currentTime() {
        return this.bornAt + this._existenceTime;
    }

    get currentDate() {
        return new Date(this.currentTime);
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

        if (this instanceof Universe) {
            return this;
        }

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

    happen() {
        super.happen();
        for (const thing of this.things) {
            thing.happen(this.eventDelta);
        }
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

    each(callback) {
        for (const n of this.keys) {
            callback(this[n], n);
        }
    }

    mapTo(callback) {
        const to = [];
        for (const n of this.keys) {
            to.push(callback(this[n], n));
        }
        return to;
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
    constructor({mass = 0, size, name}) {
        super();

        this.name = name;

        this.mass = mass;

        /**
         * @type {Vector}
         */
        this.size = size;
    }

    get isMassive() {
        return !!this.mass;
    }

    /**
     * Newtonian gravitational potential
     * TODO Is it right?
     * @returns {number}
     */
    get gravitationalPotential() {
        return 2 * G * this.mass;
    }

    get volume() {
        return this.size.reduce((c$$1, v) => c$$1 * v);
    }

    get density() {
        const volume = this.volume;
        if (volume && this.isMassive) {
            return this.mass / volume;
        }
        return 0; //Density of mass-less stuff? What about a photon?
    }

    applyForce(vector) {
        for (const n of vector.keys) {
            this.acceleration[n] += vector[n];
            this.velocity[n] += vector[n];
        }
        return this;
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

    happen() {
        super.happen();

        /**
         * The observer (time dilation for it should be none)
         * @type {Body}
         */
        const observer = this.universe.observer;

        for (const body of this.universe.bodies) {

            let eventDeltaDilation = 1; //time delta is multiplied by this

            //The observer should have no dilation at all
            if (body !== observer) {

                console.log(body.acceleration.x);

                /*
                    Each body has:

                    body.mass
                    body.gravitationalPotential (2 * G * this.mass) Is that right?

                    body.position.(x,y,z)

                    //Change to velocity occurred in current time interval (this will always be zero because
                    //time dilation is being calculated before any other event, so nothing has yet accelerated this object)
                    //Is that right?...
                    body.acceleration.(x,y,z)

                    body.velocity.(x,y,z)

                    How can I get time dilation to this body?
                */

            }


            /*
            //concept testing only
            if (body.name === 'Sun') {

                const secondsInOneYearOnEarth = a * 86400; //earth is the observer

                //I've read in Quora that 65 seconds is the time dilation difference between earth and sun surfaces
                //not 100% accurate since we are working with the object's center, not the surfaces
                const secondsInOneYearOnSun = secondsInOneYearOnEarth - 65;

                eventDeltaDilation = secondsInOneYearOnSun / secondsInOneYearOnEarth;

            }
            */


            body.eventDeltaDilation = eventDeltaDilation;

        }
    }
}

class Universe extends Concreta {

    constructor(...any) {
        super();

        const universe = this;

        this._eventDelta = Infinity;

        this.laws = [];
        this.bodies = [];

        this.Vector = class extends Vector {
            constructor(values = {}) {

                if (universe.space) {
                    const orderedValues = {};
                    const physDim = universe.space.physicalDimensions;
                    for (const {name: dimensionName} of physDim) {
                        if (!values.hasOwnProperty(dimensionName)) {
                            orderedValues[dimensionName] = 0;
                        } else {
                            orderedValues[dimensionName] = values[dimensionName];
                        }
                    }
                    values = orderedValues;
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

                this.acceleration = definition.acceleration instanceof universe.Vector ?
                    definition.acceleration : new universe.Vector(definition.acceleration);

                this.size = definition.size instanceof universe.Vector ?
                    definition.size : new universe.Vector(definition.size);
            }
        };

        this.add(...any);

    }

    set eventDelta(delta) {
        this._eventDelta = delta;
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

    /**
     * @param {Thing} thing
     */
    set observer(thing) {
        if (thing instanceof Thing) {
            this._observer = thing;
        } else {
            throw new RealityException('Invalid observer');
        }
    }

    /**
     * @returns {Thing}
     */
    get observer() {
        return this._observer || null;
    }

    set target(body) {
        this._target = body;
    }

    get target() {
        return this._target;
    }

    happen() {
        super.happen();

        //move this away
        for (const body of this.bodies) {
            body.acceleration.multiplyScalar(0);
        }

    }
}

class Gravitation extends Law {

    /**
     * @return {number}
     */
    static get G() {
        return G;
    }


    happen() {

        for (const body of this.universe.bodies) {

            if (!body.isMassive) {
                continue;
            }

            if (body instanceof Body) {

                for (const otherBody of this.universe.bodies) {

                    if (!otherBody.isMassive || body === otherBody) {
                        continue;
                    }

                    const differences = otherBody.position.sub(body.position);
                    const distanceSquared = otherBody.position.distanceToSquared(body.position);
                    const distance = otherBody.position.distanceTo(body.position);

                    if (distance > body.size.x + otherBody.size.x) {

                        const totalForce = (otherBody.mass / distanceSquared);
                        const forceVector = new this.universe.Vector();

                        for (const [n] of forceVector) {
                            forceVector[n] += (((totalForce * differences[n] / distance) * Gravitation.G * body.eventDelta)); //should apply delta?
                        }

                        body.applyForce(forceVector);

                    } else {
                        for (const [n] of differences) {
                            const velocity = (body.mass * body.velocity[n]
                                + otherBody.mass * otherBody.velocity[n]) / (body.mass + otherBody.mass);
                            body.velocity[n] = velocity;
                            otherBody.velocity[n] = velocity;
                        }
                    }

                }
            }
        }
    }

}

class Time extends Dimension {

    constructor() {
        super('t');

        this.startTime = performance.now();
        this.oldTime = this.startTime;
        this._elapsedTime = 0;

        this.speed = 1;

        this.relativeToSpace = true;

    }

    get elapsedTime() {
        this.delta;
        return this._elapsedTime;
    }

    get delta() {
        const newTime = performance.now(),
            diff = ( newTime - this.oldTime ) / 1000;

        this.oldTime = newTime;
        this._elapsedTime += diff;

        return diff * this.speed;
    }

    happen() {
        //If the universe had no observer at all?
        //Would it die at the same time it was born? I guess so...
        if (this.universe.observer) {
            //makes parent universe happen repeatedly, reducing its delta
            this.universe.eventDelta = this.delta;
            setTimeout(() => this.universe.happen(), 1000 / 60);
        }
    }

}

class Motion extends Law {

    happen() {
        const physicalDimensions = this.universe.space.physicalDimensions;

        const targetChange = new this.universe.Vector();

        if (this.universe.target) {
            const body = this.universe.target;
            for (const {name: dimensionName} of physicalDimensions) {
                targetChange[dimensionName] = -(body.velocity[dimensionName] * body.eventDelta);
            }
        }

        for (const body of this.universe.bodies) {
            if (this.universe.target !== body) {
                for (const {name: dimensionName} of physicalDimensions) {
                    body.position[dimensionName] =
                        targetChange[dimensionName]
                        + body.position[dimensionName]
                        + (body.velocity[dimensionName] * body.eventDelta);

                }
            }
        }

    }

}

const SUN = {
    MASS: 1.98855 * 10 ** 30,
    RADIUS: 696000000,
};

const EARTH = {
    MASS: 5.9736e+24,
    RADIUS: 6378000.137,
    DISTANCE_TO_SUN: AU,
    VELOCITY: {
        y: 30000 //Random guess...
    }
};

const MOON = {
    MASS: 7.347550162055999e+22,
    RADIUS: 1738000,
    DISTANCE_TO_SUN: AU - 384400000,
    VELOCITY: {
        y: 29000 //Random guess...
    }
};

const MARS = {
    MASS: 6.39 * 10 ** 23,
    RADIUS: 3390000,
    DISTANCE_TO_SUN: 227900000000,
    VELOCITY: {
        y: 25000 //Random guess...
    }
};

function createSolarSystem({sunEarthMoon = true} = {sunEarthMoon: true}) {
    const universe = bigBang();

    const sun = new universe.Body({
        name: 'Sun',
        mass: SUN.MASS,
        size: new universe.Vector({
            x: SUN.RADIUS * 2,
            y: SUN.RADIUS * 2,
            z: SUN.RADIUS * 2
        })
    });
    universe.add(sun);

    const earth = new universe.Body({
        name: 'Earth',
        mass: EARTH.MASS,
        size: new universe.Vector({
            x: EARTH.RADIUS * 2,
            y: EARTH.RADIUS * 2,
            z: EARTH.RADIUS * 2
        }),
        position: new universe.Vector({
            x: EARTH.DISTANCE_TO_SUN,
        }),
        velocity: new universe.Vector(EARTH.VELOCITY)
    });
    universe.add(earth);

    const moon = new universe.Body({
        name: 'Moon',
        mass: MOON.MASS,
        size: new universe.Vector({
            x: MOON.RADIUS * 2,
            y: MOON.RADIUS * 2,
            z: MOON.RADIUS * 2
        }),
        position: new universe.Vector({
            x: MOON.DISTANCE_TO_SUN,
        }),
        velocity: new universe.Vector(MOON.VELOCITY)
    });
    universe.add(moon);

    const mars = new universe.Body({
        name: 'Mars',
        mass: MARS.MASS,
        size: new universe.Vector({
            x: MARS.RADIUS * 2,
            y: MARS.RADIUS * 2,
            z: MARS.RADIUS * 2
        }),
        position: new universe.Vector({
            x: MARS.DISTANCE_TO_SUN,
        }),
        velocity: new universe.Vector(MARS.VELOCITY)
    });
    universe.add(mars);

    const ball = new universe.Body({
        name: 'ball',
        mass: 10,
        size: new universe.Vector({
            x: 1,
            y: 1,
            z: 1,
        }),
        position: new universe.Vector({
            x: EARTH.DISTANCE_TO_SUN,
            y: EARTH.RADIUS + .5
        }),
    });
    universe.add(ball);

    universe.observer = ball;

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
        new Gravitation(),
        new Motion()
    );
}

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
        });

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

class TargetControl extends RendererPlugin {

    setup() {
        window.addEventListener('keydown', e => {
            if (e.key.toLowerCase() !== 'o') return;

            e.preventDefault();

            const body = this.biggestBodyInScreen;

            if (this.universe.target === body) {
                console.log(`targeting off`);
                this.universe.target = null;
                return;
            }

            if (body) {
                this.startTargeting(body);
            }

        });
    }

    startTargeting(body) {
        this.universe.target = body;
        console.log(`targeting: ${body.name}`);
    }

    get biggestBodyInScreen() {
        let volume = 0, selected = null;
        for (const body of this.universe.bodies) {
            if (body.render.classList.contains('visible')) {
                if (body.volume > volume) {
                    volume = body.volume;
                    selected = body;
                }
            }
        }
        return selected;
    }

    onAfterBodySetup(body) {
        body.render.addEventListener('dblclick', e => this.startTargeting(body));
    }
}

class ZoomControl extends RendererPlugin {

    constructor({helper = false, scaleSample = false} = {}) {
        super(...arguments);
        this.zooming = false;
        this.showZoomHelper = helper;
        this.showScaleSample = scaleSample;
        this.zoomHelper = {};
    }

    createScaleSample() {
        this.scaleSample = document.createElement('div');
        this.scaleSample.classList.add('scale-sample');

        this.scaleSample.innerHTML = `
            <div class="scale">
                    <div class="sample"></div>
                    <div class="value">1231232km</div>
                </div>
        `;

        document.body.appendChild(this.scaleSample);

    }

    updateScaleSample() {

        const sampleWidthPx = this.scaleSample.querySelector('.sample').getBoundingClientRect().width;

        let scale = ((sampleWidthPx * this.renderer.metre) / this.renderer.pixelsPerMetre) / this.renderer.scale;

        if (scale > Gpc) {
            scale = (scale / Gpc).toLocaleString() + ' Gpc';
        } else if (scale > Mpc) {
            scale = (scale / Mpc).toLocaleString() + ' Mpc';
        } else if (scale > kpc) {
            scale = (scale / kpc).toLocaleString() + ' kpc';
        } else if (scale > pc) {
            scale = (scale / pc).toLocaleString() + ' pc';
        } else if (scale > ly * .1) {
            scale = (scale / ly).toLocaleString() + ' ly';
        } else if (scale >= AU * .1) {
            scale = (scale / AU).toLocaleString() + ' AU';
        } else if (scale > 1000) {
            scale = (scale / 1000).toLocaleString() + ' km';
        } else if (scale > 1) {
            scale = scale.toLocaleString() + ' mt';
        } else {
            scale = scale.toLocaleString() + ' cm';
        }

        this.scaleSample.querySelector('.value').textContent = scale;

    }

    setup() {

        if (this.showScaleSample) {
            this.createScaleSample();
        }

        let zoomTimer;

        this.renderer.renderDomTarget.addEventListener('mousewheel', e$$1 => {

            e$$1.preventDefault();

            clearTimeout(zoomTimer);

            if (!this.zooming) {
                if (this.showZoomHelper) {
                    if (!this.zoomHelper.element) {
                        let pamElement = document.createElement('div');
                        pamElement.classList.add('zoomHelper');
                        this.renderer.renderDomTarget.appendChild(pamElement);
                        this.zoomHelper.element = pamElement;
                    } else {
                        this.zoomHelper.element.classList.remove('gone');
                    }
                    this.zoomHelper.scale = this.renderer.absoluteScale;
                    this.zoomHelper.x = this.renderer.pan.x;
                    this.zoomHelper.y = this.renderer.pan.y;
                }
                this.zooming = true;
            }

            zoomTimer = setTimeout(() => {
                if (this.zoomHelper.element) {
                    this.zoomHelper.element.classList.add('gone');
                }
                this.zooming = false;
            }, 200);

            const spaceSize = this.renderer.renderDomTarget.getBoundingClientRect();

            const change = e$$1.deltaY / 100,
                previousScale = this.renderer.absoluteScale;

            this.renderer.scale -= change * this.renderer.scale * 0.1;
            this.renderer.absoluteScale -= change * this.renderer.absoluteScale * 0.1;

            const scaleChange = (this.renderer.absoluteScale / previousScale) - 1;

            this.renderer.pan.x -= ((e$$1.clientX / spaceSize.width)
                * (spaceSize.width / (spaceSize.width * this.renderer.absoluteScale))) * spaceSize.width * scaleChange;

            this.renderer.pan.y -= ((e$$1.clientY / spaceSize.height)
                * (spaceSize.height / (spaceSize.height * this.renderer.absoluteScale))) * spaceSize.height * scaleChange;

            if (this.showZoomHelper) {
                this.zoomHelper.element.style.width = (spaceSize.width * (this.renderer.absoluteScale / this.zoomHelper.scale)) + 'px';
                this.zoomHelper.element.style.height = (spaceSize.height * (this.renderer.absoluteScale / this.zoomHelper.scale)) + 'px';
                this.zoomHelper.element.style.left = (this.renderer.pan.x * this.renderer.absoluteScale) - (this.zoomHelper.x * this.renderer.absoluteScale) + 'px';
                this.zoomHelper.element.style.top = (this.renderer.pan.y * this.renderer.absoluteScale) - (this.zoomHelper.y * this.renderer.absoluteScale) + 'px';
            }

            this.updateScaleSample();

        });

        this.updateScaleSample();
    }
}

class DragControl extends RendererPlugin {
    setup() {

        let dragActive = false,
            dragStart = null,
            lastDrag = null,
            dragSpeed = {x: 0, y: 0};


        this.renderer.renderDomTarget.addEventListener('mousedown', e => {
            dragSpeed = {x: 0, y: 0};
            dragActive = true;
        });

        window.addEventListener('mousemove', e => {
            if (dragActive) {

                if (!dragStart) {
                    dragStart = {x: e.clientX, y: e.clientY};
                    this.renderer.renderDomTarget.classList.add('dragging');
                }

                if (lastDrag) {
                    dragSpeed.x = e.clientX - lastDrag.x;
                    dragSpeed.y = e.clientY - lastDrag.y;
                }

                this.renderer.pan.x += dragSpeed.x / (this.renderer.scale / this.renderer.initialScale);
                this.renderer.pan.y += dragSpeed.y / (this.renderer.scale / this.renderer.initialScale);

                const zoomControl = this.renderer.getPlugin(ZoomControl);

                if (zoomControl && zoomControl.showZoomHelper) {
                    if (zoomControl.zoomHelper.element) {
                        zoomControl.zoomHelper.element.style.left = (this.renderer.pan.x * this.renderer.absoluteScale)
                            - (zoomControl.zoomHelper.x * this.renderer.absoluteScale) + 'px';
                        zoomControl.zoomHelper.element.style.top = (this.renderer.pan.y * this.renderer.absoluteScale)
                            - (zoomControl.zoomHelper.y * this.renderer.absoluteScale) + 'px';
                    }
                }

                lastDrag = {x: e.clientX, y: e.clientY};

            }
        });

        window.addEventListener('mouseup', e => {
            dragActive = false;
            dragStart = null;
            lastDrag = null;
            this.renderer.renderDomTarget.classList.remove('dragging');
        });

    }
}

//still 2d for now

class CSSRenderer extends Renderer {

    constructor() {
        super(...arguments);
        this.pan = {x: 0, y: 0, z: 0};
        this.initialScale = this.scale;
    }

    setup() {

        let index = 1;
        for (const body of this.bodiesForSetup()) {
            this.renderDomTarget.appendChild(
                this.createBodyElement(body)
            );
            body.render.style.zIndex = index++;
        }

        return super.setup();
    }

    createBodyElement(body) {
        const element = document.createElement('div');
        element.classList.add('body');
        element.innerHTML = `
            <div class="info"></div>
            <div class="name">${body.name}</div>
        `;
        element.style.width = this.scaled(body.size.x) + 'px';
        element.style.height = this.scaled(body.size.y) + 'px';
        body.render = element;
        return element;
    }

    update(delta, time) {

        let spaceSize = this.renderDomTarget.getBoundingClientRect();

        spaceSize = {
            x: spaceSize.width,
            y: spaceSize.height,
            z: 0
        };

        if (!this.initialSpaceSize) {
            this.initialSpaceSize = spaceSize;
        }

        for (const body of this.universe.bodies) {

            let shouldUpdateRender = true;

            const toWidth = this.scaled(body.size.x);
            const toHeight = this.scaled(body.size.y);

            const position = body.position.mapTo((v, n) =>
                (
                    (this.pan[n] * this.absoluteScale)
                    + this.scaled((body.position[n]))
                    + ((this.initialSpaceSize[n]) * this.absoluteScale / 2) - this.scaled(body.size[n]) / 2
                )
            );

            if (body.render.currentPosition) {
                shouldUpdateRender =
                    body.render.currentPosition[0] + toWidth > 0
                    && body.render.currentPosition[1] + toHeight > 0
                    && body.render.currentPosition[0] < spaceSize.x
                    && body.render.currentPosition[1] < spaceSize.y;
            }

            body.render.classList[shouldUpdateRender ? 'add' : 'remove']('visible');

            if (shouldUpdateRender) {

                body.render.classList[this.universe.target === body ? 'add' : 'remove']('target');

                body.render.querySelector('.info').innerHTML = `
                    <div>(x) Position: ${body.position.x}</div>
                    <div>(x) Velocity: ${body.velocity.x}</div>
                    <div>Time Dilation at core: ${-(1 - body.eventDeltaDilation) * 100}%</div>
                    <div>Date at core: ${body.currentDate}</div>
                `;

                //alternative to scaling to avoid scaling bug on chrome
                body.render.style.width = toWidth + 'px';
                body.render.style.height = toHeight + 'px';

                body.render.style.transform = [
                    'translate3d('
                    + (position.map((v, i) => (i === 2 ? 0 : v) + 'px').join(','))
                    + ')',
                    //scaling has some rendering bugs on chrome
                    //'scale(' + this.absoluteScale + ')',
                ].join(' ');

            }

            body.render.currentWidth = toWidth;
            body.render.currentHeight = toHeight;
            body.render.currentPosition = position;

        }

        this.removeHiddenSmallerBodies();

    }

    removeHiddenSmallerBodies() {
        let bodyInvisible = false;
        for (const body of this.universe.bodies) {

            if (!body.render.classList.contains('visible')) {
                continue;
            }

            for (const otherBody of this.universe.bodies) {
                if (body !== otherBody) {

                    const tooCloseX = Math.abs(
                        (body.render.currentPosition[0] + (body.render.currentWidth / 2))
                        - (otherBody.render.currentPosition[0] + (otherBody.render.currentWidth / 2))
                        ) < 20,
                        tooCloseY = Math.abs(
                            (body.render.currentPosition[1] + (body.render.currentHeight / 2))
                            - (otherBody.render.currentPosition[1] + (otherBody.render.currentHeight / 2))
                        ) < 20;

                    bodyInvisible = tooCloseX && tooCloseY && body.volume < otherBody.volume;

                    body.render.classList[bodyInvisible ? 'remove' : 'add']('visible');

                    if (bodyInvisible) {
                        break;
                    }

                }
            }

        }
    }

}

CSSRenderer.TargetControl = TargetControl;
CSSRenderer.DragControl = DragControl;
CSSRenderer.ZoomControl = ZoomControl;

class FlyControls extends RendererPlugin {

    setup() {

        const controls = new THREE.FlyControls(this.renderer.camera);

        this.movementDelta = 0;

        controls.movementSpeed = 0;
        controls.domElement = this.renderer.renderDomTarget;
        controls.rollSpeed = Math.PI / 20;
        controls.autoForward = false;
        controls.dragToLook = false;

        this.controls = controls;

        window.addEventListener('mousewheel', e$$1 => {

            e$$1.preventDefault();

            //controls.movementSpeed += (e.deltaY / 10) * (controls.movementSpeed || 1) * 0.01;

            //if (controls.movementSpeed < 0) {
            //    controls.movementSpeed = 0;
            // }

            /*console.log(
                this.renderer.scaleString(this.renderer.scaled(controls.movementSpeed)),
            );*/

        });

        return true;

    }

    update(delta) {
        // Y U NOT WORK T_T
        const kph = 40;
        this.controls.movementSpeed = this.renderer.scaled(kph * 0.277777778);
        this.controls.update(delta);
    }

}

class ThreeJSRenderer extends Renderer {

    constructor() {
        super(...arguments);
    }

    set scene(scene) {
        this._scene = scene;
    }

    get scene() {
        return this._scene;
    }

    set camera(camera) {
        this._camera = camera;
    }

    get camera() {
        return this._camera;
    }

    set renderer(renderer) {
        this._renderer = renderer;
    }

    get renderer() {
        return this._renderer;
    }

    setup() {

        if (typeof THREE === 'undefined') {
            throw new RealityException('three.js not included');
        } else if (THREE.REVISION < 86) {
            throw new RealityException('three.js most be newer than 85');
        }

        if (!this.scene) {
            this.scene = new THREE.Scene();
        }

        if (!this.camera) {
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, this.scaled(AU * 2));
            //The camera stands 2 metres from the surface of the earth
            this.camera.position.x = this.scaled(AU);
            this.camera.position.y = this.scaled(EARTH.RADIUS + 1);
            this.camera.position.z = 2;
        }

        if (!this.renderer) {
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        for (const body of this.bodiesForSetup()) {

            const segments = body.name === 'Earth' ? 256 : 16;

            body.render = new THREE.Mesh(
                new THREE.SphereGeometry(this.scaled(body.size.x / 2), segments, segments),
                new THREE.MeshBasicMaterial({color: body.name === 'ball' ? 0x0000ff : 0xff0000, wireframe: true}) //, side:THREE.BackSide
            );
            this.scene.add(body.render);
        }

        document.body.appendChild(this.renderer.domElement);

        return super.setup();

    }

    update(delta, time) {

        for (const body of this.universe.bodies) {
            body.render.position.set(
                this.scaled(body.position.x),
                this.scaled(body.position.y),
                this.scaled(body.position.z)
            );
        }

        this.renderer.render(this.scene, this.camera);
    }

}

ThreeJSRenderer.FlyControls = FlyControls;

const UNIT = units;

//What is the nature of reality?
const nature = undefined;

export { UNIT, nature, RealityException as Exception, Universe, Space, Law, Gravitation, Time, PhysicalDimension, Vector, CSSRenderer, ThreeJSRenderer, bigBang, createSolarSystem };
