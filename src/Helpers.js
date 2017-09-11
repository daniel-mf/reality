import {Universe} from "./Universe";
import {PhysicalDimension} from "./dimensions/PhysicalDimension";
import {Time} from "./dimensions/Time";
import {Gravitation} from "./laws/Gravitation";
import {Motion} from "./laws/Motion";
import {Space} from "./Space";

function bigBang() {
    return new Universe(
        new Space().add(
            new Time(),
            new PhysicalDimension('x'),
            new PhysicalDimension('y'),
            new PhysicalDimension('z')
        ),
        new Motion(),
        new Gravitation()
    );
}

export {bigBang};