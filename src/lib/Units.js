/**
 * All the units are metre scaled
 */

/**
 * Pi
 * @type {number}
 */
export const Pi = 3.1415926535897932384626433832795028841968;

/**
 * Speed of light in vacuum
 * @unit m/s
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

/**
 * Standard gravity
 * @unit m/s²
 * @type {number}
 */
export const g = 9.80665;

/**
 * kilogram
 * @type {number}
 */
export const kg = 0; //TODO define masss of 1 kg

/**
 * Metre
 * @unit length
 * @type {number}
 */
export const m = 1 / c;

/**
 * planck constant
 * @unit Js
 * @type {number}
 */
export const h = 6.626070040 * 10 ** -34;

/**
 * minus charge of electron
 * @unit As
 * @type {number}
 */
export const e = 1.602189e-19;

/**
 * proton mass
 * @unit kg
 * @type {number}
 */
export const m_p = 1.672621898 * 10 ** -27;

/**
 * electron mass
 * @unit kg
 * @type {number}
 */
export const m_e = 9.10938356 * 10 ** -31;

/**
 * neutron mass
 * @unit kg
 * @type {number}
 */
export const m_n = 1.674927471 * 10 ** -27;

/**
 * Avogadro
 * @unit 1/mol
 * @type {number}
 */
export const N_A = 6.02205e+23;

/**
 * Square root of 2
 * @type {number}
 */
export const SQRT2 = 1.41421356237309504880168872420969807857;

/**
 * Boltzmann constant
 * @unit
 * @type {number}
 */
export const k_B = 1.38066e-23;