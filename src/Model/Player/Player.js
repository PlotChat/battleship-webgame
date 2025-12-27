import { validateName, validateNumber, validateType } from "../../Utils/validateInput";
import { ArenaController } from '../../Controller/index';
import { Ship, Arena } from "../../Model/index";

export class Player {
	#name;
	#points;
	#ships;
	#turns;
	#damage;
	#controller = null;

	constructor({ name = "Player", points = 0, ships = [], turns = 0, damage = 1 } = {}) {
		this.name = name;
		this.points = points;
		this.ships = ships;
		this.turns = turns;
		this.damage = damage;
	}

	attackArena(blockLoc, target){
		validateType(target, "Target arena", ArenaController);

		target.receiveAttack(blockLoc, this.#damage);
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
		arr.forEach(ship => {
			validateType(ship, "Ship", Ship);
		})

		this.#ships = arr;
	}

	set turns(totalTurns) {
		validateNumber(totalTurns, "Player turns", "Integer");
		if (totalTurns < 0) throw new Error("Total turns must be > 0");
		this.#turns = totalTurns;
	}

	set controller(obj) {
		validateType(obj, "Object", Arena);
		this.#controller = obj;
	}

	set damage(value){
		validateNumber(value, "Damage value", "Integer");
		if(value < 0) value = 0;

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
	get damage(){
		return this.#damage;
	}
}
