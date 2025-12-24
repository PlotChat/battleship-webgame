import { Game, Player } from '../../../Model/index';
import { expectPropertyValidation } from '../../../Utils/testUtils'

describe("Game class limits", () => {
    let getGame = () => new Game({players: [new Player(), new Player()]});
    
    expectPropertyValidation(getGame, 'players', [[{name: "Fish"}, {name: "Cat"}], [new Player()], undefined, null]);
})