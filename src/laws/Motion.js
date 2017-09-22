import {Law} from "./Law";

class Motion extends Law {

    happen(delta) {

        const physicalDimensions = this.universe.space.physicalDimensions;

        for (const thing of this.universe.things) {
            if (thing instanceof this.universe.Body) {

                const thingEventDelta = thing.getSelfEventDelta(delta);

                for (const {name: dimensionName} of physicalDimensions) {
                    thing.position[dimensionName] = thing.position[dimensionName] + (thing.velocity[dimensionName] * thingEventDelta);
                }
            }
        }

        return delta;
    }

}

export {Motion};