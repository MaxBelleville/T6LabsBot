//Utility functions to simplify reading from slack
const {WebClient} = require('@slack/web-api');
const token = process.env.SLACK_AUTH_TOKEN;
const web = new WebClient(token);
module.exports = {
    getWeb() {
        return web;
    },

    getIm(userId, callback) {
        web.im.list().then(result => {
            result.ims.forEach(channel => {
                if (channel.user == userId) {
                    callback(channel);
                }
            })
        })
    },
    getUserName(userSnippet, sendOne, callback) {
        var counter = 0
        web.users.list().then(result => {
            result.members.forEach(user => {
                if (!sendOne || counter == 0) {
                    if (user.id == userSnippet ||
                        user.name.toLowerCase().includes(userSnippet.toLowerCase()) ||
                        user.profile.real_name.toLowerCase().includes(userSnippet.toLowerCase()) ||
                        user.profile.display_name.toLowerCase().includes(userSnippet.toLowerCase())) {
                        counter++;
                        callback(user);
                    }
                }
            })
        })
    },
    convertTS(timestamp) {
        var months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ]
        var days = ["Sunday", "Monday", "Tuesday", "Wensday", "Thursday", "Friday",
            "Saturday"
        ]
        var amPm = "AM"
        var date = new Date(timestamp * 1000);
        var hours = date.getHours();
        if (hours >= 12) {
            hours -= 12;
            amPm = "PM";
        }
        var minutes = "0" + date.getMinutes();
        var formattedTime = hours + ':' + minutes.substr(-2) + ' ' + amPm

        var year = date.getFullYear();
        var month = months[date.getMonth()]
        var day = days[date.getDay()]
        var date = date.getDate();

        var formattedDate = day + ', ' + month + ' ' + date + ', ' + year
        return formattedDate + ', ' + formattedTime;
    },
    deleteMessages(channelID, numberOfMessages, userID) {
        var obj = web.channels
        if (channelID.startsWith("D")) obj = web.im
        //Zero is infinitity
        if (numberOfMessages == 0 && userID == '0') {
            obj.history({
                channel: channelID
            }).then(result => {
                result.messages.forEach(user => {
                    web.chat.delete({
                        channel: channelID,
                        ts: user.ts
                    })
                })
            })
        } else if (numberOfMessages == 0) {
            obj.history({
                channel: channelID
            }).then(result => {
                result.messages.forEach(user => {
                    if (user.user == userID || user.username == userID)
                        web.chat.delete({
                            channel: channelID,
                            ts: user.ts
                        })
                })
            })
        } else if (userID == '0') {
            obj.history({
                channel: channelID
            }).then(result => {
                result.messages.forEach(user => {
                    if (numberOfMessages > 0)
                        web.chat.delete({
                            channel: channelID,
                            ts: user.ts
                        })
                    numberOfMessages--
                })
            })
        } else {
            obj.history({
                channel: channelID
            }).then(result => {
                result.messages.forEach(user => {
                    if (numberOfMessages > 0 && (user.user == userID || user.username == userID))
                        web.chat.delete({
                            channel: channelID,
                            ts: user.ts
                        })
                    numberOfMessages--
                })
            })
        }
    }
}