import {Universe} from "./Universe";
import {PhysicalDimension} from "./dimensions/PhysicalDimension";
import {Time} from "./dimensions/Time";
import {Gravitation} from "./laws/Gravitation";
import {Motion} from "./laws/Motion";
import {Space} from "./Space";
import {EARTH, MARS, MOON, SUN} from "./extra/data/milkyWay/solarSystem";

function createSolarSystem({sunEarthMoon = true} = {sunEarthMoon: true}) {
    const universe = bigBang();

    const sun = new universe.Body({
        name: 'Sun',
        mass: SUN.MASS,
        size: new universe.Vector({
            x: SUN.RADIUS * 2,
            y: SUN.RADIUS * 2,
            z: SUN.RADIUS * 2
        })
    });
    universe.add(sun);

    const earth = new universe.Body({
        name: 'Earth',
        mass: EARTH.MASS,
        size: new universe.Vector({
            x: EARTH.RADIUS * 2,
            y: EARTH.RADIUS * 2,
            z: EARTH.RADIUS * 2
        }),
        position: new universe.Vector({
            x: EARTH.DISTANCE_TO_SUN,
        }),
        velocity: new universe.Vector(EARTH.VELOCITY)
    });
    universe.add(earth);

    const moon = new universe.Body({
        name: 'Moon',
        mass: MOON.MASS,
        size: new universe.Vector({
            x: MOON.RADIUS * 2,
            y: MOON.RADIUS * 2,
            z: MOON.RADIUS * 2
        }),
        position: new universe.Vector({
            x: MOON.DISTANCE_TO_SUN,
        }),
        velocity: new universe.Vector(MOON.VELOCITY)
    });
    universe.add(moon);

    const mars = new universe.Body({
        name: 'Mars',
        mass: MARS.MASS,
        size: new universe.Vector({
            x: MARS.RADIUS * 2,
            y: MARS.RADIUS * 2,
            z: MARS.RADIUS * 2
        }),
        position: new universe.Vector({
            x: MARS.DISTANCE_TO_SUN,
        }),
        velocity: new universe.Vector(MARS.VELOCITY)
    });
    universe.add(mars);

    const ball = new universe.Body({
        name: 'ball',
        mass: 10,
        size: new universe.Vector({
            x: 1,
            y: 1,
            z: 1,
        }),
        position: new universe.Vector({
            x: EARTH.DISTANCE_TO_SUN,
            y: EARTH.RADIUS + .5
        }),
    });
    universe.add(ball);

    universe.observer = ball;

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
        new Gravitation(),
        new Motion()
    );
}

export {bigBang, createSolarSystem};