import { validateType } from "../Utils/validateInput";
import { Block } from "../Model/Block/Block";
import { Ship } from "../Model/Ship/Ship";
import { Arena } from "../Model/Arena/Arena";
import { ArenaRules } from "../Model/Arena/ArenaRules";


export class ArenaController{
    #arena;
    #currentLocations;
    #currentShip = null;

    constructor({arena = null, currentLocations = []} = {}){
        this.#arena = arena;
        this.currentLocations = currentLocations
    }

    processPlaceShipInput(rawX, rawY) {
        if (!this.#currentShip) return { success: false, message: "No ship selected" };

        try {
            // 1. Parse Input (Fixing your number/string bug here)
            const x = parseInt(rawX, 10); 
            const y = rawY; // Keep as string "A", "B"... logic handles conversion
            
            // 2. Create Block (Controller handles the object creation)
            const block = new Block( x, y );

            // 3. Delegate to internal logic
            this.#addLocationToCurrentShip(block);

            // 4. Check if we are done
            const isComplete = this.#currentLocations.length === this.#currentShip.size;
            
            if (isComplete) {
                this.#finalizeShipPlacement();
                return { success: true, message: "Ship Placed!", isComplete: true };
            }

            return { success: true, message: "Spot recorded.", isComplete: false };

        } catch (error) {
            return { success: false, message: error.message, isComplete: false };
        }
    }

    selectShip(ship) {
        validateType(ship, "Ship", Ship);
        this.#currentShip = ship;
        this.#currentLocations = []; // Reset locations when picking new ship
    }

    // Internal Helper (Logic from your old placeShipLoc)
    #addLocationToCurrentShip(blockLoc) {
        // Validation logic...
        const isAvailable = ArenaRules.isAvailableShipLoc(this.#arena, blockLoc);
        if (!isAvailable) throw new Error("Spot already taken");

        // Prevent duplicates in current selection
        const isDuplicate = this.#currentLocations.some(
            l => l.x === blockLoc.x && l.y === blockLoc.y
        );
        if (isDuplicate) throw new Error("You already selected this spot");

        this.#currentLocations.push(blockLoc);
    }

    // Internal Helper
    #finalizeShipPlacement() {
        // Create a "Shadow Ship" to test the placement
        // We do NOT touch the real ship yet.
        const shadowShip = new Ship({
            name: this.#currentShip.name,
            length: this.#currentShip.size,
            location: [...this.#currentLocations] // Assign the candidate locations
        });

        try {
            // Validate the Shadow
            ArenaRules.validateShip(this.#arena, shadowShip);
            
            // Success, update the Real Ship
            this.#currentShip.location = [...this.#currentLocations];
            
            this.#currentShip = null;
            this.#currentLocations = [];
        } catch (error) {
            // If shadow failed, we never touched the real ship, so no rollback needed.
            // Just clear local state.
            this.#currentShip = null; // Optional: Force user to pick ship again on fail?
            this.#currentLocations = [];

            // Keep current ship and retry (optional)
            // this.#currentShip ()
            
            throw error; 
        }
    }

    // Places a ship location on the grid
    placeShipLoc(blockLoc) {
        if(this.#currentShip === null)
            throw new Error("Must have a selected current ship");
        
        validateType(blockLoc, "Block location", Block);

        if(this.#currentShip.size === this.#currentLocations.length)
            throw new Error("Ship length exceeded. Cannot occupy more space");
        
        let isAvailable = ArenaRules.isAvailableShipLoc(this.#arena, blockLoc);

        if (isAvailable) {
            this.#currentLocations.push(blockLoc);
        } else {
             throw new Error("Spot already taken");
        }

        // Finalize Ship if Full
        if (this.#currentLocations.length === this.#currentShip.size) {
            
            // Assign locations to the ship temporarily
            this.#currentShip.location = [...this.#currentLocations];

            try {
                // Validate the shape
                ArenaRules.validateShip(this.#arena, this.#currentShip);
                
                // Add to Arena
                this.#arena.addShip(this.#currentShip);
                
                // Reset
                this.#currentShip = null;
                this.#currentLocations = [];
            } catch (error) {
                // If shape is invalid (e.g. L-shape), reset and warn
                this.#currentShip.location = []; 
                this.#currentLocations = [];
                throw error;
            }
        }
    }

    findShipIndex(blockLoc) {
        const arena = this.#arena;

        const shipLocIndex = arena.ships.findIndex(ship => {
            return ship.location.some(loc => {
                return (
                    loc.x === blockLoc.x &&
                    loc.y === blockLoc.y
                )
            })
        })

        return shipLocIndex;
    }

    receiveAttack(blockLoc, damage) {
        const shipLocIndex = this.findShipIndex(blockLoc);

        // 1. Handle the MISS
        if (shipLocIndex === -1) {
            console.log("Miss! Hit water.");
            return false; // Return false so the UI knows it was a miss
        }

        // 2. Handle the HIT
        const targetShip = this.#arena.ships[shipLocIndex];
        targetShip.receiveDamage(damage);

        // 3. Handle the SINK (Safe check)
        if (targetShip.health <= 0) {
            console.log(`You sunk the ${targetShip.name}!`);
            this.removeShip(targetShip);
        }
        
        return true; // Return true so the UI knows it was a hit
    }

    removeShip(ship) {
        validateType(ship, "Ship", Ship);

        const ships = this.#arena.ships;

        // 1. Find the index of the ship
        const index = ships.findIndex(curr => {
            // Scenario A: It's the exact same object in memory
            if (curr === ship) return true;

            // Scenario B: It's a different object but holds the same data (for tests)
            // Compare "Unique IDs" (like the starting coordinate)
            if (curr.length !== ship.size) return false;
            if (curr.location.length === 0 || ship.location.length === 0) return false;

            // Check if they start at the same X,Y
            return curr.location[0].x === ship.location[0].x && 
                curr.location[0].y === ship.location[0].y;
        });

        // 2. If found, sink it (Remove from array)
        if (index !== -1) {
            ships.splice(index, 1);
        } else {
            throw new Error("Cannot find ship to sink");
        }
    }

    set currentShip(ship) {
        this.#currentShip = ship;
    }

    set currentLocations(locs) {
        validateType(locs, "Current location list ", Array);
        this.#currentLocations = locs;
    }

    get currentLocations() { return this.#currentLocations };
    get currentShip() { return this.#currentShip };
    get arena(){ return this.#arena };
}
