const utils = require('../utils')
const PinnedModel = require('../models/pinned')
const handlePinned = function () {
    if (event.type == 'pin_added') {
        var id=event.item.message.user
        if(event.item.message.subtype!=undefined)id=event.item.message.username
        var pinned = new PinnedModel({
            channel: event.item.channel,
            message: event.item.message.text,
            sendBy: id,
            date: event.item.message.ts
        })
        pinned.save()
    } else if (event.type == 'pin_removed') {
        PinnedModel.findOne({
                date: event.item.message.ts
            },
            (err, pinned) => {
                pinned.remove()
            })
    }
}
module.exports = {
    handleEvent(req, res, next) {
        event = req.body.event;
        res.send({
            challenge: req.body.challenge
        });
        handlePinned(event)
    }
}