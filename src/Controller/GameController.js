import { ArenaRules } from "../Model/Arena/ArenaRules";
import { Block, Game, Player } from "../Model/index";
import PromptSync from "prompt-sync";
const input = PromptSync();

export class GameController{
    startGame(players) {
        const game = new Game({players: [...players]});

        outer:
        while(true){
            let choice;

            while(true){
                console.log("=== Battleship ===");
                console.log("1. Play with PC");
                choice = input("Enter your choice: ");

                if(choice <= 0 || choice > 2){
                    console.log("Wrong choice, try again");
                } else break;
            }

            // Setting up game's current player to go first properties (first player in array goes first)
            const firstPlayer = game.players[0];
            game.currentPlayer = firstPlayer;
            game.currentArenaController = firstPlayer.controller;

            switch (choice){
                case 1:
                    handlePlayWithPC(game);
                    break;
                case 2:
                    console.log("Exiting game...");
                    break outer;
                // case 3:
                //     handlePlayWithPlayer();
                //     break;
                // This is a future feature
            }
        }
    }

    handlePlayWithPC(game){
        // Make player place ships to start game
        this.handlePickAndPlaceShip(game, true);

        // Then make the player fight the PC
        this.handleBattle(game, true);
    }

    handlePickAndPlaceShip(game, againstPC = false){
        // Each player in the game gets to pick and place their ships 
        game.players.forEach(player => {
            // Ships that are placed will be here
            const placedShips = [];
    
            // Loop until all available ships are placed
            while(placedShips.length !== player.controller.arena.ships.length){
                const pickedShip = this.handlePickShip(player);
                this.handlePlaceShip(placedShips, player, pickedShip);
            }
        })
    }

    handlePickShip(player){
        const arena = player.controller.arena;
        // Print out available ships
        console.log("Your ships: ");
        for(let i = 0; i < arena.ships.length; i++){
            const curr = arena.ships[i];

            console.log(`${i+1}. ${curr.name} - HP: ${curr.health}`)
        }
        
        // Let player pick a valid ship
        while(true){
            const choice = input("Pick a ship to place on your arena: ");
            if(choice > arena.ships.length || choice < 1){
                console.log("Wrong input. Try again");
            } else {
                return arena.ships[choice + 1];
            }
        }
    }

    handlePlaceShip(placedShips, player, chosenShip){
        const controller = player.controller;
        const arena = player.controller.arena;

        controller.currentShip = chosenShip;
        
        // Show how grid looks like for the player to know where to place
        // Then place the ship then have a confirmation
        let choice;

        // Loop until the player has placed all the chosen ship parts on the grid
        while(controller.currentLocations !== controller.currentShip.size){
            // Prints out current arena appearance
            console.log("Your arena: ");
            const gridUI = this.getGridUI(arena, placedShips);
            this.printGridUI(gridUI);

            choice = input("Choose an arena to place the ship (eg: 2A): ");

            if(choice.length !== 2){
                console.log("Invalid choice. Try again");
                continue;
            }

            // Place a ship on the grid data
            const chosenBlock = new Block({x: choice.substring[0, 1], y: choice.substring(1, 2)});
            try {
                controller.placeShipLoc(chosenBlock);
            } catch (error){
                console.log(`Error: ${error}. Try again`);
            }    
        }

        // Add ship to placedShips
        placedShips.push(controller.currentShip);
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
}

