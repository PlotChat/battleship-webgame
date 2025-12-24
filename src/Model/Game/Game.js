import { Player } from '../Player/index';
import { validateType } from '../../Utils/validateInput';

export class Game {
    #players;
    #currentPlayer;

    constructor({players = []} = {}){
        this.players = players;
    }

    set players(playerList) {
        validateType(playerList, "Player list" , Array);

        if (!(playerList.length == 2 || playerList.length == 0)) 
            throw new Error("There must be 0 or 2 players");
        
        playerList.forEach(player => {
            validateType(player, "Player", Player);
        });
        
        this.#players = playerList;
    }

    set currentPlayer(player){
        validateType(playerList, "Player", Player);
        this.#currentPlayer = player;
    }

    get players(){ return this.#players };
    get currentPlayer() { return this.#currentPlayer };
}