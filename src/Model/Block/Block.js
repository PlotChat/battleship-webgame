import { validateType, validateNumber } from '../../Utils/validateInput'

export class Block{
    #x;
    #y;

    constructor(x = 0, y = 'A'){
        this.x = x;
        this.y = y;
    }

    set x(value){
        validateNumber(value, "X value", "Integer");
        this.#x = value;
    }

    set y(value){
        validateType(value, "Y value", String);
        this.#y = value;
    }

    get x() { return this.#x };
    get y() { return this.#y };
}