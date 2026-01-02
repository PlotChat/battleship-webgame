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
            this.#viewController.displayGameplayPage({game: this.#game, variant: "place"});
        }

        const placedShips = [];

        

        // Each player in the game gets to pick and place their ships 
        // game.players.forEach(player => {
        //     // Ships that are placed will be here
    
        //     // Loop until all available ships are placed
        //     while(placedShips.length !== player.controller.arena.ships.length){
        //         const pickedShip = this.handlePickShip(player);

        //         if (!pickedShip) continue;

        //         this.handlePlaceShip(placedShips, player, pickedShip);
        //     }
        // })
    }

    handlePickShip(player){
        const arena = player.controller.arena;
        console.log("Your ships: ");
        for(let i = 0; i < arena.ships.length; i++){
            const curr = arena.ships[i];
            // Only show ships that haven't been placed yet
            const status = curr.location.length > 0 ? "[PLACED]" : "";
            console.log(`${i+1}. ${curr.name} ${status} - HP: ${curr.health}`);
        }
        
        while(true){
            const choice = this.input("Pick a ship to place on your arena: ");
            const index = parseInt(choice) - 1; // [FIX 1] Convert "1" -> 0

            if(isNaN(index) || index < 0 || index >= arena.ships.length){
                console.log("Wrong input. Try again");
            } else {
                const ship = arena.ships[index];
                if (ship.location.length > 0) {
                     console.log("You already placed this ship!");
                     continue;
                }
                return ship;
            }
        }
    }

    handlePlaceShip(placedShips, player, chosenShip) {
        const controller = player.controller;
        controller.selectShip(chosenShip);
        
        let isShipDone = false;

        while (!isShipDone) {
            console.log("Your arena: ");
            const gridUI = this.getGridUI(controller.arena, placedShips);
            this.printGridUI(gridUI);

            const choice = this.input(`Place ${chosenShip.name} (${chosenShip.size} cells) (eg: 2A): `);

            if (choice.length < 2) {
                console.log("Invalid input. Format: 2A");
                continue;
            }

            const rawY = choice.slice(-1).toUpperCase(); 
            const rawX = choice.slice(0, -1); 

            const result = controller.processPlaceShipInput(rawX, rawY);

            if (result.success) {
                console.log(result.message);
                isShipDone = result.isComplete;
            } else {
                console.log(`Error: ${result.message}`);
            }
        }
        placedShips.push(chosenShip);
    }

    // Getting grid's data for interface (returns an array of Blocks)
    getGridUI(arena, placedShips){
        const charIndex = 'A'.charCodeAt(0);
        const size = arena.size;
        const result = [];

        // Drawing a grid
        // 1. Create the Header Row (Empty corner + Numbers 0 to size-1)
        let header = [" "]; 
        for (let j = 0; j < size; j++) {
            header.push(j);
        }
        result.push(header);

        // 2. Create the Content Rows
        for (let i = 0; i < size; i++) {
            let row = [];
            
            // Add the Letter for the Y-axis (A, B, C...)
            row.push(String.fromCharCode(charIndex + i));

            // Add the actual grid content (placeholder "~" for water and first char of ship for ship)
            for (let j = 0; j < size; j++) {
                placedShips.forEach(ship => {
                    if(ship.location.x == i && ship.location.y == j){
                        row.push(ship.name.substring(0, 1));
                    }
                })

                row.push("~"); 
            }
            result.push(row);
        }

        return result;
    }

    // Print out the UI for the game on CLI version
    printGridUI(gridUI){
        const displaySize = gridUI.length;

        for(let i = 0 ; i < displaySize; i++){
            for(let j = 0; j < displaySize; j++){
                // Pad to 3 characters so "10" and "1" take the same space

                const cell = String(gridUI[i][j]).padStart(2, ' ');
                process.stdout.write(` ${cell} `);
            }

            console.log(""); // New line after each row
        }
    }

    handleBattle(player, againstPC = false){
        throw new Error("Feature not implemented");
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

