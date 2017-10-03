import {Concreta} from "./Concreta";
import {PhysicalDimension} from "./dimensions/PhysicalDimension";
import {a} from "./lib/Units";

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

            let eventDeltaDilation = 1;

            //The observer should have no dilation at all
            if (body !== observer) {

                /*
                    Each body has:

                    body.mass
                    body.gravitationalPotential (2 * G * this.mass) Is that right?
                    body.position.(x,y,z)
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

export {Space};