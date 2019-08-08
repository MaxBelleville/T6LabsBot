const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepoSchema = new Schema({
    User: String,
    RepoName: String
})
module.exports = mongoose.model('Repo', RepoSchema);