import { PickPage } from "../View/Pages/PickPage";
import { MenuPage } from "../View/Pages/MenuPage";
import { validateType } from "../Utils";
import { Block } from "../Model/Block/index";
import { ArenaController } from "./ArenaController";
import { BattlePage } from "../View/Pages/BattlePage";
import { Game } from "../Model";
import { GameLogic } from "../Utils/GameLogic";

export class ViewController {
	#game;
	#appContainer;

	constructor({ game = null, appContainer = null } = {}) {
		this.#game = game;
		this.#appContainer = appContainer;
	}

	displayMenuPage({ playTrigger = () => {}, settingsTrigger = () => {} }) {
		const menuPage = new MenuPage({
			playTrigger: playTrigger,
			settingsTrigger: settingsTrigger,
		});

		this.updateAppContainer(menuPage);
	}

	displayPickPage({ variant = "place", callback = () => {} }) {
		const pickPage = new PickPage({
			game: this.#game,
			variant: variant,
			variantTrigger: (block, varType) =>
				this.#variantTrigger(block, varType, callback),
			toolsAddTrigger: () => this.#toolsTrigger("place", callback),
			toolsRemoveTrigger: () => this.#toolsTrigger("remove", callback),
			playButtonTrigger: callback,
		});

		this.updateAppContainer(pickPage);
	}

	// Tools buttons' functions
	#toolsTrigger(newVariant, callback) {
		this.#game.currentArenaController.currentLocations = [];
		this.displayPickPage({ variant: newVariant, callback: callback });
	}

	// Execute when arenaBlock(s) are clicked
	#variantTrigger(block, variant, callback) {
		validateType(block, "Block", Block);

		const arenaController = this.#game.currentArenaController;

		const clickedBlock = arenaController.arena.findBlock(block.x, block.y);

		// Set arenaController's current ship to be player's first owned ship
		if (arenaController.currentShip == null) {
			arenaController.selectShip(this.#game.currentPlayer.ownedShips[0]);
		}

		const currentShip = arenaController.currentShip;

		// For placing ships
		if (variant == "place") {
			try {
				if (arenaController.placeShipLoc(clickedBlock)) {
					console.log(
						`Success: shipLoc of ${currentShip.name} placed at ${clickedBlock.x}${clickedBlock.y}`
					);
				} else {
					console.log(`Failed: shipLoc of ${currentShip.name} wasn't placed`);
				}
			} catch (error) {
				console.log(`Error: ${error.stack}`);
			}
			this.displayPickPage({ variant: variant, callback: callback });

			// For removing ships
		} else if (variant == "remove") {
			try {
				const shipIndex = arenaController.findShipIndex(block);

				if (shipIndex === -1) {
					console.log("No ship here to remove.");
				} else {
					const ship = arenaController.arena.ships[shipIndex];
					arenaController.arena.removeShip(ship);
					console.log(`Success: ${ship.name} removed.`);
				}
			} catch (error) {
				console.warn(`Remove Error: ${error.message}`);
			}
			this.displayPickPage({ variant: variant, callback: callback });

			// For attacking ships
		} else if (variant == "attack") {
			console.log(this.#game.players[0].controller.arena.ships);
			console.log(this.#game.players[1].controller.arena.ships);

			try {
				// Checking for winner
				const winners = GameLogic.checkWinner(this.#game);
				if (winners) {
					this.displayBattlePage();
					this.#toggleAllArenaBlockButtons();
					this.#showWin(winners);
					callback();
					return;
				}

				// Player attacking PC:
				this.#toggleAllArenaBlockButtons();
				setTimeout(() => {
					const attackSuccess = this.#game.currentArenaController.receiveAttack(
						block,
						1
					);

					if (attackSuccess) this.#game.currentPlayer.points++;

					this.#game.currentRound++;
				}, 1);

				// PC attacking Player:
				this.#toggleAllArenaBlockButtons();
				setTimeout(() => {
					this.displayBattlePage({ options: "player", callback: callback });

					// AI:
					setTimeout(() => {
						// 1. Get the human player (the one the PC is attacking)
						const humanPlayer = this.#game.players.find(
							(p) => p.name.toLowerCase() !== "pc"
						);

						// 2. Get the human's grid and filter for blocks not hit yet
						const availableBlocks = humanPlayer.controller.arena.grid.filter(
							(b) => !b.isHit
						);

						if (availableBlocks.length > 0) {
							// 3. Pick a random block from the player's board
							const randomIndex = Math.floor(
								Math.random() * availableBlocks.length
							);
							const targetBlock = availableBlocks[randomIndex];

							// 4. Attack the human's board
							const attackSuccess = humanPlayer.controller.receiveAttack(
								targetBlock,
								1
							);

							if (attackSuccess) this.#game.currentPlayer.points++;
						}

						this.#game.currentRound++;
						// 5. Re-render the PC's board so the human can take their next turn
						this.displayBattlePage({ options: "pc", callback: callback });
					}, 1);
				}, 1);
			} catch {}
		}
	}

	#showWin(winners) {
		if (winners.length == 0) {
			alert(`Game ended! No winners!`);
			return;
		}

		const winnerNames = winners.map((winner) => winner.name).join(", ");
		alert(`Game ended! Winners: ${winnerNames}!`);
	}

	#toggleAllArenaBlockButtons() {
		const arenaBlockList = document.querySelectorAll(".arena-block");
		arenaBlockList.forEach((arenaBlock) => {
			arenaBlock.classList.toggle("disabled");
		});
	}

	displayBattlePage({ options = null , callback = () => {} } = {}) {
		// 1. Ensure we have a target, even if options is empty
		let targetBeingAttacked = options;

		validateType(this.#game, "Game", Game);

		const pc = this.#game.players.find((p) => p.name.toLowerCase() === "pc");
		const human = this.#game.players.find((p) => p.name.toLowerCase() !== "pc");

		let controller = null;
		let config = { game: this.#game, variant: "water" };

		// 2. Determine configuration based on target
		if (targetBeingAttacked === "pc") {
			this.#game.currentPlayer = human;
			controller = pc.controller;
			config.variantTrigger = (block) => this.#variantTrigger(block, "attack", callback);
			delete config.variant; // PC page doesn't use 'water' variant
		} else if (targetBeingAttacked === "player") {
			this.#game.currentPlayer = pc;
			controller = human.controller;
		} else {
			controller = null;
		}

		// 3. Apply the controller and render once
		this.#game.currentArenaController = controller;
		const battlePage = new BattlePage(config);
		this.updateAppContainer(battlePage);
	}

	updateAppContainer(page) {
		validateType(page, "Page", HTMLElement);

		this.#appContainer.innerHTML = "";
		this.#appContainer.append(page);
	}

	set game(obj) {
		validateType(obj, "Game", Game);
		this.#game = obj;
	}

	set appContainer(container) {
		validateType(container, "App container", HTMLElement);
		this.#appContainer = container;
	}
}
