/**
 * All the units are metre scaled
 */

/**
 * Speed of light in vacuum in metres per second
 * @type {number}
 */
export const c = 299792458;

/**
 * Julian year
 * @type {number}
 */
export const a = 365.25;

/**
 * light-year
 * @type {number}
 */
export const ly = c * a * 86400;

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
export const AU = 149597870700;

/**
 * parsec
 * @type {number}
 */
export const pc = 206264.806247096 * AU;

/**
 * kiloparsec
 * @type {number}
 */
export const kpc = 1000 * pc;

/**
 * megaparsec
 * @type {number}
 */
export const Mpc = 1000000 * pc;

/**
 * gigaparsec
 * @type {number}
 */
export const Gpc = 1000000000 * pc;

/**
 * The gravitational constant
 * @type {number}
 */
export const G = 6.67384e-11;