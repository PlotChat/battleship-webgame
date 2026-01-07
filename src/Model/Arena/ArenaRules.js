import { Block } from "../Block";
import { validateType } from "../../Utils/validateInput";

export class ArenaRules {
	// Checks if a location is not of any placed ships
	static isAvailableShipLoc(arena, blockLoc) {
		const ships = arena.ships;

		for (let i = 0; i < ships.length; i++) {
			const ship = ships[i];
			const locations = ship.location;

			for (let j = 0; j < locations.length; j++) {
				const loc = locations[j];

				if (loc.x === blockLoc.x && loc.y === blockLoc.y) {
					return false;
				}
			}
		}
		return true;
	}

	static validateShipList(arena, shipList) {
		shipList.forEach((ship) => {
			this.validateShip(arena, ship);
		});
	}

    static validateShip(arena, ship){
        if (ship.location.length == 0) return;

			ship.location.forEach((loc) => {
				validateType(loc, "Object", Block);
			});

			let isAdjacent = this.isAdjacentShip(ship.location);
			let isOnGrid = this.isOnGridShip(arena, ship.location);
            let isAvailable = true;
            
            for(let i = 0; i < ship.location.length; i++){
                const loc = ship.location[i];
                
                if(!this.isAvailableShipLoc(arena, loc)){
                    isAvailable = false;
                    return;
                }
            }

			if (!isAdjacent)
				throw new Error("Location(s) of a ship must be adjacent");
			if (!isOnGrid)
				throw new Error("Location(s) of a ship must be on the grid");
            if (!isAvailable)
				throw new Error("Location(s) of a ship is already of another ship");
    }

	static isAdjacentShip(ship) {
		if (ship.length <= 1) return true;

		for (let i = 1; i < ship.length; i++) {
			const prev = ship[i - 1];
			const curr = ship[i];

			// 1. Calculate the gaps correctly
			// We use charCodeAt only for Y because it is a letter
			const gapX = Math.abs(curr.x - prev.x);
			const gapY = Math.abs(curr.y.charCodeAt(0) - prev.y.charCodeAt(0));

			// 2. The Battleship Adjacency Rule:
			// One coordinate MUST change by 1, the other MUST change by 0.
			// Therefore, the sum of gaps must be EXACTLY 1.
			if (gapX + gapY !== 1) return false;
		}

		// 3. Final Check: Ensure the ship is a straight line (not an 'L' shape)
		const isHorizontal = ship.every((loc) => loc.y === ship[0].y);
		const isVertical = ship.every((loc) => loc.x === ship[0].x);

		return isHorizontal || isVertical;
	}

	static isOnGridShip(arena, ship) {
		const charIndex = "A".charCodeAt(0);
		const gridSize = arena.size;

		for (const loc of ship) {
			if (
				loc.x > gridSize - 1 ||
				loc.y.charCodeAt(0) - charIndex > gridSize - 1
			)
				return false;
		}

		return true;
	}

	static isFromShipLoc(arena, blockLoc){
		validateType(blockLoc, "Block", Block);

		return arena.ships.some(ship => {
			return ship.location.some(loc => {
				if(blockLoc.x === loc.x && blockLoc.y === loc.y){
					return true;
				}
			})
		})
	}
}
