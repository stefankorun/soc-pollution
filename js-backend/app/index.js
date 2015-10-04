express.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-XSRF-TOKEN');
    next();
});

express.all('/*', function(req, res, next) {
    console.log('REQUEST from %s to %s', req.ip, req.url);
    next();
});

exports.models = require("./models");
exports.reader = require("./reader");
