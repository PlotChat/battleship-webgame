import { Ship } from  '../Ship';

export class Cruiser extends Ship {
	constructor() {
		super({ name: "Cruiser", length: 3 });
	}
}