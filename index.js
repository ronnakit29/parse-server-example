const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const args = process.argv || [];
const test = args.some(arg => arg.includes('jasmine'));
require('dotenv').config();
const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
const config = {
  databaseURI: databaseUri || 'mongodb://localhost:27017/baccarat-dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/api/v1',
  liveQuery: {
    classNames: ['Posts', 'Comments'],
  },
};

const app = express();

app.use('/public', express.static(path.join(__dirname, '/public')));

const mountPath = process.env.PARSE_MOUNT || '/api/v1';
if (!test) {
  const api = new ParseServer(config);
  app.use(mountPath, api);
}

app.get('/', function (req, res) {
  res.status(403).json({ http_code: 403, message: 'Forbidden' });
});

app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

const port = process.env.PORT || 1337;
if (!test) {
  const httpServer = require('http').createServer(app);
  httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
  });

  ParseServer.createLiveQueryServer(httpServer);
}

module.exports = {
  app,
  config,
};
