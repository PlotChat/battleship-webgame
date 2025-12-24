import { validateName, validateNumber, validateType } from "../../Utils/validateInput";
import { Ship } from "../Ship";

export class Player {
	#name;
	#points;
	#ships;
	#turns;

	constructor({ name = "Player", points = 0, ships = [], turns = 0 } = {}) {
		this.name = name;
		this.points = points;
		this.ships = ships;
		this.turns = turns;
	}

	set name(username) {
		validateName(username, "User name");
		this.#name = username;
	}

	set points(value) {
		validateNumber(value, "Player points", "Integer");
		if (value < 0) throw new Error("Points must be >= 0");
		this.#points = value;
	}

	set ships(arr) {
		validateType(arr, "Ship list", Array);
		arr.find(ship => {
			validateType(ship, "Ship", Ship);
		})
		this.#ships = arr;
	}

	set turns(totalTurns) {
		validateNumber(totalTurns, "Player turns", "Integer");
		if (totalTurns < 0) throw new Error("Total turns must be > 0");
		this.#turns = totalTurns;
	}

	get name() {
		return this.#name;
	}
	get points() {
		return this.#points;
	}
	get ships() {
		return this.#ships;
	}
	get turns() {
		return this.#turns;
	}
}
