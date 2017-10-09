const app = require('./app'),
	http = require('http');

let port = process.env.PORT || 80;
app.set('port', port);

let server = http.createServer(app);
server.listen(port, () => console.log(`App listening on port ${port}`));