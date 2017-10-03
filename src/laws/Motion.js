import {Law} from "./Law";

class Motion extends Law {

    happen() {
        const physicalDimensions = this.universe.space.physicalDimensions;

        const targetChange = new this.universe.Vector();

        if (this.universe.target) {
            const body = this.universe.target;
            for (const {name: dimensionName} of physicalDimensions) {
                targetChange[dimensionName] = -(body.velocity[dimensionName] * body.eventDelta);
            }
        }

        for (const body of this.universe.bodies) {

            if (this.universe.target !== body) {
                for (const {name: dimensionName} of physicalDimensions) {
                    body.position[dimensionName] =
                        targetChange[dimensionName]
                        + body.position[dimensionName]
                        + (body.velocity[dimensionName] * body.eventDelta);

                }
            }

        }

    }

}

export {Motion};