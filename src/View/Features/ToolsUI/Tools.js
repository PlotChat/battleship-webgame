import { Button } from "../../Components/Button";
import { FlexBox } from "../../Components/Layout/FlexBox";
import './style/tools.css';

export function Tools({
	parent = null,
	game = null,
	toolsRemoveTrigger = () => {},
	toolsAddTrigger = () => {},
}) {
	const tools = new FlexBox();
	tools.classList.add("tools");
	tools.classList.add(`${parent}__tools`);

	const addButton = new Button({
		content: "Add",
		callback: toolsAddTrigger,
	});

	const shipsWrapper = new FlexBox();
	shipsWrapper.classList.add(`${parent}__tools--ship-wrapper`);

	game.currentPlayer.ownedShips.forEach((ship) => {
		const shipButton = new Button({
			content: `${ship.name}`,
			variant: "ghost",
			callback: () => {
				game.currentArenaController.currentShip = ship;
				game.currentArenaController.currentLocation = [];
			},
		});

		shipButton.classList.add(`${parent}__tools--button`);

		shipsWrapper.append(shipButton);
	});

	const removeButton = new Button({
		content: "Remove",
		callback: toolsRemoveTrigger,
	});

    tools.append(addButton, shipsWrapper, removeButton);

	return tools;
}
