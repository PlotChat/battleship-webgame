import { FlexBox } from '../Components/Layout/FlexBox';
import { Button } from '../Components/Button';
import { Text } from '../Components/Text';

export function MenuPage({playTrigger = () => {}, settingsTrigger = () => {}}){
    const menuPage = new FlexBox();
    menuPage.classList.add("page", "menu-page");
    
    const title = new Text({content: "Battleship", size: "2rem", variant: "bold"})
    title.classList.add("menu-page__title");

    
    const playButton = new Button({content: "Play", variant:"tree", callback: playTrigger});
    playButton.classList.add("menu-page__play-button");
    
    const settingsButton = new Button({content: "Settings", variant:"tree", callback: settingsTrigger});
    settingsButton.classList.add("menu-page__settings-button");
    
    const buttonWrapper = new FlexBox();
    buttonWrapper.append(playButton, settingsButton);

    menuPage.append(title, buttonWrapper);

    return menuPage;
}