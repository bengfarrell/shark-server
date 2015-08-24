var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var routes     = require('./routes');
var shark      = require('shark-engine');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/media', express.static(shark.config.mediaDirectory));
app.use('/shows', express.static(shark.config.packaging.showLocation));

var port = process.env.PORT || 8080;
var router = express.Router();
routes.init(router);
app.use('/api', router);
app.listen(port);

shark.schedule.run();

console.log('Server running on ' + port);