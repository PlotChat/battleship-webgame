import { GameplayPage } from "../View/Pages/GameplayPage";
import { MenuPage } from "../View/Pages/MenuPage";
import { validateType } from "../Utils";
import { Block } from "../Model/Block/index";
import { ArenaController } from "./ArenaController";

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

    displayGameplayPage({ variant = "place" }) {
        const gameplayPage = new GameplayPage({
            game: this.#game,
            variant: variant,
            variantTrigger: (block, varType) => this.#variantTrigger(block, varType),
            toolsAddTrigger: () => this.#toolsTrigger("place"),
            toolsRemoveTrigger: () => this.#toolsTrigger("remove"),
        });

        this.updateAppContainer(gameplayPage);
    }

    #toolsTrigger(newVariant) {
        this.displayGameplayPage({ variant: newVariant });
    }

    #variantTrigger(block, variant){
        validateType(block, "Block", Block);

        const arenaController = this.#game.currentArenaController;
        
        const clickedBlock = arenaController.arena.findBlock(block.x, block.y);
        
        if(arenaController.currentShip == null){
            arenaController.currentShip = this.#game.currentPlayer.ownedShips[0];
        } 

        if(variant == "place"){
            try{
                arenaController.placeShipLoc(clickedBlock);
                console.log(`Success: shipLoc of ${arenaController.currentShip.name} placed at ${clickedBlock.x}${clickedBlock.y}`);
            } catch(error){
                console.log(`Error: ${error.stack}`);
            }
        } 
        
        else if (variant == "remove") {
            const clickedShipIndex = arenaController.findShipIndex(clickedBlock);
            const clickedShip = arenaController.arena.ships[clickedShipIndex];
            this.#game.currentShip = clickedShip;

            try {
                const shipIndex = arenaController.findShipIndex(block);
                
                if (shipIndex === -1) {
                    console.log("No ship here to remove.");
                } else {
                    const ship = arenaController.arena.ships[shipIndex];
                    this.#game.removeShip(ship); 
                    console.log("Success: Ship removed.");
                }
            } catch (error) {
                console.warn(`Remove Error: ${error.message}`);
            }
        }

        this.displayGameplayPage({ variant: variant });
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
