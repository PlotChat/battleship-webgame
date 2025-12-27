import { Ship } from '../Ship';

export class Battleship extends Ship {
	constructor() {
		super({ name: "Battleship", length: 4, health: 4 });
	}
}