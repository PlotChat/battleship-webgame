import { Button } from "../../Components/Button";

const icons = {
	place: "➕",
	attack: "⚔️",
	sunk: "❌",
	water: "🔹",
};

export function ArenaBlock({ parent = null, block, variant = "place", variantTrigger }) {
	const arenaBlock = Button({
		content: icons[variant],
		callback: () => variantTrigger(block, variant),
		variant: "ghost",
	});
	arenaBlock.dataset.x = block.x;
	arenaBlock.dataset.y = block.y;

	arenaBlock.classList.add(`arena-block`);
	arenaBlock.classList.add(`${parent}__arena-block`);
	arenaBlock.classList.add(`arena-block--${variant}`);

	return arenaBlock;
}
