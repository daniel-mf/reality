import {Law} from "./laws/Law";
import {Thing} from "./Thing";
import {Concreta} from "./Concreta";
import {Vector} from "./lib/Vector";
import {Body} from "./Body";
import {Space} from "./Space";
import {RealityException} from "./lib/RealityException";

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

        if (!this.observer) {
            console.warn('Universe has no observer');
        }

    }
}

export {Universe};