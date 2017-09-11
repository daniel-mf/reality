import {AU} from "../../../lib/Units";

const SUN = {
    MASS: 1.98855 * 10 ** 30,
    RADIUS: 696000000,
    POSITION: {x: 0, y: 0, z: 0}
};

const EARTH = {
    MASS: 5.9736e+24,
    RADIUS: 6378000.137,
    POSITION: {x: AU, y: 0, z: 0}
};

const MOON = {
    MASS: 7.347550162055999e+22,
    RADIUS: 1738000,
    POSITION: {x: 0, y: 0, z: 0}, //relative to earth?
    DISTANCE_TO: {
        EARTH: 384400000
    }
};

export {SUN, EARTH, MOON};