import { Ship } from '../Ship';

export class Carrier extends Ship {
	constructor() {
		super({ name: "Carrier", length: 3 });
	}
}