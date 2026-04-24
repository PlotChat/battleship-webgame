import { validateType } from "../../../Utils";
import { Grid } from "../../Components/Layout/Grid";
import { ArenaBlock } from "./ArenaBlock";
import { ArenaController } from "../../../Controller";
import "./style/arena-board.css";

export function ArenaBoard({
	parent = null,
	arenaController = null,
	variant = null,
	variantTrigger = () => {},
	hideShip = false,
}) {
	const arenaBoard = Grid();

	if (arenaController == null){
		return arenaBoard;
	}
		
	const arena = arenaController.arena;

	arenaBoard.classList.add(`arena-board`);
	arenaBoard.classList.add(`${parent}__arena-board`);
	arenaBoard.style.gridTemplateColumns = `repeat(${arena.size}, 1fr)`;

	for (let i = 0; i < arena.grid.length; i++) {
		const currentArenaBlock = new ArenaBlock({
			parent: parent,
			block: arena.grid[i],
			variant: variant,
			variantTrigger: variantTrigger,
			hideShip: hideShip,
		});

		arenaBoard.appendChild(currentArenaBlock);
	}

	return arenaBoard;
}
