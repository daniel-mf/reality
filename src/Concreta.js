import {Thing} from "./Thing";

class Concreta extends Thing {

    constructor() {
        super();
        /**
         * @type {Thing[]}
         */
        this.things = [];
    }

    /**
     * @param {Thing} any
     * @returns {Thing}
     */
    add(...any) {
        this.things.push(...any);
        return this;
    }

    /**
     * @param {Thing} any
     * @returns {Thing}
     */
    remove(...any) {
        for (const thing of any) {
            const thingIndex = this.things.indexOf(thing);
            if (thingIndex >= 0) {
                this.things.splice(thingIndex, 1);
            }
        }
        return this;
    }

    happen(delta, parentThing) {
        delta = super.happen(delta, parentThing);
        for (const thing of this.things) {
            delta = thing.happen(delta, this);
        }
        return delta;
    }

}

export {Concreta};