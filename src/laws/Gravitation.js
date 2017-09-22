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


    happen(delta) {

        for (const particle of this.universe.bodies) {

            const particleEventDelta = particle.getSelfEventDelta(delta);

            if (!particle.isMassive) {
                continue;
            }

            if (particle instanceof Body) {

                for (const otherParticle of this.universe.bodies) {

                    if (!otherParticle.isMassive || particle === otherParticle) {
                        continue;
                    }

                    const differences = otherParticle.position.sub(particle.position);
                    const distanceSquared = otherParticle.position.distanceToSquared(particle.position);
                    const distance = otherParticle.position.distanceTo(particle.position);

                    if (distance > 10 + 10) {

                        const totalForce = (otherParticle.mass / distanceSquared);
                        const forceVector = new this.universe.Vector();

                        for (const [n] of forceVector) {
                            particle.velocity[n] += (((totalForce * differences[n] / distance) * Gravitation.G)); //should apply delta?
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