const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PinnedSchema = new Schema({
    channel: String,
    message: String,
    sendBy: String,
    date: String
})
module.exports = mongoose.model('Pinned', PinnedSchema);