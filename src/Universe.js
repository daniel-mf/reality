import {Dimension} from "./dimensions/Dimension";
import {Law} from "./laws/Law";
import {PhysicalDimension} from "./dimensions/PhysicalDimension";
import {Thing} from "./Thing";
import {Concreta} from "./Concreta";

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

export {Universe};