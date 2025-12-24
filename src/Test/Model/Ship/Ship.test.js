import { Ship } from '../../../Model/Ship/index';
import { expectPropertyValidation  } from '../../../Utils/testUtils';

describe("Ship class limits", () =>{
    let getShip = () => new Ship();

    expectPropertyValidation(getShip, "name", [
        "", "!&", "a", [], undefined, null, NaN
    ])

    expectPropertyValidation(getShip, "length", [
        "", [], undefined, null, NaN, -1, 1.5
    ])
})
