import {Law} from "./Law";
import {Body} from "../Body";
import {G} from "../lib/Units";

class Gravitation extends Law {

    /**
     * @return {number}
     */
    static get G() {
        return G;
    }


    happen() {

        for (const body of this.universe.bodies) {

            if (!body.isMassive) {
                continue;
            }

            if (body instanceof Body) {

                for (const otherBody of this.universe.bodies) {

                    if (!otherBody.isMassive || body === otherBody) {
                        continue;
                    }

                    const differences = otherBody.position.sub(body.position);
                    const distanceSquared = otherBody.position.distanceToSquared(body.position);
                    const distance = otherBody.position.distanceTo(body.position);

                    if (distance > body.size.x + otherBody.size.x) {

                        const totalForce = (otherBody.mass / distanceSquared);
                        const forceVector = new this.universe.Vector();

                        for (const [n] of forceVector) {
                            forceVector[n] += (((totalForce * differences[n] / distance) * Gravitation.G * body.eventDelta)); //should apply delta?
                        }

                        body.applyForce(forceVector);

                    } else {
                        for (const [n] of differences) {
                            const velocity = (body.mass * body.velocity[n]
                                + otherBody.mass * otherBody.velocity[n]) / (body.mass + otherBody.mass);
                            body.velocity[n] = velocity;
                            otherBody.velocity[n] = velocity;
                        }
                    }

                }
            }
        }
    }

}

export {Gravitation};