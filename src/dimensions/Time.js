import {Dimension} from "./Dimension";

class Time extends Dimension {

    constructor() {
        super('t');

        this.startTime = performance.now();
        this.oldTime = this.startTime;
        this._elapsedTime = 0;

        this.speed = 1;

        this.relativeToSpace = true;

    }

    get elapsedTime() {
        this.delta;
        return this._elapsedTime;
    }

    get delta() {
        const newTime = performance.now(),
            diff = ( newTime - this.oldTime ) / 1000;

        this.oldTime = newTime;
        this._elapsedTime += diff;

        return diff * this.speed;
    }

    /**
     * @param {Number} delta
     */
    happen(delta) {
        //makes parent universe happen repeatedly, reducing its delta
        setTimeout(() => this.universe.happen(), 1000 / 60);
        return this.delta;
    }

}

export {Time};