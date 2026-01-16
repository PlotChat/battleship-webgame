import PromptSync from "prompt-sync";
import { Game } from "../Model";
import { validateType } from "../Utils";
import { ViewController } from "./ViewController";

const input = PromptSync();

export class GameController{
    #viewController;
    #game;

    // Default to real user input if nothing is passed
    constructor({inputProvider = PromptSync(), viewController = null, game = null} = {}) { 
        this.input = inputProvider;
        this.viewController = viewController;
        this.game = game;
    }

    startGame() {
        this.#viewController.displayMenuPage({playTrigger: () => this.handlePlayWithPC()})
    }
    
    handlePlayWithPC(){
        // Make player place ships to start game
        this.handlePickAndPlaceShip(true);

        // Then make the player fight the PC
        // this.handleBattle(game, true);
    }

    handlePickAndPlaceShip(againstPC = false){
        if(againstPC == true){
            this.#viewController.displayPickPage({ game: this.#game, variant: "place", callback: () => this.handleBattle("pc") });
        }

        const placedShips = [];
    }

    handleBattle(player){
        // if(this.#game.currentPlayer.ownedShips.length !== this.#game.currentArenaController.arena.ships.length){
        //     console.log("Player needs to place all ships");
        //     return;
        // }

        if(player == "pc"){
            const playerPC = this.#game.players.find((player) => player.name.toLowerCase() == "pc");
            this.#game.currentArenaController = playerPC.controller;
            this.#viewController.displayBattlePage({ game: this.#game, variant: "pc" });
        }
    }

    set viewController(controller){
        validateType(controller, "View controller", ViewController);
        this.#viewController = controller;
    }

    set game(obj){
        validateType(obj, "Game", Game);
        this.#game = obj;
    }
}

