const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    taskName: String,
    channel:String,
    ts:String
})
module.exports = mongoose.model('Task', TaskSchema);