import { validateName, validateNumber } from "../../Utils/validateInput";

export class Ship {
	#name;
	#length;

	constructor({ name = "Default", length = 1 } = {}) {
		this.name = name;
		this.length = length;
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

	get name() {
		return this.#name;
	}
	get length() {
		return this.#length;
	}
}
