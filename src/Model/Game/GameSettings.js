import { 
    Battleship,
    Carrier,
    Submarine,
    Destroyer,
    Cruiser
 } from '../../Model/Ship/index';

export class GameSettings{
    static getNewFleet() {
        return [
            new Battleship(),
            new Carrier(),
            new Submarine(),
            new Destroyer()
        ];
    }

   static maxPlayers = 2;
}