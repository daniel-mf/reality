import {Law} from "./Law";

class Motion extends Law {

    happen(delta, universe) {

        const physicalDimensions = universe.physicalDimensions;

        for (const thing of universe.things) {
            if (thing instanceof universe.Body) {
                for (const {name: dimensionName} of physicalDimensions) {
                    thing.position[dimensionName] = thing.position[dimensionName] + (thing.velocity[dimensionName] * delta)
                }
            }
        }

        return delta;
    }

}

export {Motion};