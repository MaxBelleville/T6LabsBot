require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var localtunnel = require('localtunnel');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true
})
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());
require('./routes/routes')(app);

app.listen(port, () => {
  var tunnel = localtunnel(port, {
    subdomain: "t6labs-bot"
  }, (err, tunnel) => {
    console.log("We good: " + tunnel.url)
  });
});