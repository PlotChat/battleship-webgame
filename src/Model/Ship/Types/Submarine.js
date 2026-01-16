import { Ship } from '../Ship';

export class Submarine extends Ship {
	constructor() {
		super({ name: "Submarine", length: 3 });
	}
}