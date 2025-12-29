import { Player, Ship, Block } from '../../../Model/index';
import { expectPropertyValidation } from '../../../Utils/testUtils'
import { ArenaController } from '../../../Controller/index';
import { Arena } from '../../../Model/Arena/Arena'

const getPlayer = () => new Player(); 

describe("Player Class Limits", () => {
    expectPropertyValidation(getPlayer, 'points', [-1, NaN, null, undefined]);
    expectPropertyValidation(getPlayer, 'turns',  [-1, NaN, null]);

    test("Stores valid data correctly", () => {
        const p = new Player();
        p.points = 10;
        expect(p.points).toBe(10);
    });
});

describe("Player logic", () => {
    // Create 2 players' Arena
    const p1Arena = new Arena({size: 7});
    const p2Arena = new Arena({size: 7});

    // Create 2 players' ArenaController
    const p1Controller = new ArenaController({arena: p1Arena});
    const p2Controller = new ArenaController({arena: p2Arena});

    // Create the 2 players
    const player1 = new Player({name: "pa", damage: 2, controller: p1Controller});
    const player2 = new Player({name: "p1", controller: p2Controller});

    // Set up player 2's example ship
    const mockShip = new Ship({location: [new Block(1, "A")], health: 3});
    p2Controller.arena.ships = [mockShip];

    test("Attacking a ship works", () => {
        expect(player1.attackArena(new Block(1, "A"), player2)).toBe(true);
        
        expect(mockShip.health).toBe(1);
    })

    test("Sinking a ship works", () => {
        player1.attackArena(new Block(1, "A"), player2);

        expect(player2.controller.arena.ships.length).toBe(0);
    })
})
