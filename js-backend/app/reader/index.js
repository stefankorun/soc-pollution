var _ = require('lodash'); // quickfix
var path = require('path');


function getSensorsData () {
    fs = require('fs');

    var appDir = path.dirname(require.main.filename);
    fs.readFile(path.dirname(require.main.filename) + '/python/sensors', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        console.log(parseToObject(data));
    });
}

function parseToObject(string) {
    string = string.trim();
    var theObject = {};
    var measurements = string.split('_');
    _.each(measurements, function (measure) {
        var temp = measure.split('-');
        theObject[temp[0]] = temp[1];
    });
    return theObject;
}

exports.getSensorsData = getSensorsData;