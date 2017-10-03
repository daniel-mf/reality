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
         * @type {Number}
         */
        this.eventDeltaDilation = 1;

        this.bornAt = Date.now();

        this._existenceTime = 0;

    }

    get eventDelta() {
        return this.universe._eventDelta * this.eventDeltaDilation;
    }

    /**
     * @returns {Number}
     */
    happen() {
        this._existenceTime += this.eventDelta * 1000;
    }

    get currentTime() {
        return this.bornAt + this._existenceTime;
    }

    get currentDate() {
        return new Date(this.currentTime);
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

        if (this instanceof Universe) {
            return this;
        }

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
