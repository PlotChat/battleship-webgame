import { Game } from "../Model";
import { validateType } from "../Utils";
import { ViewController } from "./ViewController";
import { Arena } from "../Model";
import { ArenaController } from "./ArenaController";
import { Player, PlayerPC } from "../Model";

export class GameController {
	#viewController;
	#game;

	// Default to real user input if nothing is passed
	constructor({
		viewController = null,
		game = null,
	} = {}) {
		this.viewController = viewController;
		this.game = game;
	}

	startGame() {
		const appShell = document.querySelector("#app-shell");

		const p1Arena = new Arena({ name: "p1Arena", size: 7 });
		const p1ArenaController = new ArenaController({ arena: p1Arena });
		const p1 = new Player({ name: "p1", controller: p1ArenaController });

		const p2Arena = new Arena({ name: "p2Arena", size: 7 });
		const p2ArenaController = new ArenaController({ arena: p2Arena });
		const p2 = new PlayerPC({ name: "PC", controller: p2ArenaController });
		
		const game = new Game({ players: [p1, p2], currentArenaController: p1ArenaController, currentPlayer: p1 });

		const viewController = new ViewController({
			game: game,
			appContainer: appShell,
		});

		this.viewController = viewController;
		this.game = game;

		this.#viewController.displayMenuPage({
			playTrigger: () => this.handlePlayWithPC(),
		});
	}

	handlePlayWithPC() {
		// Make player place ships to start game
		this.handlePickAndPlaceShip(true);

		// Then make the player fight the PC
		// this.handleBattle(game, true);
	}

	handlePickAndPlaceShip(againstPC = false) {
		if (againstPC == true) {
			this.#viewController.displayPickPage({
				game: this.#game,
				variant: "place",
				callback: () => this.handleBattle("pc"),
			});
		}
	}

	handleBattle(player) {
		if (
			this.#game.currentPlayer.ownedShips.length !==
			this.#game.currentArenaController.arena.ships.length
		) {
			console.log("Player needs to place all ships");
			return;
		}

		if (player == "pc") {
			this.#game.currentArenaController = this.#game.players.find(
				(player) => player.name.toLowerCase() == "pc"
			).controller;
			this.#game.currentPlayer = this.#game.players.find(
				(player) => player.name.toLowerCase() !== "pc"
			);

			this.#viewController.displayBattlePage({
				options: "pc",
				callback: () => this.startGame(),
			});
		}
	}

	static checkWinner(game) {
		let winners = [];

		if (
			game.currentRound == game.maxRounds ||
			game.players.some((player) => {
				return player.controller.arena.ships.length == 0;
			})
		) {
			let maxPoints = Math.max(...game.players.map((player) => player.points));

			game.players.forEach((player) => {
				if (player.points == maxPoints) {
					winners.push(player);
				}
			});

			game.players.forEach(player => {
				console.log(player.name + " " + player.points);
			})
			return winners;
		}

		return null;
	}

	set viewController(controller) {
		if(controller !== null){
			validateType(controller, "View controller", ViewController);
		}
		this.#viewController = controller;
	}

	set game(obj) {
		if(obj !== null){
			validateType(obj, "Game", Game);
		}
		this.#game = obj;
	}
}
