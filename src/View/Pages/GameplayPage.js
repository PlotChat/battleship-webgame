import { ArenaBoard } from "../Features/Arena/ArenaBoard";
import { validateType } from "../../Utils";
import { Tools } from "../Features/ToolsUI/Tools";
import { Game } from "../../Model";
import "./style/gameplay-page.css";
export function GameplayPage({
	game = null,
	variant = null,
	variantTrigger = () => {},
	toolsAddTrigger = () => {},
	toolsRemoveTrigger = () => {},
}) {
	if (game == null) throw new Error("Game must be selected to display");
	if (variant == null) throw new Error("Variant must be assigned to display");

	validateType(game, "Arena", Game);
	validateType(variant, "Gameplay page variant", String);

	const gameplayPage = document.createElement("div");
	gameplayPage.className = "page gameplay-page";

	const arenaBoard = new ArenaBoard({
		parent: "gameplay-page",
		arenaController: game.currentArenaController,
		variant: variant,
		variantTrigger: variantTrigger,
	});

	const tools = new Tools({
		parent: "gameplay-page",
		game: game,
		toolsAddTrigger: toolsAddTrigger,
		toolsRemoveTrigger: toolsRemoveTrigger,
	});

	gameplayPage.append(arenaBoard, tools);
	return gameplayPage;
}
