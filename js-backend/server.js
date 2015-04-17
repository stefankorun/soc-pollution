/* MONGODB */

// Start mongodb (optional)
//var child_process = require('child_process');
//child_process.exec('mongod --config ./db/mongodb.conf');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


/* EXPRESS */

var express = require('express');
var app = express();


app.get('/', function (req, res) {
    res.send({json: 'true'});
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});
