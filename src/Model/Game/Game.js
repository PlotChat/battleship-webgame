import { validateType } from '../../Utils/index';
import { 
    Player,
    GameSettings
} from '../../Model/index';
import { ArenaController } from '../../Controller/index';

export class Game {
    #players;
    #currPlayer;
    #currController;

    constructor({players = []} = {}){
        this.players = players;
    }

    set players(playerList) {
        validateType(playerList, "Player list" , Array);

        if (!(playerList.length == 0 || playerList.length == GameSettings.maxPlayers)) 
            throw new Error(`There must be 0 or ${GameSettings.maxPlayers} players`);
        
        playerList.forEach(player => {
            validateType(player, "Player", Player);
        });
        
        this.#players = playerList;
    }

    set currPlayer(player) {
        validateType(playerList, "Player", Player);
        this.#currPlayer = player;
    }

    set currController(controller) {
        validateType(controller, "Arena controller", ArenaController);
        this.#currController = controller;
    }

    get players(){ return this.#players };
    get currPlayer() { return this.#currPlayer };
    get currController() { return this.#currController };
}