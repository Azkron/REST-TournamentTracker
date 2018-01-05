import * as mongoose from 'mongoose';
import { IMember } from './member'

let Schema = mongoose.Schema;

export interface ITournament extends mongoose.Document {
    name: string;
    start: string;
    finish: string;
    maxPlayers: Number;
    members: mongoose.Types.Array<IMember>;
}

let tournamentSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    start: {type: Date, required: true},
    finish: {type: Date},
    maxPlayers: {type: Number, default: 16},
    members: [{ type: Schema.Types.ObjectId, ref: 'Member' }]
});

export let Tournament = mongoose.model<ITournament>('Tournament', tournamentSchema);

export default Tournament;