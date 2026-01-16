import { ArenaController, GameController } from "./Controller";
import { ViewController } from "./Controller/ViewController";
import { Arena, Player } from "./Model/index";
import { Game } from "./Model/index";
import './global.css';

function initApp() {
    let p1Arena = new Arena({ size: 7 });
    let p1ArenaController = new ArenaController({ arena: p1Arena }); 
    let p1 = new Player({ name: "p1", controller: p1ArenaController });

    let game = new Game({players: [p1], currentArenaController: p1ArenaController, currentPlayer: p1});

    const appShell = document.getElementById("app-shell");

    let viewController = new ViewController({
        game: game,
        appContainer: appShell,
    });

    let gameController = new GameController({
        inputProvider: null,
        viewController: viewController,
        game: game,
    });

    gameController.startGame([p1]); 
}

initApp();
