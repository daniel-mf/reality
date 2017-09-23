import {AU} from "../../../lib/Units";

const SUN = {
    MASS: 1.98855 * 10 ** 30,
    RADIUS: 696000000,
};

const EARTH = {
    MASS: 5.9736e+24,
    RADIUS: 6378000.137,
    DISTANCE_TO_SUN: AU,
    VELOCITY: {
        y: 30000 //Random guess...
    }
};

const MOON = {
    MASS: 7.347550162055999e+22,
    RADIUS: 1738000,
    DISTANCE_TO_SUN: AU - 384400000
};

export {SUN, EARTH, MOON};