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

export {Space};