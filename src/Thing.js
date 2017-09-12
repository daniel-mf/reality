import {Universe} from "./Universe";

class Thing {

    constructor() {

        /**
         * @type {Universe}
         * @private
         */
        this._universe = null;

        /**
         * @type {Thing}
         * @private
         */
        this._parentThing = null;

        /**
         * Dilatation to time delta
         * @type {number}
         */
        this.eventDeltaDilatation = 1;

    }

    getSelfEventDelta(delta) {
        return delta * this.eventDeltaDilatation;
    }

    /**
     * @param {Number} delta
     * @returns {Number}
     */
    happen(delta) {
        return delta;
    }

    /**
     * @returns {Thing}
     */
    get parentThing() {
        return this._parentThing;
    }

    /**
     * @param {Thing} thing
     */
    set parentThing(thing) {
        this._universe = null;
        this._parentThing = thing;
    }

    /**
     * @returns {Universe}
     */
    get universe() {

        if (this._universe) {
            return this._universe;
        }

        let thing = this.parentThing;
        while (thing && !(thing instanceof Universe)) {
            thing = thing.parentThing;
        }
        return this._universe = thing;
    }

}

export {Thing};
