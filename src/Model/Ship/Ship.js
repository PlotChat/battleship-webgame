import { validateName, validateNumber, validateType } from "../../Utils/validateInput";

export class Ship {
	#name;
	#length;
	#location;

	constructor({ name = "Default", length = 1 , location = []} = {}) {
		this.name = name;
		this.length = length;
		this.location = location;
	}

	set name(shipName) {
		validateName(shipName, "Ship name");
		this.#name = shipName;
	}

	set length(shipLength) {
		validateNumber(shipLength, "Ship length", "Integer");
		if (shipLength < 0) throw new Error("Ship length must be >= 0");
		this.#length = shipLength;
	}

	set location(locList){
		validateType(locList, "Ship location list", Array);
		this.#location = locList;
	}

	get name() {
		return this.#name;
	}
	get length() {
		return this.#length;
	}
	get location() {
		return this.#location;
	}
}
