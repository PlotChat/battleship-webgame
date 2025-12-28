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
            new Destroyer(),
            new Cruiser()
        ];
    }

   static maxPlayers = 2;
}