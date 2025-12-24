import { Player } from '../../../Model/index';
import { expectPropertyValidation } from '../../../Utils/testUtils'

describe("Player Class Limits", () => {
    const getPlayer = () => new Player(); 

    expectPropertyValidation(getPlayer, 'points', [-1, NaN, null, undefined]);
    expectPropertyValidation(getPlayer, 'ships',  [undefined, null, 5]);
    expectPropertyValidation(getPlayer, 'turns',  [-1, NaN, null]);

    test("Stores valid data correctly", () => {
        const p = new Player();
        p.points = 10;
        expect(p.points).toBe(10);
    });
});
