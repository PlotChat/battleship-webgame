import { validateNumber, validateType } from '../../Utils/validateInput'
import { Block } from '../../Model/Block/index';

export class Arena{
    #size;
    #grid;
    #ships;

    constructor({size = 0, ships = []} = {}){
        this.size = size;
        this.makeGrid();
        this.ships = ships;
    }

    makeGrid(){
        const gridTemp = []
        const charIndex = 'A'.charCodeAt(0);

        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                const curX = i;
                const curY = String.fromCharCode(charIndex + j);

                const cur = new Block(curX, curY);

                gridTemp.push(cur);
            }
        }

        this.#grid = [...gridTemp];
    }

    set ships(shipList){
        validateType(shipList, "Ship list", Array);
        this.validateLocations(shipList);
    
        this.#ships = shipList;
    }

    set size(value){
        validateNumber(value, "Grid size", "Integer");
        if(value < 7) throw new Error("Grid size must be >= 7");

        this.#size = value;
    }

    validateLocations(shipList){
        shipList.forEach(ship => {
            if(ship.location.length == 0) return;

            ship.location.forEach(loc => {
                validateType(loc, "Object", Block);
            })

            let isAdjacent = this.validateAdjacent(ship.location);
            let isOnGrid = this.validateOnGrid(ship.location);

            if(!isAdjacent) throw new Error("Locations in location list must be adjacent");
            if(!isOnGrid) throw new Error("Locations in location list must be on the grid")
        });
    }

    validateAdjacent(ship) {
        if (ship.length <= 1) return true;

        for (let i = 1; i < ship.length; i++) {
            const prev = ship[i - 1];
            const curr = ship[i];

            // 1. Calculate the gaps correctly
            // We use charCodeAt only for Y because it is a letter
            const gapX = Math.abs(curr.x - prev.x);
            const gapY = Math.abs(curr.y.charCodeAt(0) - prev.y.charCodeAt(0));

            // 2. The Battleship Adjacency Rule:
            // One coordinate MUST change by 1, the other MUST change by 0.
            // Therefore, the sum of gaps must be EXACTLY 1.
            if (gapX + gapY !== 1) return false;
        }

        // 3. Final Check: Ensure the ship is a straight line (not an 'L' shape)
        const isHorizontal = ship.every(loc => loc.y === ship[0].y);
        const isVertical = ship.every(loc => loc.x === ship[0].x);

        return isHorizontal || isVertical;
    }

    validateOnGrid(ship){
        const charIndex = 'A'.charCodeAt(0);
        const gridSize = this.size;

        for(loc of ship){
            if(
                loc.x > gridSize - 1
                || loc.y.charCodeAt(0) - charIndex > gridSize - 1
            ) return false;
        }

        return true;
    }

    findShipIndex(blockLoc){
        const shipLocIndex = this.ships.findIndex(ship => {
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
        this.#ships[shipLocIndex].receiveDamage(damage);
    }

    sinkShip(blockLoc){
        const shipLocIndex = this.findShipIndex(blockLoc);

        if (shipLocIndex === -1) return;

        this.ships.splice(shipLocIndex, 1);
    }

    get size(){ return this.#size };
    get ships(){ return this.#ships };
    get grid(){ return this.#grid };
}