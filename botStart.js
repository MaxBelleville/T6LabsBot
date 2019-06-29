require('dotenv').config()

const exec = require('child_process').exec;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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
app.listen(port, ()=>{
  child = exec("ssh -R t6labs-bot:80:localhost:"+port+" serveo.net");
});