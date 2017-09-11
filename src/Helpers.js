import {Universe} from "./Universe";
import {PhysicalDimension} from "./dimensions/PhysicalDimension";
import {Time} from "./dimensions/Time";
import {Gravitation} from "./laws/Gravitation";
import {Motion} from "./laws/Motion";
import {Space} from "./Space";
import {EARTH, MOON, SUN} from "./extra/data/milkyWay/solarSystem";
import {AU} from "./lib/Units";

function createSolarSystem({sunEarthMoon = true} = {sunEarthMoon: true}) {
    const universe = bigBang();

    const sun = new universe.Body({
        mass: SUN.MASS,
        size: new universe.Vector({
            x: SUN.RADIUS * 2,
            y: SUN.RADIUS * 2,
            z: SUN.RADIUS * 2
        })
    });

    const earth = new universe.Body({
        mass: EARTH.MASS,
        size: new universe.Vector({
            x: EARTH.RADIUS * 2,
            y: EARTH.RADIUS * 2,
            z: EARTH.RADIUS * 2
        }),
        position: new universe.Vector({
            z: AU,
        })
    });

    const moon = new universe.Body({
        mass: MOON.MASS,
        size: new universe.Vector({
            x: MOON.RADIUS * 2,
            y: MOON.RADIUS * 2,
            z: MOON.RADIUS * 2
        }),
        position: new universe.Vector({
            x: 7900000,
            z: AU - MOON.DISTANCE_TO.EARTH,
        }),
        velocity: new universe.Vector({
            x: 0
        })
    });

    universe.add(sun);
    universe.add(earth);
    universe.add(moon);

    return universe;
}

function bigBang() {
    return new Universe(
        new Space().add(
            new Time(),
            new PhysicalDimension('x'),
            new PhysicalDimension('y'),
            new PhysicalDimension('z')
        ),
        new Motion(),
        new Gravitation()
    );
}

export {bigBang, createSolarSystem};