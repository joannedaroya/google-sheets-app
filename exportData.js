const fs = require('fs'),
  readline = require('readline'),
  google = require('googleapis'),
  googleAuth = require('google-auth-library');

let SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
let TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
let TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

exports.getData = function(spreadsheetId, callback, worksheetName = 'Sheet1') {
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }

    authorize(JSON.parse(content), getDataFromSheets);
  });

  function authorize(credentials, callback) {
    let clientSecret = credentials.installed.client_secret;
    let clientId = credentials.installed.client_id;
    let redirectUrl = credentials.installed.redirect_uris[0];
    let auth = new googleAuth();
    let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
      }
    });
  }

  function getNewToken(oauth2Client, callback) {
    let authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        callback(oauth2Client);
      });
    });
  }

  function storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
  }

  function getDataFromSheets(auth) {
    let sheets = google.sheets('v4');
    ranges = [
      `${worksheetName}!1:1`,
      `${worksheetName}!A2:Z`
    ];
    sheets.spreadsheets.values.batchGet({
      auth: auth,
      spreadsheetId: spreadsheetId,
      ranges: ranges,
    }, (err,response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      let rows = response.valueRanges;
      if (rows.length == 0) {
        console.log('No data found.');
      } else {
        let getKeys = rows[0].values;
        let keys = getKeys[0];
        keys = keys.map(name => name.split(" ").join("_").toLowerCase());
        let values = rows[1].values;

        let data = values.map(value => {
          let result = {};
          keys.forEach((keys, idx) => result[keys] = value[idx]);
          return result;
        });

        callback(null,data);
      }
    });
  }
}