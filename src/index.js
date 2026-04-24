import { ArenaController, GameController } from "./Controller";
import { ViewController } from "./Controller/ViewController";
import { Arena, Player, PlayerPC } from "./Model/index";
import { Game } from "./Model/index";
import './global.css';

function initApp() {
    let gameController = new GameController();

    gameController.startGame(); 
}

initApp();
