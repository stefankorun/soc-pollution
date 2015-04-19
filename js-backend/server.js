global.mongoose = require('mongoose');
global.express = require('express')();
global.Q = require('bluebird');
global._ = require('lodash');

var app = require('./app');


/* MONGODB */
var mongoUrl;
if (process.argv[2] == 'localhost') {
    mongoUrl = 'localhost/soc-pollution';
} else if (process.argv[2] == 'network') {
    mongoUrl = '192.168.0.100:27017/soc-pollution';
} else {
    mongoUrl = 'mongodb://korun:korun@ds039261.mongolab.com:39261/soc-pollution';
}
console.log('SOC-POLLUTION databese served on', mongoUrl);
var mongoConn = mongoose.connect(mongoUrl).connection;
mongoConn.on('error', console.error.bind(console, 'connection error:'));
mongoConn.once('open', function () {
    // Generate test data
    //app.models.Station.dummy();

    setInterval(function () {
        // Read sensor data
        //app.models.Station.init({name: 'Station' + i, analysis: [{}, {}]}, true);
        //console.log(app.reader.getSensorsData());
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
