import { ArenaBoard } from "../Features/Arena/ArenaBoard";
import { validateType } from "../../Utils";
import { Tools } from "../Features/ToolsUI/Tools";
import { Game } from "../../Model";
import { Text } from "../Components/Text";
import "./style/gameplay-page.css";
import { FlexBox } from "../Components/Layout/FlexBox";

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

	const gameplayPage = new FlexBox();
	gameplayPage.classList.add("page");
	gameplayPage.classList.add("gameplay-page");

	const titleWrapper = new FlexBox();
	titleWrapper.classList.add("gameplay-page__title-wrapper");

	const title = new Text({
		content: "Place your ships",
		variant: "bold",
		tag: "h1",
	});
	title.classList.add("gameplay-page__title");

	const subtitle = new Text({
		content: `Ships: ${game.currentArenaController.arena.ships.length}/${game.currentPlayer.ownedShips.length}`,
	});
	subtitle.classList.add("gameplay-page__subtitle");

	titleWrapper.append(title, subtitle);

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

	gameplayPage.append(titleWrapper, arenaBoard, tools);
	return gameplayPage;
}
