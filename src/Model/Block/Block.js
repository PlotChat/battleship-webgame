import { validateType, validateNumber } from '../../Utils/validateInput'

export class Block{
    #x;
    #y;
    #isShipLoc;
    #isHit;

    constructor(x = 0, y = 'A', isShipLoc = false){
        this.x = x;
        this.y = y;
        this.isShipLoc = isShipLoc;
        this.#isHit = false;
    }

    set x(value){
        validateNumber(value, "X value", "Integer");
        this.#x = value;
    }

    set y(value){
        validateType(value, "Y value", String);
        this.#y = value;
    }

    set isShipLoc(value){
        this.#isShipLoc = value;
    }

    set isHit(value){
        this.#isHit = value;
    }

    get x() { return this.#x };
    get y() { return this.#y };
    get isShipLoc() { return this.#isShipLoc };
    get isHit() { return this.#isHit };
}