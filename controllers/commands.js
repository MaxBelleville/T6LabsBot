const utils = require('../utils')
const PinnedModel = require('../models/pinned')
const LinkModel = require('../models/link')
const ProjectModel = require('../models/projects')
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
        PinnedModel.find({}, (err, pins) => {
            if (pins.length != 0) {
                var pinned = []
                pins.forEach(pin => {
                    utils.getUserName(pin.sendBy, true, user => {
                        var obj = JSON.parse(fs.readFileSync('json/pin.json', 'utf8'))
                        obj[0].elements[0].text = utils.convertTS(pin.date)
                        obj[1].text.text = "*" + user.profile.real_name +
                            "*\n" + pin.message;
                        for (var i = 0; i < 3; i++) pinned.push(obj[i])
                    })

                })
                utils.getIm(req.body.user_id, result => {
                    web.chat.postMessage({
                        channel: result.id,
                        blocks: pinned,
                        text:""
                    })
                })
            }
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
        web.dialog.open({dialog:obj,trigger_id:req.body.trigger_id})
    },
    viewProj(req, res, next) {
        ProjectModel.find({}, (err,projs) => {
            if (projs.length != 0) {
                var project= []
                projs.forEach(proj => {
                    var obj = JSON.parse(fs.readFileSync('json/pin.json', 'utf8'))
                    obj[0].elements[0].text = proj.startDate;
                    obj[1].text.text = "*" + proj.projectName +
                        "*\n" + proj.projectDesc;
                    for (var i = 0; i < 2; i++) project.push(obj[i])
                })
                utils.getIm(req.body.user_id, result => {
                    web.chat.postMessage({
                        channel: result.id,
                        blocks: project
                    })
                })
            }
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
        LinkModel.find({}, (err, links) => {
            if (links.length != 0) {
                var linked= []
                links.forEach(link => {
                    var obj = JSON.parse(fs.readFileSync('json/link.json', 'utf8'))
                    obj[0].text.text = link.Link;
                    for (var i = 0; i < 2; i++) linked.push(obj[i])
                })
                utils.getIm(req.body.user_id, result => {
                    web.chat.postMessage({
                        channel: result.id,
                        blocks: linked
                    })
                })
            }
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
        console.log(req.body);
        res.send();
    },
    addRepo(req, res, next) {
        console.log(req.body);
        res.send();
    },
    delRepo(req, res, next) {
        console.log(req.body);
        res.send();
    },
    oath(req, res, next) {
        //Lazy way of doing things.
        console.log(req.query);
        web.oauth.access({client_id:"587041885090.675744099190",
        client_secret:"8dc273fe9dd2de330c76d92099fc6045",code:req.query.code}).then(ouath=>{
            console.log(ouath)
        });
        res.send();
    }
}