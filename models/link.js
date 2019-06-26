const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    Link: String
})
module.exports = mongoose.model('Link', LinkSchema);