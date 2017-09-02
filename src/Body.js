import {Concreta} from "./Concreta";

class Body extends Concreta {
    constructor({mass = 0}) {
        super();
        this.mass = mass;
    }
}

export {Body};