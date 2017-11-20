import * as mongoose from 'mongoose';

var Schema = mongoose.Schema;

var memberSchema = new mongoose.Schema({
    pseudo: { type: String, required: true, unique: true },
    password: { type: String, default: '' },
    profile: { type: String, default: '' },
    birthdate: { type: Date },
    admin: { type: Boolean, default: false }
});

var Member = mongoose.model('Member', memberSchema);

export default Member;
