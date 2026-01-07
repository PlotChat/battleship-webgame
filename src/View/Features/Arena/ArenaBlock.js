import { Battleship } from "../../../Model";
import { Button } from "../../Components/Button";
import './style/arena-block.css';

const buttonIcons = {
	place: "➕",
	attack: "⚔️",
	remove: "❌",
	sunk: "💥",
	water: "🔹",
};

const shipIcon = "🛳️";


export function ArenaBlock({ parent = null, block, variant = "place", variantTrigger }) {
	const arenaBlock = Button({
		content: !block.isShipLoc ? buttonIcons[variant] : shipIcon,
		callback: () => variantTrigger(block, variant),
		variant: "ghost",
	});

	arenaBlock.dataset.x = block.x;
	arenaBlock.dataset.y = block.y;

	arenaBlock.classList.add(`arena-block`);
	arenaBlock.classList.add(`${parent}__arena-block`);

	if(!block.isShip){
		arenaBlock.classList.add(`arena-block--${variant}`);
	} else{
		arenaBlock.classList.add(`arena-block--${shipIcon}`);
	}

	return arenaBlock;
}
