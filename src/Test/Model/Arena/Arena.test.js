import { ArenaController } from "../../../Controller/ArenaController";
import { Block, Ship } from "../../../Model";

// Helper to make blocks easier
const b = (x, y) => new Block(x, y);

describe("ArenaController Integration Tests", () => {
    let controller;
    let mockShip;

    beforeEach(() => {
        // Create a 10x10 grid
        controller = new ArenaController({ size: 10 });
        
        // Create a mock ship with target length 3

        mockShip = new Ship({length: 3, location: []}); 
    });

    test("1. Successfully places a straight vertical ship", () => {
        controller.currShip = mockShip;

        // Click 3 spots
        controller.placeShipLoc(b(0, "A"));
        controller.placeShipLoc(b(1, "A"));
        controller.placeShipLoc(b(2, "A"));

        // Ship should be in the Arena now
        expect(controller.arena.ships.length).toBe(1);
        expect(controller.currShip).toBeNull(); // Should reset
    });

    test("2. Resets and throws error if placement is not adjacent (L-Shape)", () => {
        controller.currShip = mockShip;

        controller.placeShipLoc(b(0, "A"));
        controller.placeShipLoc(b(1, "A"));
        
        // Invalid move: creating an 'L' shape
        // This will trigger the catch block in placeShipLoc
        expect(() => {
            controller.placeShipLoc(b(1, "B"));
        }).toThrow("adjacent");

        // Arena should be empty
        expect(controller.arena.ships.length).toBe(0);
        // Buffer should be cleared
        expect(controller.currLocs.length).toBe(0);
    });

    test("3. Throws error if clicking an occupied spot", () => {
        // Place first ship
        const s1 = new Ship({length: 1, location: []});
        controller.currShip = s1;
        controller.placeShipLoc(b(5, "E"));

        // Try to place second ship on top of it
        const s2 = new Ship({length: 1, location: []});
        controller.currShip = s2;

        expect(() => {
            controller.placeShipLoc(b(5, "E"));
        }).toThrow(); // Should fail "Spot already taken" or similar
    });

    test("4. Removing a ship works", () => {
        // Add a ship manually to arena
        const s1 = new Ship();
        s1.location = [b(0,"A")];
        controller.arena.addShip(s1);

        expect(controller.arena.ships.length).toBe(1);

        // Remove it
        controller.arena.removeShip(s1);
        expect(controller.arena.ships.length).toBe(0);
    });
});