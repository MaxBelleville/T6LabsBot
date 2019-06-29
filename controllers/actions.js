const utils = require('../utils')
const fs = require('fs');
const web = utils.getWeb()
const ProjectModel = require('../models/projects')

function handleHelp(action) {
    if (action.actions[0].value == "goto_page2") {
        var obj = JSON.parse(fs.readFileSync('json/help2.json', 'utf8'))
        web.chat.update({
            channel: action.channel.id,
            ts: action.message.ts,
            blocks: obj
        });
    } else if (action.actions[0].value == "goto_page1") {
        var obj = JSON.parse(fs.readFileSync('json/help.json', 'utf8'))
        web.chat.update({
            channel: action.channel.id,
            ts: action.message.ts,
            blocks: obj
        });
    }
}
function createProj(action) {
    if(action.callback_id=='create-project'){
        var proj = new ProjectModel({
            projectName:  action.submission.proj_title,
            projectDesc:  action.submission.proj_desc,
            startDate:  action.submission.proj_date
         })
         proj.save()
    }
}

function handlePoll(action) {
}
module.exports = {
    handleAction(req, res, next) {
        action = JSON.parse(req.body.payload);
        if(!action.type.startsWith("dialog"))
        handleHelp(action)
        else {
        createProj(action)
        handlePoll(action)
        }
        res.send();
    }
}