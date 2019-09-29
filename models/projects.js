const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    projectName: String,
    projectDesc: String,
    startDate: String
})
module.exports = mongoose.model('Project', ProjectSchema);