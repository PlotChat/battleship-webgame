import { ArenaController } from "../../Controller/ArenaController";
import { ArenaRules } from "../Arena";
import { Block } from "../Block";
import { GameSettings } from "../Game";
import { Player } from "./Player";
import { Ship } from "../Ship";

export class PlayerPC extends Player {
	constructor(
		name,
		points = 0,
		turns = 0,
		damage = 1,
		controller = new ArenaController({ size: 7 }),
		ownedShips = GameSettings.getNewFleet()
	) {
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

				// 1. Pick a random START block (0-6)
				const startX = Math.floor(Math.random() * this.controller.arena.size);
				const startYNum = Math.floor(
					Math.random() * this.controller.arena.size
				);

				// 2. Pick a fixed direction: 0 = Horizontal, 1 = Vertical
				const isVertical = Math.random() > 0.5;

				// 3. Build the ship out in a straight line
				for (let i = 0; i < ship.length; i++) {
					const currentX = isVertical ? startX : startX + i;
					const currentYNum = isVertical ? startYNum + i : startYNum;

					// Ensure Y is a Letter for your ArenaRules
					const currentY = String.fromCharCode(65 + currentYNum);

					tempLocs.push(new Block({ x: currentX, y: currentY }));
				}

				// 4. Validate and Save
				const tempShip = new Ship({ location: tempLocs });
				try {
					// Check if it's on grid and not overlapping others
					ArenaRules.validateShip(this.controller.arena, tempShip);

					ship.location = tempLocs;
					// IMPORTANT: Push to arena so the NEXT ship doesn't overlap this one
					this.controller.arena.ships.push(ship);
					placed = true;
				} catch (e) {
					// If it hits a wall or another ship, the 'while' loop tries again
				}
			}
		})
	}
}
