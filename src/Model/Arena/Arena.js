import { validateNumber, validateType } from "../../Utils/validateInput";
import { ArenaRules } from "./ArenaRules";
import { Block } from "../Block";
import { Ship } from "../Ship";

export class Arena {
	#size;
	#ships;
	#grid;

	constructor({ size = 0, ships = [] } = {}) {
		this.size = size;
		this.makeGrid(this.#grid, this.size);
		this.ships = ships;
	}

	makeGrid() {
		const gridTemp = [];
		const charIndex = "A".charCodeAt(0);

		for (let i = 0; i < this.#size; i++) {
			for (let j = 0; j < this.#size; j++) {
				const curX = i;
				const curY = String.fromCharCode(charIndex + j);

				const cur = new Block(curX, curY);

				gridTemp.push(cur);
			}
		}

		this.#grid = [...gridTemp];
	}

	set ships(shipList) {
		validateType(shipList, "Ship list", Array);
		ArenaRules.validateShipList(this, shipList);

		this.#ships = shipList;
	}

	set size(value) {
		validateNumber(value, "Grid size", "Integer");
		if (value < 7) throw new Error("Grid size must be >= 7");

		this.#size = value;
	}

    removeShip(ship) {
        validateType(ship, "Ship", Ship);
        
        const index = this.#ships.findIndex(curr => {
            if (curr.location.length === 0 || ship.location.length === 0) return false;
            
            return curr.location[0].x === ship.location[0].x && 
                curr.location[0].y === ship.location[0].y;
        });

        if(index === -1) throw new Error("Ship not available to be removed");

		ship.location.forEach(block => {
			block.isShipLoc = false;
        })

        this.#ships.splice(index, 1);
    }

	addShip(ship) {
		validateType(ship, "Ship", Ship);
        ArenaRules.validateShip(this, ship);

		ship.location.forEach(block => {
			block.isShipLoc = true;
        })
        
        this.#ships.push(ship);
	}

	findBlock(x, y){
		return this.#grid.find(currentBlock => {
            return currentBlock.x === x && currentBlock.y === y;
        });
	}

	findShip(ship){
		validateType(ship, "Ship", Ship);
		return this.#ships.find(currentShip => {
            return currentShip === ship;
        });
	}

	get size() {
		return this.#size;
	}
	get ships() {
		return this.#ships;
	}
	get grid() {
		return this.#grid;
	}
}
