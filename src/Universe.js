import {Dimension} from "./dimensions/Dimension";
import {Law} from "./laws/Law";
import {PhysicalDimension} from "./dimensions/PhysicalDimension";
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

export {Universe};