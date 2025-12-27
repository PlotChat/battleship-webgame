import { Ship } from  '../Ship';

export class Destroyer extends Ship {
	constructor() {
		super({ name: "Destroyer", length: 2, health: 2 });
	}
}
