import { validateName } from '../../Utils/validateName';

export class Player {
	#name = "Player";
	#points = 0;
	#ships;
	#turns;

	constructor({ name, points, ships, turns } = {}) {
		this.name = name;
		this.points = points;
		this.ships = ships;
		this.turns = turns;
	}

	set name(username) {
		validateName(username, "User name");
        this.#name = username;
	}

    set turns(totalTurns) {
        if(totalTurns <= 0)
            throw new Error("Total turns must be > 0");
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
    get turns(){
        return this.#turns;
    }
}
