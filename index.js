var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var routes          = require('./routes');
var shark           = require('shark-engine');
var path            = require('path');
var WebSocketServer = require('ws').Server;
var wsConnection;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + path.sep + 'public' ));
app.use('/node_modules', express.static(__dirname + path.sep + 'node_modules' ));
app.use('/media', express.static(shark.config.mediaDirectory));
app.use('/shows', express.static(shark.config.packaging.showLocation));
app.use('/analytics', express.static(shark.config.analytics.root));

var port = process.env.PORT || 8080;
var wsport = 8081;
var router = express.Router();
routes.init(router);
app.use('/api', router);
app.listen(port);

wss = new WebSocketServer({port: 8081});
wss.on('connection', function(ws) {
    wsConnection = ws;
    wsConnection.on('close', function() {
        wsConnection = null;
    });
    shark.logging.methods.push( function(type, message, detail) {
        if (!wsConnection) { return; }
        wsConnection.send(JSON.stringify({ type: 'log', logtype: type, message: message, detail: { date: detail.date, level: detail.level } }));
    });
});

shark.schedule.run();

console.log('Server running on ' + port);
console.log('Websockets running on ' + wsport);