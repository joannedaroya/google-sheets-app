const express = require('express'),
	cors = require('cors'),
	getData = require('./exportData');

const app = express(),
	sheetID = '1phNS9xchydYlAzle5suV5hjBTcjoPUBcp-AVCgyHZT0';

app.use(cors());
app.use(express.static('public'));

app.use('/data', (req,res) => {
  getData(sheetID, (err,data) => res.json(data));
});

module.exports = app;