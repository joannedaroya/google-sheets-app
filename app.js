const express = require('express'),
	cors = require('cors'),
  getData = require('./exportData').getData;

const app = express(),
  port = 8000,
  sheetID = '1phNS9xchydYlAzle5suV5hjBTcjoPUBcp-AVCgyHZT0';

app.use(cors());

app.use(express.static('public'));

app.get('/data.json', cors(), (req,res) => {
  getData(sheetID, (err,data) => {
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});