import { validateType } from "../Utils/validateInput";
import { Block, Arena, ArenaRules } from "../Model/index";

export class ArenaController{
    #arena;
    #currLocs;
    #currShip = null;

    constructor({size = 0, ships = [], currLocs = []} = {}){
        this.#arena = new Arena({size, ships});
        this.currLocs = currLocs
    }

    // Places a ship location on the grid
    placeShipLoc(blockLoc) {
        if(this.#currShip === null)
            throw new Error("Must have a selected current ship");
        
        validateType(blockLoc, "Block location", Block);

        if(this.#currShip.length === this.#currLocs.length)
            throw new Error("Ship length exceeded. Cannot occupy more space");
        
        let isAvailable = ArenaRules.isAvailableShipLoc(this.#arena, blockLoc);

        if (isAvailable) {
            this.#currLocs.push(blockLoc);
        } else {
             throw new Error("Spot already taken");
        }

        // Finalize Ship if Full
        if (this.#currLocs.length === this.#currShip.length) {
            
            // Assign locations to the ship temporarily
            this.#currShip.location = [...this.#currLocs];

            try {
                // Validate the shape
                ArenaRules.validateShip(this.#arena, this.#currShip);
                
                // Add to Arena
                this.#arena.addShip(this.#currShip);
                
                // Reset
                this.#currShip = null;
                this.#currLocs = [];
            } catch (error) {
                // If shape is invalid (e.g. L-shape), reset and warn
                this.#currShip.location = []; 
                this.#currLocs = [];
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

    receiveAttack(blockLoc, damage){
        const shipLocIndex = this.findShipIndex(blockLoc);
        this.#arena.ships[shipLocIndex].receiveDamage(damage);
    }

    sinkShip(blockLoc){
        const shipLocIndex = this.findShipIndex(blockLoc);

        if (shipLocIndex === -1) return;

        this.#arena.ships.splice(shipLocIndex, 1);
    }

    set currShip(ship) {
        this.#currShip = ship;
    }

    set currLocs(locs) {
        validateType(locs, "Current location list ", Array);
        this.#currLocs = locs;
    }

    get currLocs() { return this.#currLocs };
    get currShip() { return this.#currShip };
    get arena(){ return this.#arena };
}
