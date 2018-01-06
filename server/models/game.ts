import * as mongoose from 'mongoose';
import { IMember } from './member'
import { ITournament } from './tournament';

let Schema = mongoose.Schema;

export interface IGame extends mongoose.Document {
    player_1: IMember;
    player_2: IMember;
    score_player_1: string;
    score_player_2: string;
    tournament: ITournament;
}

let GameSchema = new mongoose.Schema({
    player_1: { type: Schema.Types.ObjectId, ref: 'Member' },
    player_2: { type: Schema.Types.ObjectId, ref: 'Member' },
    score_player_1: { type: String, default: 'Waiting...' },
    score_player_2: { type: String, default: 'Waiting...' },
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament' }
});

export let Game = mongoose.model<IGame>('Game', GameSchema);

export default Game;