export class GameLogic {
    static checkWinner(game) {
        let winners = [];
        if (
            game.currentRound == game.maxRounds ||
            game.players.some((player) => player.controller.arena.ships.length == 0)
        ) {
            let maxPoints = Math.max(...game.players.map((player) => player.points));
            game.players.forEach((player) => {
                if (player.points == maxPoints) winners.push(player);
            });
            return winners;
        }
        return null;
    }
}