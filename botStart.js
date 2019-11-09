require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const gitReader =require('./controllers/gitReader')
const cors = require('cors');
const app = express();
const http = require("http");
mongoose.connect("mongodb+srv://T6LabBot:4676Bell130@cluster0-fstub.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true })
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json());
require('./routes/routes')(app);
gitReader.start();