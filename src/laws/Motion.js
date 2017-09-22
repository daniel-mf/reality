import {Law} from "./Law";

class Motion extends Law {

    happen() {

        const physicalDimensions = this.universe.space.physicalDimensions;

        for (const thing of this.universe.things) {
            if (thing instanceof this.universe.Body) {
                //console.log(thing.eventDelta);
                for (const {name: dimensionName} of physicalDimensions) {
                    thing.position[dimensionName] = thing.position[dimensionName] + (thing.velocity[dimensionName]);
                }
            }
        }

    }

}

export {Motion};