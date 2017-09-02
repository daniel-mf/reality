import {Dimension} from "./Dimension";

class Time extends Dimension {

    constructor() {
        super('t');

        this.startTime = performance.now();
        this.oldTime = this.startTime;
        this._elapsedTime = 0;

    }

    get elapsedTime() {
        this.delta;
        return this._elapsedTime;
    }

    get delta() {
        const newTime = ( typeof performance === 'undefined' ? Date : performance ).now(),
            diff = ( newTime - this.oldTime ) / 1000;

        this.oldTime = newTime;
        this._elapsedTime += diff;

        return diff;
    }

    /**
     * @param {Number} delta
     * @param {Thing} parentThing
     */
    happen(delta, parentThing) {
        //makes parent thing happen repeatedly, reducing its delta
        requestAnimationFrame(() => parentThing.happen());
        return this.delta;
    }

}

export {Time};