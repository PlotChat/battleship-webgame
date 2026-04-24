import { validateType } from "../Utils/validateInput";
import { Block } from "../Model/Block/Block";
import { Ship } from "../Model/Ship/Ship";
import { ArenaRules } from "../Model/Arena/ArenaRules";


export class ArenaController{
    #arena;
    #currentLocations;
    #currentShip = null;

    constructor({ arena = null, currentLocations = [], currentShip = null} = {}){
        this.arena = arena;
        this.currentLocations = currentLocations
        this.currentShip = currentShip;
    }

    selectShip(ship) {
        validateType(ship, "Ship", Ship);
        this.#currentShip = ship;
        this.#currentLocations = []; // Reset locations when picking new ship
    }

    // Places a ship location on the grid
    placeShipLoc(blockLoc) {
        if(this.#currentShip === null)
            throw new Error("Must have a selected current ship");
        
        validateType(blockLoc, "Block location", Block);
        
        // Throws error when ship length is already enough, no need to place more
        if(this.#currentShip.size <= this.#currentLocations.length)
            throw new Error("Ship length exceeded. Cannot occupy more space");
        
        this.#currentLocations.push(blockLoc);

        // Finalize Ship if Full
        if (this.#currentLocations.length === this.#currentShip.size) {
            if(this.#arena.findShip(this.#currentShip)){
                this.#arena.removeShip(this.#currentShip);
            }

            // Check if the location(s) already taken
            this.#currentLocations.forEach(loc => {
                const isAvailable = ArenaRules.isAvailableShipLoc(this.#arena, loc);
                const isOverlapLocations = ArenaRules.isOverlapLocations(this.#currentLocations);
                
                if (!isAvailable || isOverlapLocations) {
                    this.#currentLocations = [];
                    throw new Error("Spot(s) already taken");
                }
            })

            // Assign locations to the ship temporarily
            this.#currentShip.location = [...this.#currentLocations];

            try {
                // Validate the shape
                ArenaRules.validateShip(this.#arena, this.#currentShip);
                
                // Add to Arena
                this.#arena.addShip(this.#currentShip);
                
                console.log(`${this.#currentShip.name} is placed`);

                // Reset
                this.#currentLocations = [];
                
                return true;
            } catch (error) {
                // If shape is invalid (e.g. L-shape), reset and warn
                this.#currentShip.location = []; 
                this.#currentLocations = [];
                throw new Error("Locations placed are invalid");
            }
        }

        return true;
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

        console.log(`Arena: ${this.#arena.name} got hit!`)
        // 1. Handle the MISS
        if (shipLocIndex === -1) {
            console.log(`But hit miss! Hit water.`);
            return false; // Return false so the UI knows it was a miss
        }

        // 2. Handle the HIT
        const targetShip = this.#arena.ships[shipLocIndex];
        targetShip.receiveDamage(damage);

        // 3. Handle the SINK (Safe check)
        if (targetShip.health <= 0) {
            console.log(`${targetShip.name} got sunk!`);
            this.#arena.removeShip(targetShip);
        }
        
        return true; // Return true so the UI knows it was a hit
    }

    set currentShip(ship) {
        this.#currentShip = ship;
    }

    set currentLocations(locs) {
        validateType(locs, "Current location list ", Array);
        this.#currentLocations = locs;
    }

    set arena(arena){
        this.#arena = arena;
    }

    get currentLocations() { return this.#currentLocations };
    get currentShip() { return this.#currentShip };
    get arena(){ return this.#arena };
}
