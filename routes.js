var fs = require('fs');
var path = require('path');
var engine = require('shark-engine');
var walk = require('walk');

var routes = {
    init: function(router) {
        router.get('/run', function(req, res) {
            var task = req.query.task;
            switch (task) {
                case 'package': engine.package.run(); break;
                case 'discover': engine.discover.run(); break;
                case 'clean': engine.clean.run(); break;
            }
        });

        router.get('/media', function(req, res) {
            var channel = req.query.channel;
            getMedia(function(channels) { res.json(channels); }, channel);
        });

        router.get('/shows', function(req, res) {
            var show = req.query.show;
            var download = req.query.download;

            if (show && download) {
                res.redirect('/shows/' + show + '.zip');
            } else if (show) {
                res.redirect('/shows/' + show + '/' + show + '.json');
            } else {
               res.json(fs.readdirSync(engine.config.packaging.showLocation));
            }
        });
    }
};


function getMedia(cb, channel) {
    var channels = {};
    walker = walk.walk(engine.config.mediaDirectory);
    walker.on('file', function (root, fileStats, next) {
        var pth = root.split(path.sep);
        var channelname = pth[pth.length - 1];
        if (channel && channelname !== channel )  {
            next();
            return;
        }
        if (!channels[channelname]) {
            channels[channelname] = [];
        }
        channels[channelname].push(fileStats.name);
        next();
    });
    walker.on('end', function () { cb.apply(this, [channels]); });
}

module.exports = routes;