global.mongoose = require('mongoose');
global.express = require('express')();
global.Q = require('bluebird');
global._ = require('lodash');

var app = require('./app');

/* MONGODB */
//var mongoUrl = 'localhost/soc-pollution';
var mongoUrl = 'mongodb://korun:korun@ds039261.mongolab.com:39261/soc-pollution';
var mongoConn = mongoose.connect(mongoUrl).connection;
mongoConn.on('error', console.error.bind(console, 'connection error:'));
mongoConn.once('open', function () {
    //for (var i = 0; i < 10; i++) {
    //    app.models.Station.init({name: 'Station' + i, analysis: [{}, {}]}, true);
    //}

    setInterval(function () {
        console.log(app.reader.getSensorsData());
    }, 2000);
});


/* EXPRESS */

express.get('/', function (req, res) {
    res.send('Hello');
});

var server = express.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('SOC-POLLUTION build date: %s', new Date());
    console.log('SOC-POLLUTION server listening at http://%s:%s', host, port);
});
