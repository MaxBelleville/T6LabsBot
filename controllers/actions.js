const utils = require('../utils')
const fs = require('fs');
const web = utils.getWeb()
var answerAmount
var pollObj
var pollQuestion
var userVoted = []
const ProjectModel = require('../models/projects')
const TaskModel = require('../models/task')

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
    } else if (action.actions[0].value == "poll_continue") {
        web.dialog.open({
            dialog: pollObj,
            trigger_id: action.trigger_id
        })
    } else if (action.actions[0].value.startsWith("answer_")) {
        var poll = action.message.blocks
        var hasUserVoted = false
        for (var i = 0; i < userVoted.length; i++) {
            if (userVoted[i].user == action.user.id && userVoted[i].ts == action.message.ts)
                hasUserVoted = true
        }
        if (!hasUserVoted) {
            var str = action.actions[0].value.replace("answer_", "")
            var indx = (parseInt(str) * 2) + 1
            var voteText = poll[indx].elements[0].text
            var votes = 1
            if (!voteText.startsWith("No")) {
                votes = parseInt(voteText.split(" ")[0]) + 1
                poll[indx].elements[0].text = votes + " Votes"
            } else
                poll[indx].elements[0].text = votes + " Vote"
            web.chat.update({
                channel: action.channel.id,
                ts: action.message.ts,
                blocks: poll
            });
            userVoted.push({
                user: action.user.id,
                ts: action.message.ts
            })
        }
    }
}

function handleTask(action){
    if (action.actions[0].value == "complete_task") {
        var text = action.message.blocks[0].elements[0].text;
        TaskModel.find({ts: text}, (err, task) => {
            utils.getUserName(action.user.id,true,user=>{
                web.chat.postMessage({
                    channel: task[0].channel,
                    text: "*"+user.real_name+"* completed the task, *"+task[0].taskName+"*"
                })
            })
        })
    }
}

function createProj(action) {
    if (action.callback_id == 'create-project') {
        var proj = new ProjectModel({
            projectName: action.submission.proj_title,
            projectDesc: action.submission.proj_desc,
            startDate: action.submission.proj_date
        })
        proj.save()
    }
}


function createTask(action){
    if (action.callback_id == 'create-task') {
        var date = utils.convertTS(action.action_ts)
        var task = new TaskModel({
            taskName: action.submission.task_title,
            channel: action.submission.channel,
            ts: date
        })
        task.save()
        var obj = JSON.parse(fs.readFileSync('json/taskSend.json', 'utf8'))

        obj[0].elements[0].text=date;
        obj[1].text.text="*"+action.submission.task_title+"*\n"+action.submission.task_desc;
        if(action.submission.user==null){
            web.chat.postMessage({
                blocks: obj,
                channel: action.submission.channel
            })
        }
        else {
        utils.getUserName(action.submission.user,true, user=>{
            utils.getIm(user.id, result => {
                web.chat.postMessage({
                    channel: result.id,
                    blocks: obj
                })
            })
        })
        }
    }
}

function handlePoll(action) {
    if (action.callback_id == 'create-poll') {
        var obj = JSON.parse(fs.readFileSync('json/poll2.json', 'utf8'))
        answerAmount = parseInt(action.submission.answer_num)
        pollQuestion = action.submission.poll_question
        for (var i = 0; i < answerAmount; i++) {
            var ansItem = JSON.parse(fs.readFileSync('json/answerItem.json', 'utf8'))
            ansItem.label = "Answer " + (i + 1) + ":"
            ansItem.name = "answer_" + (i + 1)
            ansItem.placeholder = "Please input answer " + (i + 1)
            obj.elements.push(ansItem)
        }
        var nextPart = JSON.parse(fs.readFileSync('json/pollContinue.json', 'utf8'))
        web.chat.postEphemeral({
            blocks: nextPart,
            user: action.user.id,
            channel: action.submission.channel
        })
        pollObj = obj
    }
    if (action.callback_id == 'start-poll') {
        var counter = 0;
        var obj = JSON.parse(fs.readFileSync('json/displayPoll.json', 'utf8'))
        obj[0].text.text = "*" + pollQuestion + "*";
        for (var i in action.submission) {
            counter++;
            if (counter <= answerAmount) {
                var ans = JSON.parse(fs.readFileSync('json/dPollAns.json', 'utf8'))
                ans[0].text.text = '*' + action.submission[i] + '*';
                ans[0].accessory.value = i;
                for (var i = 0; i < 2; i++) obj.push(ans[i])
            }

        }
        obj.push({
            type: "divider"
        });
        web.chat.postMessage({
            blocks: obj,
            channel: action.channel.id
        })
        pollFinalObj = obj
    }
}
module.exports = {
    handleAction(req, res, next) {
        action = JSON.parse(req.body.payload);
        if (!action.type.startsWith("dialog")) {
            handleHelp(action)
            handleTask(action)
        }
        else {
            createProj(action)
            createTask(action)
            handlePoll(action)
        }
        res.send();
    }
}