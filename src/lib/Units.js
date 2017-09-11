/**
 * All the units are metre scaled
 */

/**
 * Speed of light in vacuum in metres per second
 * @type {number}
 */
export const c = 299792458;

/**
 * light-year
 * @type {number}
 */
export const ly = c * 365.25 * 24 * 60 * 60;

/**
 * kilolight-year
 * @type {number}
 */
export const kly = 1000 * ly;

/**
 * megalight-year
 * @type {number}
 */
export const Mly = 1000000 * ly;

/**
 * gigalight-year
 * @type {number}
 */
export const Gly = 1000000000 * ly;

/**
 * Astronomical unit
 * @type {number}
 */
export const AU = 1.496 * 10 ** 11;

/**
 * The gravitational constant
 * @type {number}
 */
export const G = 6.67384e-11;

export const MASS = {
    SUN: 1.98855 * 10 ** 30,
    EARTH: 5.9736e+24,
    MOON: 7.347550162055999e+22
};

export const RADIUS = {
    SUN: 696000000,
    EARTH: 6378000.137,
    MOON: 1738000
};

//export const EARTH_ANGULAR_VELOCITY_METRES_PER_SECOND = 1.990986 * 10 ** -7;