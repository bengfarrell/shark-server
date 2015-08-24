var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var routes     = require('./routes');
var engine = require('shark-engine');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/media', express.static(engine.config.mediaDirectory));
app.use('/shows', express.static(engine.config.packaging.showLocation));

var port = process.env.PORT || 8080;
var router = express.Router();
routes.init(router);
app.use('/api', router);
app.listen(port);

console.log('Server running on ' + port);