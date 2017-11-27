import * as mongoose from 'mongoose';
import { ITournament, Member } from './member'

let Schema = mongoose.Schema;

let tournamentSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    start: {type: Date, required: true},
    finish: {type: Date},
    maxPlayers: {type: Number, default: 16},
    members: [{ type: Schema.Types.ObjectId, ref: 'Member' }]
});

export let Tournament = mongoose.model<ITournament>('Tournament', tournamentSchema);

export default Tournament;