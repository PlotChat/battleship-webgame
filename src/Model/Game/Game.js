import { validateType } from "../../Utils/index";
import { Player, GameSettings } from "../../Model/index";
import { ArenaController } from "../../Controller/index";

export class Game {
	#players;
	#currentPlayer;
	#currentArenaController;
	#currentRound;
	#maxRounds;

	constructor({
		players = [],
		currentArenaController = null,
		currentPlayer,
		maxRounds = null,
		currentRound = null,
	} = {}) {
		this.players = players;
		this.currentArenaController = currentArenaController;
		this.currentPlayer = currentPlayer;
        
        if(!(maxRounds || currentRound)){
            this.#maxRounds = Math.pow(this.#currentArenaController.arena.size, 2);
            this.#currentRound = 1;
        }
	}

	set players(playerList) {
		validateType(playerList, "Player list", Array);

		if (
			!(playerList.length >= 0 && playerList.length <= GameSettings.maxPlayers)
		)
			throw new Error(
				`There must be 0 or <= ${GameSettings.maxPlayers} players`
			);

		playerList.forEach((player) => {
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

	set maxRounds(rounds) {
		this.#maxRounds = rounds;
	}

	set currentRound(round) {
		this.#currentRound = round;
	}

	get players() {
		return this.#players;
	}
	get currentPlayer() {
		return this.#currentPlayer;
	}
	get currentArenaController() {
		return this.#currentArenaController;
	}
	get maxRounds() {
		return this.#maxRounds;
	}
	get currentRound() {
		return this.#currentRound;
	}
}
