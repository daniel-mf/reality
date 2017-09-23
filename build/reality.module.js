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

var units = Object.freeze({
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

        /**
         * @type {Number}
         */
        this.eventDeltaDilatation = 1;

        this.bornAt = Date.now();

        this._existenceTime = 0;

    }

    get eventDelta() {
        return this.universe._eventDelta * this.eventDeltaDilatation;
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
    get graviationalPotential() {
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
        //TODO cause time dilatation in everything
        for (const thing of this.universe.things) {

            //concept testing only
            if (thing.name === 'Sun') {

                const secondsInOneYearOnEarth = a * 86400; //earth is the observer

                //I heard somewhere that 65 seconds is the time dilatation difference between earth and sun surfaces
                //not 100% accurate since we are working with the object's center, not the surfaces
                const secondsInOneYearOnSun = secondsInOneYearOnEarth - 65;

                thing.eventDeltaDilatation = secondsInOneYearOnSun / secondsInOneYearOnEarth;

            } else {
                thing.eventDeltaDilatation = 1;
            }

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

}

class Gravitation extends Law {

    /**
     * @return {number}
     */
    static get G() {
        return G;
    }


    happen() {

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
                            particle.velocity[n] += (((totalForce * differences[n] / distance) * Gravitation.G * particle.eventDelta)); //should apply delta?
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

        for (const thing of this.universe.things) {
            if (thing instanceof this.universe.Body) {
                //console.log(thing.eventDelta);
                for (const {name: dimensionName} of physicalDimensions) {
                    thing.position[dimensionName] = thing.position[dimensionName] + (thing.velocity[dimensionName] * this.eventDelta);
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

    /*
    const moon = new universe.Body({
        mass: MOON.MASS,
        size: new universe.Vector({
            x: MOON.RADIUS * 2,
            y: MOON.RADIUS * 2,
            z: MOON.RADIUS * 2
        }),
        position: new universe.Vector({
            x: 7000000,
            z: AU - MOON.DISTANCE_TO.EARTH,
        })
    });
    */

    universe.add(sun);
    universe.add(earth);
    //universe.add(moon);

    universe.observer = earth;

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
                renderer.ready && renderer.update(time - lastTime, time);
            }
            lastTime = time;
        });

    }
}

class Renderer {

    constructor({metre = 100, pixelsPerMetre = 100, scale = 1, renderDomTarget} = {}) {
        this.ready = false;

        this.metre = metre;
        this.pixelsPerMetre = pixelsPerMetre;
        this.initialScale = scale;
        this.scale = scale;
        this.absoluteScale = 1;
        this.lastScaleChange = 0;

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

    update(delta, time) {

    }

    onResize() {

    }

}

class CSSRenderer extends Renderer {

    constructor() {
        super(...arguments);
        this.zoomHelper = {};
        this.pan = {x: 0, y: 0, z: 0};
        this.initialScale = this.scale;
        this.showZoomHelper = false;
        this.zooming = false;
    }

    setup() {

        for (const thing of this.universe.bodies) {
            this.renderDomTarget.appendChild(
                this.createBodyElement(thing)
            );
        }

        return true;
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

        for (const thing of this.universe.bodies) {

            thing.render.querySelector('.info').innerHTML = `
            <div>(x) Position: ${thing.position.x}</div>
            <div>(x) Velocity: ${thing.velocity.x}</div>
            <div>Time Dilatation at core: ${-(1-thing.eventDeltaDilatation) * 100}%</div>
            <div>Date at core: ${thing.currentDate}</div>
            `;

            //alternative to scaling to avoid scaling bug on chrome
            thing.render.style.width = (thing.size.x * this.scale) + 'px';
            thing.render.style.height = (thing.size.y * this.scale) + 'px';

            thing.render.style.transform = [
                'translate3d(' + (thing.position.mapTo((v, n) => (
                    Math.round(
                        ((this.pan[n] * this.absoluteScale)
                            + ((thing.position[n]) * (spaceSize[n] ? 1 : 0) * this.scale)
                            + ((spaceSize[n]) * this.absoluteScale / 2) - (
                                (thing.size[n] * (spaceSize[n] ? 1 : 0) * this.scale)// * 2
                            ) / 2)
                    )
                ) + 'px').join(',')) + ')',

                //scaling has some rendering bugs on chrome
                //'scale(' + this.absoluteScale + ')',

            ].join(' ');
        }
    }

    setupDragControl() {

        let dragActive = false,
            dragStart = null,
            lastDrag = null,
            dragSpeed = {x: 0, y: 0};


        this.renderDomTarget.addEventListener('mousedown', e => {
            dragSpeed = {x: 0, y: 0};
            dragActive = true;
        });

        window.addEventListener('mousemove', e => {
            if (dragActive) {

                if (!dragStart) {
                    dragStart = {x: e.clientX, y: e.clientY};
                    this.renderDomTarget.classList.add('dragging');
                }

                if (lastDrag) {
                    dragSpeed.x = e.clientX - lastDrag.x;
                    dragSpeed.y = e.clientY - lastDrag.y;
                }

                this.pan.x += dragSpeed.x / (this.scale / this.initialScale);
                this.pan.y += dragSpeed.y / (this.scale / this.initialScale);

                if (this.showZoomHelper) {
                    if (this.zoomHelper.element) {
                        this.zoomHelper.element.style.left = (this.pan.x * this.absoluteScale)
                            - (this.zoomHelper.x * this.absoluteScale) + 'px';
                        this.zoomHelper.element.style.top = (this.pan.y * this.absoluteScale)
                            - (this.zoomHelper.y * this.absoluteScale) + 'px';
                    }
                }

                lastDrag = {x: e.clientX, y: e.clientY};

            }
        });

        window.addEventListener('mouseup', e => {
            dragActive = false;
            dragStart = null;
            lastDrag = null;
            this.renderDomTarget.classList.remove('dragging');
        });

    }

    setupZoomControl() {

        let zoomTimer;

        this.renderDomTarget.addEventListener('mousewheel', e => {

            e.preventDefault();

            clearTimeout(zoomTimer);

            if (!this.zooming) {
                if (this.showZoomHelper) {
                    if (!this.zoomHelper.element) {
                        let pamElement = document.createElement('div');
                        pamElement.classList.add('zoomHelper');
                        this.renderDomTarget.appendChild(pamElement);
                        this.zoomHelper.element = pamElement;
                    } else {
                        this.zoomHelper.element.classList.remove('gone');
                    }
                    this.zoomHelper.scale = this.absoluteScale;
                    this.zoomHelper.x = this.pan.x;
                    this.zoomHelper.y = this.pan.y;
                }
                this.zooming = true;
            }

            zoomTimer = setTimeout(() => {
                if (this.zoomHelper.element) {
                    this.zoomHelper.element.classList.add('gone');
                }
                this.zooming = false;
            }, 200);

            const spaceSize = this.renderDomTarget.getBoundingClientRect();

            const change = e.deltaY / 100,
                previousScale = this.absoluteScale;

            this.scale -= change * this.scale * 0.1;
            this.absoluteScale -= change * this.absoluteScale * 0.1;

            const scaleChange = (this.absoluteScale / previousScale) - 1;

            this.pan.x -= ((e.clientX / spaceSize.width)
                * (spaceSize.width / (spaceSize.width * this.absoluteScale))) * spaceSize.width * scaleChange;

            this.pan.y -= ((e.clientY / spaceSize.height)
                * (spaceSize.height / (spaceSize.height * this.absoluteScale))) * spaceSize.height * scaleChange;

            if (this.showZoomHelper) {
                this.zoomHelper.element.style.width = (spaceSize.width * (this.absoluteScale / this.zoomHelper.scale)) + 'px';
                this.zoomHelper.element.style.height = (spaceSize.height * (this.absoluteScale / this.zoomHelper.scale)) + 'px';
                this.zoomHelper.element.style.left = (this.pan.x * this.absoluteScale) - (this.zoomHelper.x * this.absoluteScale) + 'px';
                this.zoomHelper.element.style.top = (this.pan.y * this.absoluteScale) - (this.zoomHelper.y * this.absoluteScale) + 'px';
            }

            //updateScaleSample();

        });

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
        this.camera.position.z = AU;
        //this.camera.position.x = EARTH.RADIUS * 2;
        //this.camera.position.y = EARTH.RADIUS * 60;
        //this.camera.rotation.x = -90 * Math.PI / 180;
        //window.C = this.camera;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        for (const thing of this.universe.bodies) {
            console.log(thing.size.x, thing.size.y, thing.size.z);
            thing.render = new THREE.Mesh(
                new THREE.CubeGeometry(thing.size.x, thing.size.y, thing.size.z),
                new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}) //, side:THREE.BackSide
            );
            this.scene.add(thing.render);
        }

        document.body.appendChild(this.renderer.domElement);

        const renderModel = new THREE.RenderPass(this.scene, this.camera),
            effectFilm = new THREE.FilmPass(0.35, 0.75, 2048, false);

        effectFilm.renderToScreen = true;

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(renderModel);
        this.composer.addPass(effectFilm);

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

        this.composer.render(delta);
        //this.renderer.render(this.scene, this.camera);
    }

}

const UNIT = units;

//What is the nature of reality?
const nature = undefined;

export { UNIT, nature, RealityException as Exception, Universe, Space, Law, Gravitation, Time, PhysicalDimension, Vector, CSSRenderer, ThreeRenderer, bigBang, createSolarSystem };
