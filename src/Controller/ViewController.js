import { PickPage } from "../View/Pages/PickPage";
import { MenuPage } from "../View/Pages/MenuPage";
import { validateType } from "../Utils";
import { Block } from "../Model/Block/index";
import { ArenaController } from "./ArenaController";
import { BattlePage } from "../View/Pages/BattlePage";
import { Game } from "../Model";

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
			variantTrigger: (block, varType) => this.#variantTrigger(block, varType, callback),
			toolsAddTrigger: () => this.#toolsTrigger("place", callback),
			toolsRemoveTrigger: () => this.#toolsTrigger("remove", callback),
            playButtonTrigger: callback,
		});

		this.updateAppContainer(pickPage);
	}

	#toolsTrigger(newVariant, callback) {
		this.displayPickPage({ variant: newVariant, callback: callback });
	}

	#variantTrigger(block, variant, callback) {
		validateType(block, "Block", Block);

		const arenaController = this.#game.currentArenaController;

		const clickedBlock = arenaController.arena.findBlock(block.x, block.y);

		// Set arenaController's current ship to be player's first owned ship
		if (arenaController.currentShip == null) {
			arenaController.selectShip(this.#game.currentPlayer.ownedShips[0]);
		}

		const currentShip = arenaController.currentShip;

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
		} else if (variant == "placeAttack") {
			try{

			} catch {

			}
		}

		this.displayPickPage({ variant: variant, callback: callback });
	}

	#attackTrigger(){
		if(this.#game.currentRound == this.#game.maxRounds){
			alert("You win!");
		}

		
	}

	displayBattlePage({ variant }){
		validateType(this.#game, "Game", Game);
		if(variant == "pc"){
			const battlePage = new BattlePage({ game: this.#game, variantTrigger: this.#variantTrigger, attackTrigger: this.#attackTrigger});
			this.updateAppContainer(battlePage);
		}
	}

	updateAppContainer(page) {
		validateType(page, "Page", HTMLElement);

		this.#appContainer.innerHTML = "";
		this.#appContainer.append(page);
	}

	set game(obj) {
		validateType(obj, "Arena Controller", ArenaController);
		this.#game = obj;
	}

	set appContainer(container) {
		validateType(obj, "App container", HTMLElement);
		this.#appContainer = container;
	}
}
