require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const gitReader =require('./controllers/gitReader')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 80;
const http = require("http");
mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true })
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}))
setInterval(function() {
    http.get("http://t6bot.herokuapp.com");
}, 300000);

app.use(bodyParser.json());
require('./routes/routes')(app);
app.listen(port,()=>{
gitReader.start(); });