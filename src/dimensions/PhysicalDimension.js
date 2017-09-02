import {Dimension} from "./Dimension";

class PhysicalDimension extends Dimension {

    happen(delta, universe) {
        return delta;
    }

}

export {PhysicalDimension};