const utils = require('../utils')
const PinnedModel = require('../models/pinned')
const LinkModel = require('../models/link')
const ProjectModel = require('../models/projects')
const RepoModel = require('../models/repo')
const fs = require('fs');
const web = utils.getWeb()
module.exports = {
    help(req, res, next) {
        res.send();
        utils.getIm(req.body.user_id, result => {
            var obj = JSON.parse(fs.readFileSync('json/help.json', 'utf8'))
            web.chat.postMessage({
                channel: result.id,
                blocks: obj
            })
        })
    },
    pin(req, res, next) {
        res.send();
                var pinned = []
        PinnedModel.find({}, (err, pins) => {
            if (pins.length != 0) {
                pins.forEach(pin => {
                    utils.getUserName(pin.sendBy, true, user => {
                        var obj = JSON.parse(fs.readFileSync('json/pin.json', 'utf8'))
                        obj[0].elements[0].text = utils.convertTS(pin.date)
                        obj[1].text.text = "*" + user.profile.real_name +
                            "*\n" + pin.message;
                        for (var i = 0; i < 3; i++) pinned.push(obj[i])
                    })

                })
            }
            }).then(p=>{
                utils.getIm(req.body.user_id, result => {
                    web.chat.postMessage({
                        channel: result.id,
                        blocks: pinned
                    })
                })
            })
    },
    clear(req, res, next) {
        res.send();
        if (req.body.text != '') {
            var messages = req.body.text.replace("@", "").split(" ");
            if (isNaN(messages[0])) {
                if (messages.length > 1) {
                    utils.getUserName(messages[0], true, user => {
                        if (user.is_bot) utils.deleteMessages(req.body.channel_id, messages[1], user.profile.real_name)
                        else utils.deleteMessages(req.body.channel_id, messages[1], user.id)
                    })
                } else {
                    utils.getUserName(messages[0], true, user => {
                        if (user.is_bot) utils.deleteMessages(req.body.channel_id, 0, user.profile.real_name)
                        else utils.deleteMessages(req.body.channel_id, 0, user.id)
                    })
                }
            } else
                utils.deleteMessages(req.body.channel_id, messages[0], '0')
        } else
            utils.deleteMessages(req.body.channel_id, 0, '0')
    },
    newProj(req, res, next) {
        res.send();
        var obj = JSON.parse(fs.readFileSync('json/project.json', 'utf8'))
        web.dialog.open({
            dialog: obj,
            trigger_id: req.body.trigger_id
        })
    },
    viewProj(req, res, next) {
                var project = []
        ProjectModel.find({}, (err, projs) => {
            if (projs.length != 0) {
                projs.forEach(proj => {
                    var obj = JSON.parse(fs.readFileSync('json/pin.json', 'utf8'))
                    obj[0].elements[0].text = proj.startDate;
                    obj[1].text.text = "*" + proj.projectName +
                        "*\n" + proj.projectDesc;
                    for (var i = 0; i < 3; i++) project.push(obj[i])
                })
            }
            }).then(p=>{
                utils.getIm(req.body.user_id, result => {
                    web.chat.postMessage({
                        channel: result.id,
                        blocks: project
                    })
                })
            })
        res.send();
    },
    delProj(req, res, next) {
        res.send();
        ProjectModel.findOne({
                projectName: req.body.text
            },
            (err, proj) => {
                proj.remove()
            })
    },
    viewLink(req, res, next) {
                var linked = []
        LinkModel.find({}, (err, links) => {
            if (links.length != 0) {
                links.forEach(link => {
                    var obj = JSON.parse(fs.readFileSync('json/link.json', 'utf8'))
                    obj[0].text.text = link.Link;
                    for (var i = 0; i < 2; i++) linked.push(obj[i])
                })
            }
        }).then(l=>{
                utils.getIm(req.body.user_id, result => {
                    web.chat.postMessage({
                        channel: result.id,
                        blocks: linked
                    })
                })
            })
        res.send();
    },
    newLink(req, res, next) {
        var link = new LinkModel({
            Link: req.body.text
        })
        link.save()
        res.send();
    },
    delLink(req, res, next) {
        LinkModel.findOne({
                Link: req.body.text
            },
            (err, link) => {
                link.remove()
            })
        res.send();
    },
    poll(req, res, next) {
        res.send();
        var obj = JSON.parse(fs.readFileSync('json/poll.json', 'utf8'))
        if (!req.body.channel_id.startsWith("D")) obj.elements[2].value = req.body.channel_id
        web.dialog.open({
            dialog: obj,
            trigger_id: req.body.trigger_id
        })
    },
    addRepo(req, res, next) {
        var splitUrl= req.body.text.replace(".git","").split("/")
        var repo = new RepoModel({
            User: splitUrl[splitUrl.length-2],
            RepoName: splitUrl[splitUrl.length-1]
        })
        repo.save();
        res.send();
    },
 viewRepo(req, res, next) {
                var repos = []
        RepoModel.find({}, (err, repo) => {
              if (repo.length != 0) {
                repo.forEach(repo => {
                    var obj = JSON.parse(fs.readFileSync('json/link.json', 'utf8'))
                    obj[0].text.text = "https://github.com/"+repo.User+"/"+repo.RepoName;
                    for (var i = 0; i < 2; i++) repos.push(obj[i])
                })
            }
        }).then(r=>{
                utils.getIm(req.body.user_id, result => {
                    web.chat.postMessage({
                        channel: result.id,
                        blocks: repos
                    })
                })
        })
        res.send();
    },
    delRepo(req, res, next) {
        var splitUrl= req.body.text.replace(".git","").split("/")
        RepoModel.findOne({
            RepoName: splitUrl[splitUrl.length-1],
            User: splitUrl[splitUrl.length-2]
        },
        (err, repo) => {
            repo.remove()
        })
        res.send();
    },
    task(req, res, next) {
        res.send();
        var obj = JSON.parse(fs.readFileSync('json/taskCreate.json', 'utf8'))
        web.dialog.open({
            dialog: obj,
            trigger_id: req.body.trigger_id
        })
    },
    oath(req, res, next) {
        web.oauth.access({client_id:process.env.SLACK_CLIENT_ID,
        client_secret:process.env.SLACK_CLIENT_SECRET,code:req.query.code}).then(ouath=>{
            console.log(ouath)
        });
        res.send();
    }
}