const events = require('../controllers/events')
const actions = require('../controllers/actions')
const commands = require('../controllers/commands')
module.exports = function (app) {
    app.post('/events', events.handleEvent)
        .post('/actions', actions.handleAction)
        
        .post('/commands/addRepo', commands.addRepo)
        .post('/commands/delRepo', commands.delRepo)
	.post('/commands/viewRepo', commands.viewRepo)

        .post('/commands/newProj', commands.newProj)
        .post('/commands/viewProj', commands.viewProj)
        .post('/commands/delProj', commands.delProj)

        .post('/commands/newLink', commands.newLink)
        .post('/commands/viewLink', commands.viewLink)
        .post('/commands/delLink', commands.delLink)


        .post('/commands/help', commands.help)
        .post('/commands/pin', commands.pin)
        .post('/commands/clear', commands.clear)
        .post('/commands/poll', commands.poll)
        .post('/commands/task',commands.task)
	.get('/oath',commands.oath)
};