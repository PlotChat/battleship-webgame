import { ArenaController, GameController } from './Controller';
import { 
    Arena,
    Player,
} from './Model/index'

function initApp(){
    let p1Arena = new Arena({size: 7});
    let p1ArenaController = new ArenaController({area: p1Arena});
    let p1 = new Player({name: "p1", controller: p1ArenaController});

    let game = new GameController({ players: [p1]});

    setTimeout(() => game.startGame([p1]), 3000);
}

initApp();