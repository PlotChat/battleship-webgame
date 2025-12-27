import { validateName, validateNumber, validateType } from "../../Utils/validateInput";

export class Ship {
	#name;
	#health;
	#length;
	#location;

	constructor({ name = "Default", length = 1 , location = [], health = 0} = {}) {
		this.name = name;
		this.length = length;
		this.location = location;
		this.health = health;
	}

	receiveDamage(value){
		validateNumber(value, "Damage", "Integer");
		if(value < 0) throw Error("Damage must be positive");
		
		if(value >= health){
			this.#health = 0;
		} else{
			this.#health -= value;
		}
	}

	set health(hp){
		validateNumber(hp, "Health", "Integer");
		if(hp < 0) throw new Error("Ship health must be positive");
		
		this.#health = hp;
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
	get health(){
		return this.#health;
	}
}
