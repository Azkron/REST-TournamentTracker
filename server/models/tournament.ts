import * as mongoose from 'mongoose';
import { IMember } from './member'
import { IGame } from './game'

let Schema = mongoose.Schema;

export interface ITournament extends mongoose.Document {
    name: string;
    start: string;
    finish: string;
    maxPlayers: Number;
    members: mongoose.Types.Array<IMember>;
    games: mongoose.Types.Array<IGame>;
}

let tournamentSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    start: {type: Date, required: true},
    finish: {type: Date},
    maxPlayers: {type: Number, default: 16},
    members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }]
});

export let Tournament = mongoose.model<ITournament>('Tournament', tournamentSchema);

export default Tournament;