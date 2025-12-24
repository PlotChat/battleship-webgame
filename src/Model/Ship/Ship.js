import { validateName } from '../../Utils/validateName';

export class Ship{
    #name = null;
    #length = 0;

    constructor({name, length} = {}){
        this.name = name;
        this.length = length;
    }

    set name(shipName) { 
        validateName(shipName);
        this.#name = shipName;
    }

    set length(shipLength) {
        this.#length = shipLength;
    }

    get name() { return this.#name };
    get length() { return this.#length };
}