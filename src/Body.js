import {Concreta} from "./Concreta";
import {G} from "./lib/Units";

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

export {Body};