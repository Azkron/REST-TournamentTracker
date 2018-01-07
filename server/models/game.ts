import * as mongoose from 'mongoose';
import { IMember } from './member'
import { ITournament } from './tournament';

let Schema = mongoose.Schema;

export interface IGame extends mongoose.Document {
    player_1: string;
    player_2: string;
    score_player_1: string;
    score_player_2: string;
    points_player_1: Number;
    points_player_2: Number;
    tournament: ITournament;
}

let GameSchema = new mongoose.Schema({
    player_1: { type: String },
    player_2: { type: String },
    score_player_1: { type: String, default: 'Waiting...', required: false },
    score_player_2: { type: String, default: 'Waiting...', required: false },
    points_player_1: { type: Number, default: 0, required: false },
    points_player_2: { type: Number, default: 0, required: false },
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament' }
});

export let Game = mongoose.model<IGame>('Game', GameSchema);

export default Game;