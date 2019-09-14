var request = require('request');
const RepoModel = require('../models/repo')
const utils = require('../utils')
const web = utils.getWeb()

var noRepeat = []

function convertDate(gitDate) {
    var DateTime = gitDate.replace('Z', '').split('T');
    var splitDate = DateTime[0].split('-');
    var splitTime = DateTime[1].split(':');
    var year = parseInt(splitDate[0], 10)
    var month = parseInt(splitDate[1], 10) - 1
    var day = parseInt(splitDate[2], 10)
    var hour = parseInt(splitTime[0]) - 4 //Timezone
    var min = parseInt(splitTime[1])
    var sec = parseInt(splitTime[2])
    return new Date(year, month, day, hour, min, sec);
}

function isHourAway(commitDate) {
    var isRepeated = false;
    for (var i = 0; i < noRepeat.length; i++) {
        if (commitDate.getTime() === noRepeat[i].getTime()) isRepeated = true;
    }

    var date = new Date();
    var diff = Math.abs(date.getTime() - commitDate.getTime());
    var diffMin = Math.ceil(diff / (60000));
    if (!isRepeated) noRepeat.push(commitDate);
    if (diffMin > 60 && isRepeated) {
        var index = noRepeat.indexOf(commitDate);
        noRepeat.slice(index,1);
    }
    return diffMin <= 60 && !isRepeated
}

function read() {
    RepoModel.find({}, (err, repos) => {
        repos.forEach(repo => {
            var gitURL = 'https://api.github.com/repos/' + repo.User + '/' + repo.RepoName + "/branches"
            option = {
                url: gitURL,
                headers: {
                    'User-Agent': 'Req',
                    'Authorization': 'token ' + process.env.GIT_TOKEN
                }
            }
            request(option, (error, response, body) => {
                var obj = JSON.parse(body);
                if (obj.message != undefined)
                    console.log(obj.message);
                for (var i = 0; i < obj.length; i++) {
                    option = {
                        url: obj[i].commit.url + "",
                        headers: {
                            'User-Agent': 'Req',
                            'Authorization': 'token ' + process.env.GIT_TOKEN
                        }
                    }
                    request(option, (error, response, body) => {
                        obj = JSON.parse(body);
                        var date = convertDate(obj.commit.author.date);
                        if (isHourAway(date)) {
				console.log("Yay an new push to github");
                            web.chat.postMessage({
                                channel: 'CLR1Y2PV0',
                                text: "New commit: *" + obj.commit.message + "*, by: *" + obj.commit.author.name + "*"
                            })
                        }
                    });
                }
            });
        })
    })
}

module.exports = {
    start() {
	console.log("API succesfully started, reading git");
	read()
        setInterval(read, 1000 * 3600);
    }
}