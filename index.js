// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

//var databaseUri = 'mongodb://heroku_3l5wqcf2:gc44r5bgdudg6i8qurtp7jmft9@ds117919.mlab.com:17919/heroku_3l5wqcf2';
var databaseUri = 'mongodb://transfer:prochnl1@iad2-c11-2.mongo.objectrocket.com:52934,iad2-c11-1.mongo.objectrocket.com:52934,iad2-c11-0.mongo.objectrocket.com:52934/heroku_3l5wqcf2?replicaSet=cb9a184b082641a5a754503261f07b49';


var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'PROchnl285dksoIlk031lKfiQOie02Kdla',
  masterKey: process.env.MASTER_KEY || 'sdk39b82oFKn59USb492bBSiqof23', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  enableAnonymousUsers: process.env.ANON_USERS || false,
  allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || false,
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website2.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
