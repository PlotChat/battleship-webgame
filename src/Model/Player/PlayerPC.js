import { ArenaController } from "../../Controller/ArenaController";
import { ArenaRules } from "../Arena";
import { Block } from "../Block";
import { GameSettings } from "../Game";
import { Player } from "./Player";
import { Ship } from "../Ship";

export class PlayerPC extends Player {
	constructor({
		name = "Player",
		points = 0,
		turns = 0,
		damage = 1,
		controller = new ArenaController({ size: 7 }),
		ownedShips = GameSettings.getNewFleet(),
	} = {}) {
		super({
			name: name,
			points: points,
			turns: turns,
			damage: damage,
			controller: controller,
			ownedShips: ownedShips,
		});

		// Add random ships for PlayerPC
		this.ownedShips.forEach((ship) => {
			let placed = false;

			while (!placed) {
				let tempLocs = [];

				// 1. Pick a random START coordinate (0-6)
				const startX = Math.floor(Math.random() * this.controller.arena.size);
				const startYNum = Math.floor(
					Math.random() * this.controller.arena.size
				);

				// 2. Pick a fixed direction
				const isVertical = Math.random() > 0.5;

				// 3. Build the ship out
				for (let i = 0; i < ship.size; i++) {
					const currentX = isVertical ? startX : startX + i;
					const currentYNum = isVertical ? startYNum + i : startYNum;

					// Ensure Y is a Letter (0 -> A, 1 -> B)
					const currentY = String.fromCharCode(65 + currentYNum);

					// Pass currentX (the number) and currentY (the string)
					tempLocs.push(new Block(currentX, currentY, true));
				}

				// 4. Validate and Save
				const tempShip = new Ship({ location: tempLocs });
				try {
					ArenaRules.validateShip(this.controller.arena, tempShip);
					ship.location = tempLocs;
					this.controller.arena.ships.push(ship);
					placed = true;

					this.controller.arena.grid.forEach((block) => {
                        tempLocs.forEach(loc => {
                            if(block.x == loc.x && block.y == loc.y){
                                block.isShipLoc = true;
                            }
                        })
                    });
				} catch (e) {
					// Overlap or Out of Bounds, try again
				}
			}
		});
	}
}
