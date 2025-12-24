import { Arena, Block, Ship } from "../../../Model/index";

let block = (x, y) => new Block(x, y);
let ship = (blkList) => new Ship({location: blkList}) 

describe("Arena grid location business logic", () => {
    let arena;

    beforeEach(() => {
        arena = new Arena({size: 10});
    });

    test.each([
        // Scrambled / Teleporting
        [ship([block(1, "A"), block(4, "F"), block(2, "B")])], 
        // Jumps
        [ship([block(2, "A"), block(2, "C")])], 
        // Diagonal (A1 to B2)
        [ship([[block(0, "A"), block(1, "B")]])],
        // The "Snake" or "L" shape (A0, A1, B1)
        [ship([[block(0, "A"), block(0, "B"), block(1, "B")]])],
        // Duplicates
        [ship([[block(2, "A"), block(2, "A"), block(2, "B")]])]
    ])("Throw error when location of ship is not adjacent", () =>{
        expect((value) => {
            arena.ships = value;
        }).toThrow();
    })
})

describe("Arena grid interaction business logic", () => {
    let arena;
    
    test("Sink ship having location 1A assuming there is a ship there", () => {
        let block = (x, y) => new Block(x, y);
    
        arena = new Arena({size: 10, ships: [
            [ship([block(1,"A"), block(1,"B"), block(1,"C")])],
            [ship([block(2, "A"), block(3, "A")])]
        ]});

        arena.sinkShip(block(1, "A"));

        // find the location of the supposedly sunk ship in each ship locations
        let foundShip = arena.ships.find(ship => {
             return ship.location.some(loc => {
                return loc.x === 1 && loc.y === "A";
             })
        })

        expect(foundShip).toBe(undefined);
    })
})

describe("Arena print", () => {
    let arena = new Arena({size: 7});

    test("Arena creates a grid with correct dimensions and corner content", () => {
        const grid = arena.grid;

        // Check dimensions (7x7)
        expect(grid.length).toBe(49);

        // Check the First Block (0, "A")
        expect(grid[0].x).toBe(0);
        expect(grid[0].y).toBe("A");

        console.log(grid[6].x);
        // Check the Last Block (6, "G")
        expect(grid[48].x).toBe(6);
        expect(grid[48].y).toBe("G");
    })
})
