import * as mongoose from 'mongoose';
import { IMember } from './member'
import { ITournament } from './tournament';

let Schema = mongoose.Schema;

export interface IGame extends mongoose.Document {
    player_1: string;
    player_2: string;
    score_player_1: string;
    score_player_2: string;
    tournament: string;
}

let GameSchema = new mongoose.Schema({
    player_1: { type: String },
    player_2: { type: String },
    score_player_1: { type: String },
    score_player_2: { type: String },
    tournament: { type: String }
});

export let Game = mongoose.model<IGame>('Game', GameSchema);

export default Game;