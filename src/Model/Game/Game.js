import {Player} from './Player/index';

export default class Game{
    #gridSize;
    #players;
    #currentPlayer;

    constructor(gridSize, players, currentPlayer){
        this.gridSize = gridSize;
        this.players = players;
        this.currentPlayer = currentPlayer;
    }

    set gridSize(size) {
        this.#gridSize = size;
    }

    set players(playerList) {
        if (!Array.isArray(playerList)) throw new Error("Player list needs to be an Array");
        this.#players = playerList;
    }

    set currentPlayer(player){
        if(player instanceof Player == false) throw new Error("Current needs to be a Player object"); 
        this.#currentPlayer = player;
    }

    get gridSize(){ return this.#gridSize };
    get players(){ return this.#players };
    get currentPlayer() { return this.#currentPlayer };
}