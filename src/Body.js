import {Concreta} from "./Concreta";

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

export {Body};