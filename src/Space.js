import {Concreta} from "./Concreta";
import {PhysicalDimension} from "./dimensions/PhysicalDimension";
import {a, c, G} from "./lib/Units";

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

                const otherBodies = this.universe.bodies.filter(otherBody => otherBody !== body);

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

                //...

                const vars = {};

                const sum = callback => {
                    let total = 0;
                    for (const item of this.universe.bodies) {
                        total += callback(item);
                    }
                    return total;
                };

                //represents the sum of the Newtonian gravitational potentials due to the masses in the neighborhood,
                // based on their distances r__i from the clock. This sum includes any tidal potentials.
                vars['GM__i'] = (this.universe.bodies.map(body => body.gravitationalPotential)).reduce((s, v) => s + v);

                //coordinate time
                vars['t__c'] = '?';

                //a small increment in the coordinate t__c (coordinate time)
                vars['dt__c'] = '';

                vars['dx'] = body.velocity.x;
                vars['dy'] = body.velocity.y;
                vars['dz'] = body.velocity.z;

                //https://wikimedia.org/api/rest_v1/media/math/render/svg/81b6d301d76e41909037ad427d9f31cd6cd4e607
                vars['dt_2_E'] = (

                    (
                        1 -
                        sum(i =>
                            2 * i.gravitationalPotential
                            / i.position.distanceTo(body.position) * c ** 2
                        )
                    )

                    *

                    vars['dt__c'] ** 2

                    -

                    (
                        1 -
                        sum(i =>
                            2 * i.gravitationalPotential
                            / i.position.distanceTo(body.position) * c ** 2
                        )
                    )

                    ** -1

                    *

                    vars['dx'] ** 2 + vars['dy'] ** 2 + vars['dz'] ** 2
                    / c ** 2

                );

                // console.log(vars['dt_2_E']);

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