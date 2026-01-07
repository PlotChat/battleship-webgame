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
}) {
	if (arenaController == null)
		throw new Error(
			"Arena Controller must be selected to be created as an ArenaBoard"
		);
	validateType(arenaController, "Game", ArenaController);

	const arena = arenaController.arena;

	const arenaBoard = Grid();
	arenaBoard.classList.add(`arena-board`);
	arenaBoard.classList.add(`${parent}__arena-board`);
	arenaBoard.style.gridTemplateColumns = `repeat(${arena.size}, 1fr)`;

	for (let i = 0; i < arena.grid.length; i++) {
		const currentArenaBlock = new ArenaBlock({
			parent: parent,
			block: arena.grid[i],
			variant: variant,
			variantTrigger: variantTrigger,
		});

		arenaBoard.appendChild(currentArenaBlock);
	}

	return arenaBoard;
}
