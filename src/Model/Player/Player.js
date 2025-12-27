import {
	validateName,
	validateNumber,
	validateType,
} from "../../Utils/validateInput";
import { Ship, GameSettings } from "../../Model/index";
import { ArenaController } from "../../Controller/index";

export class Player {
	#name;
	#points;
	#ships;
	#turns;
	#damage;
	#controller;

	constructor({
		name = "Player",
		points = 0,
		ships = GameSettings.getNewFleet(),
		turns = 0,
		damage = 1,
		controller = new ArenaController({ size: 7 }),
	} = {}) {
		this.name = name;
		this.points = points;
		this.ships = ships;
		this.turns = turns;
		this.damage = damage;
		this.controller = controller;
	}

	attackArena(blockLoc, targetPlayer) {
		validateType(targetPlayer, "Targeted Player", Player);

		targetPlayer.controller.receiveAttack(blockLoc, this.#damage);
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
		arr.forEach((ship) => {
			validateType(ship, "Ship", Ship);
		});

		this.#ships = arr;
	}

	set turns(totalTurns) {
		validateNumber(totalTurns, "Player turns", "Integer");
		if (totalTurns < 0) throw new Error("Total turns must be > 0");
		this.#turns = totalTurns;
	}

	set controller(obj) {
		validateType(obj, "Object", ArenaController);
		this.#controller = obj;
		this.#controller.arena.ships = this.#ships;
	}

	set damage(value) {
		validateNumber(value, "Damage value", "Integer");
		if (value < 0) value = 0;

		this.#damage = value;
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
	get controller() {
		return this.#controller;
	}
	get damage() {
		return this.#damage;
	}
}
