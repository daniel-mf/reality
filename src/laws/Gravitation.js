import {Law} from "./Law";
import {Body} from "../Body";

class Gravitation extends Law {

    /**
     * @return {number}
     */
    static get G() {
        return 6.67384e-11;
    }


    happen(delta, universe) {

        const physicalDimensions = universe.physicalDimensions;

        for (const particle of universe.bodies) {

            if (!particle.mass) {
                continue;
            }

            if (particle instanceof Body) {
                for (const otherParticle of universe.bodies) {

                    if (!otherParticle.mass || particle === otherParticle) {
                        continue;
                    }

                    const differences = otherParticle.position.sub(particle.position);
                    const distanceSquared = otherParticle.position.distanceToSquared(particle.position);
                    const distance = otherParticle.position.distanceTo(particle.position);

                    if (distance > 10 + 10) {

                        const totalForce = (otherParticle.mass / distanceSquared);
                        const forceVector = new universe.Vector();

                        for (const [n] of forceVector) {
                            particle.velocity[n] += (((totalForce * differences[n] / distance) * Gravitation.G) * delta);
                        }

                    } else {
                        for (const [n] of differences) {
                            const velocity = (particle.mass * particle.velocity[n]
                                + otherParticle.mass * otherParticle.velocity[n]) / (particle.mass + otherParticle.mass);
                            particle.velocity[n] = velocity;
                            otherParticle.velocity[n] = velocity;

                        }
                    }

                }
            }
        }

        return delta;
    }

}

export {Gravitation};