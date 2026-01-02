import { validateType } from '../../Utils/index';
import { 
    Player,
    GameSettings
} from '../../Model/index';
import { ArenaController } from '../../Controller/index';

export class Game {
    #players;
    #currentPlayer;
    #currentArenaController;

    constructor({players = [], currentArenaController = null, currentPlayer} = {}){
        this.players = players;
        this.currentArenaController = currentArenaController;
        this.currentPlayer = players[0];
    }

    set players(playerList) {
        validateType(playerList, "Player list" , Array);

        if (!(playerList.length >= 0 && playerList.length <= GameSettings.maxPlayers)) 
            throw new Error(`There must be 0 or <= ${GameSettings.maxPlayers} players`);
        
        playerList.forEach(player => {
            validateType(player, "Player", Player);
        });
        
        this.#players = playerList;
    }

    set currentPlayer(player) {
        validateType(player, "Player", Player);
        this.#currentPlayer = player;
    }

    set currentArenaController(controller) {
        validateType(controller, "Arena controller", ArenaController);
        this.#currentArenaController = controller;
    }

    get players(){ return this.#players };
    get currentPlayer() { return this.#currentPlayer };
    get currentArenaController() { return this.#currentArenaController };
}