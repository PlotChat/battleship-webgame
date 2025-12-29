import { Game, GameSettings, Player, Arena, Ship } from '../../../Model/index';
import { expectPropertyValidation } from '../../../Utils/testUtils'
import { ArenaController, GameController } from '../../../Controller/index';

describe("Game class limits", () => {
    let getGame = () => new Game({players: [new Player(), new Player()]});
    
    expectPropertyValidation(getGame, 'players', [[{name: "Fish"}, {name: "Cat"}], undefined, null]);
})

describe("Game logic", () => {
    const arena = new Arena({size: 7});
    const controller = new ArenaController({arena: arena});
    const player = new Player({name: "p1", controller: controller});

    test("Check if players have default ships", () => {
        const defaultShips = [
            ...GameSettings.getNewFleet()
        ];

        expect(player.ownedShips.length).toBe(5);
        expect(player.ownedShips[0].name).toBe("Battleship");
        expect(player.ownedShips).toEqual(defaultShips);
    })
})

describe("Game Controller Integration", () => {
    test("Player can pick and place ships automatically", () => {
        // --- 1. SETUP: Create specific Test Ships (Size 2 and Size 1) ---
        // This saves us from typing 20 coordinates for real big ships
        const testShips = [
            new Ship({ name: "TinyBoat", length: 1 }),
            new Ship({ name: "LongBoat", length: 2 })
        ];

        // Setup the environment with these specific ships
        const arena = new Arena({ size: 7, ships: testShips }); // Inject test ships
        const arenaController = new ArenaController({ arena: arena });
        const player = new Player({ name: "Tester", controller: arenaController });
        // IMPORTANT: Ensure player owns the same instances or similar structure
        player.ownedShips = testShips; 

        // --- 2. SETUP: The Mock Input ---
        // We need to map out the EXACT conversation the game will have:
        // Loop 1:
        // - "Pick a ship" -> Input: "1" (TinyBoat)
        // - "Place TinyBoat (Size 1)" -> Input: "1A" (Done)
        // Loop 2:
        // - "Pick a ship" -> Input: "2" (LongBoat)
        // - "Place LongBoat (Size 2)" -> Input: "2B" (First cell)
        // - "Place LongBoat (Size 2)" -> Input: "3B" (Second cell)
        const mockInputs = [
            "1",        // Pick TinyBoat
            "1A",       // Place TinyBoat
            "2",        // Pick LongBoat
            "2B", "3B"  // Place LongBoat (needs 2 inputs because size is 2)
        ];

        let inputIndex = 0;
        const fakeInputProvider = (prompt) => {
            if (inputIndex >= mockInputs.length) {
                throw new Error(`Test failed: Game asked for more input than provided! Last prompt: "${prompt}"`);
            }
            return mockInputs[inputIndex++];
        };

        // --- 3. EXECUTION ---
        const gameController = new GameController(fakeInputProvider);
        const game = new Game({ players: [player] });

        // Run the logic (It should zip through the inputs instantly)
        gameController.handlePickAndPlaceShip(game);

        const shipsOnBoard = arena.ships.filter(s => s.location.length > 0);
        expect(shipsOnBoard.length).toBe(2);

        // Are they at the correct coordinates?
        const tinyBoat = arena.ships.find(s => s.name === "TinyBoat");
        expect(tinyBoat.location[0].x).toBe(1); // "1A" -> x=1 (depending on your parsing)
        
        // Did we consume all inputs? (Ensures logic didn't skip anything)
        expect(inputIndex).toBe(mockInputs.length);
    });
});