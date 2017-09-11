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
        for (const thing of any) {
            thing.parentThing = this;
        }
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
                thing.parentThing = null;
            }
        }
        return this;
    }

    happen(delta) {
        delta = super.happen(delta);
        for (const thing of this.things) {
            delta = thing.happen(delta);
        }
        return delta;
    }

}

export {Concreta};