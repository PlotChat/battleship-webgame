import { FlexBox } from "../Components/Layout/FlexBox";
import { ArenaBoard } from "../Features/Arena/ArenaBoard";
import { Text } from "../Components/Text";
import "./style/battle-page.css";

export function BattlePage({
	game = null,
	variant = "attack",
	variantTrigger = () => {},
} = {}) {
	const battlePage = new FlexBox();
	battlePage.classList.add("battle-page");

	// Add title to top of page
	const titleWrapper = new FlexBox();
	titleWrapper.classList.add("battle-page__title-wrapper");

	const title = new Text({
		content: `Round: ${game.currentRound}/${game.maxRounds}`,
		tag: "h1",
		size: "2rem",
		variant: "bold",
	});
	title.classList.add("battle-page__title");

	const subtitle = new Text({ 
        content: `${game.currentPlayer.name}'s turn`,
        tag: "p",
        size: "1.5rem",
        variant: "bold",
    });
	subtitle.classList.add("battle-page__subtitle");

	titleWrapper.append(title, subtitle);

	// Add arena in the middle
	const arenaBoard = new ArenaBoard({
		parent: "battle-page",
		arenaController: game.currentArenaController,
		variant: variant,
		variantTrigger: variantTrigger,
		hideShip: true
	});

	// Append everything to page
	battlePage.append(titleWrapper, arenaBoard);

	return battlePage;
}
