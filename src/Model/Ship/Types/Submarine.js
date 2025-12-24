export class Submarine extends Ship {
	constructor() {
		super({ name: "Submarine", length: 3 });
	}
}

let s = new Submarine()

console.log(s);