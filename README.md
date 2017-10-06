Google Sheets APP
================

Read a Google Spreadsheet file and convert it into a JSON file using Node.js.

How?
---

## Set-up your Project

### Get your client_secret.json
Follow [Google's Documentation](https://developers.google.com/sheets/api/quickstart/nodejs) on how to turn on your Google Sheets API to create a `client_secret.json` file.

1. Use this [wizard](https://console.developers.google.com/flows/enableapi?apiid=sheets.googleapis.com) to create or select a project in the Google Developers Console and automatically turn on the API. Click **Continue**, then **Go to credentials**.
2. On the **Add credentials to your project** page, click the **Cancel** button.
3. At the top of the page, select the **OAuth consent screen** tab. Select an **Email address**, enter a **Product name** if not already set, and click the **Save** button.
4. Select the **Credentials** tab, click the **Create credentials** button and select **OAuth client ID**.
5. Select the application type **Other**, enter the name "Google Sheets API Quickstart", and click the **Create** button.
6. Click OK to dismiss the resulting dialog.
7. Click the download button (Download JSON) to the right of the client ID.
8. Move this file to your working directory and rename it `client_secret.json`.

### Install client library
```
$ npm install googleapis --save
$ npm install google-auth-library --save
```

When it's your first time to run your program on Node, the command prompt will give a link which you will need to get the token for authentication. After that, it will automatically read the token file which is located in your `C:\Users\user\.credentials\` directory. Any changes on the `SCOPES` variable on `exportData.js` will require you to delete the token file, which the cmd prompt will give you a new link to create a new token file.

## Google Spreadsheet
When creating your spreadsheet, take note that the first row will be the header row. The header row will be the "keys" to your json file.

## `getData(spreadsheetId, callback, worksheetName);`

* `spreadsheetId`: This parameter is required in order to successfully convert to JSON. You can find your spreadsheet's ID by looking at the url: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0`
* `callback`: This parater calls a callback function.
* `worksheetName`: This parameter has a default value of string `Sheet1`, which is the default name of the Spreadsheet's worksheet. If you need to call a different worksheet or if you renamed the default name, you can insert the name of the worksheet to this parameter.

Sample code for a different worksheet/renamed worksheet:

```js
const getData = require('exportData');
getData(spreadsheetId, function(err, data){
	if(err) throw err;
	console.log(data);
}, worksheetName);
```