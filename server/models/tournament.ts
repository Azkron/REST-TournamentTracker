import * as mongoose from 'mongoose';

var Schema = mongoose.Schema;

var tournamentSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    start: {type: Date, required: true},
    finish: {type: Date},
    maxPlayers: {type: Number, default: 16}
});

var Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;