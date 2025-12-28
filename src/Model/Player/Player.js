import {
	validateName,
	validateNumber,
	validateType,
} from "../../Utils/validateInput";
import { ArenaController } from "../../Controller/ArenaController";
import { GameSettings } from "../Game";

export class Player {
	#name;
	#points;
	#turns;
	#damage;
	#ownedShips;
	#controller;

	constructor({
		name = "Player",
		points = 0,
		turns = 0,
		damage = 1,
		controller = new ArenaController({ size: 7 }),
		ownedShips = GameSettings.getNewFleet(),
	} = {}) {
		this.name = name;
		this.points = points;
		this.turns = turns;
		this.damage = damage;
		this.controller = controller;
		this.ownedShips = ownedShips;
	}

	attackArena(blockLoc, targetPlayer) {
		validateType(targetPlayer, `Targeted Player`, Player);

		// Returns true / false to know whether its a hit
		return targetPlayer.controller.receiveAttack(blockLoc, this.#damage);
	}

	set name(username) {
		validateName(username, "A player's user name");
		this.#name = username;
	}

	set points(value) {
		validateNumber(value, `Player: ${this.name}'s points`, "Integer");
		if (value < 0) throw new Error("Points must be >= 0");
		this.#points = value;
	}

	set turns(totalTurns) {
		validateNumber(totalTurns, "Player turns", "Integer");
		if (totalTurns < 0) throw new Error(`Player: ${this.name}'s total turns must be > 0`);
		this.#turns = totalTurns;
	}

	set controller(obj) {
		validateType(obj, "Object", ArenaController);
		this.#controller = obj;
	}

	set damage(value) {
		validateNumber(value, `Player: ${this.name}'s damage value`, "Integer");
		if (value < 0) value = 0;

		this.#damage = value;
	}

	set ownedShips(ships) {
		validateType(ships, "Owned ships", Array);
		if(ships == 0) throw Error(`Player: ${this.name} must have at least a ship`);

		this.#ownedShips = ships;
	}

	get name() {
		return this.#name;
	}
	get points() {
		return this.#points;
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
	get ownedShips() {
		return this.#ownedShips;
	}
}
