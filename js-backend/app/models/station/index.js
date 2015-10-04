/* MONGO DEFINES */
var sensThresh = {
    humidity: [28, 40],
    CH4: [0.85, 0.95],
    SO2: [0.35, 0.45],
    NO2: [0.98, 1.09],
    temp: [20, 35]
};
var mngSchema = new mongoose.Schema({
    Id: {type: String, unique: true},
    name: String,
    analysis: [{
        timestamp: {type: Date, default: randomDate},
        lat: {type: Number, default: randomLat},
        lon: {type: Number, default: randomLon},
        qos: {type: Number, default: 20},
        sensors: {
            humidity: {type: Number, default: randomHumidity},
            NO2: {type: Number, default: randomNO2},
            SO2: {type: Number, default: randomSO2},
            CH4: {type: Number, default: randomCH4},
            temp: {type: Number, default: randomTemp}
        }
    }]
});
var mngModel = mongoose.model('Station', mngSchema);

/* EXPORTS */
exports.init = function (data, saveFlag) {
    //var model = _.clone(new mngModel(data));
    var model = new mngModel(data);
    if (saveFlag) model.save();
    return model;
};

exports.query = {
    all: function (props) {
        var deferred = Q.defer();
        mngModel.find({}, props, function (err, data) {
            if (err) deferred.reject();
            deferred.resolve(data);
        });
        return deferred.promise;
    },
    analysis: function (params) {
        var deferred = Q.defer();
        var analysisArray = [];
        var mongoQuery = generateAnalysisQuery(params);
        mngModel.find(mongoQuery, 'analysis', function (err, data) {
            if (err) deferred.reject(err);
            _.each(data, function (station) {
                _.each(station.analysis, function (reading) {
                    analysisArray.push(reading);
                })
            });
            analysisArray = _.sortBy(analysisArray, 'timestamp');
            deferred.resolve(analysisArray);
        });
        return deferred.promise;
    }
};

exports.dummy = function () {
    mngModel.remove({}, function (err) {
        console.log('Clean Station collection data', err);
    });
    for (var i = 100; i < 130; i++) {
        exports.init({name: 'Station' + i, analysis: [{}, {}]}, true);
    }
};


/* MODEL ROUTES */
express.get('/station', function (req, res) {
    exports.query.all().then(function (data) {
        res.send(data);
    })
});
express.get('/station/analysis/', function (req, res) {
    exports.query.analysis(req.query).then(function (data) {
        res.send(data);
    })
});
express.get('/station/analysisAndroid', function (req, res) {
    exports.query.analysis(req.query).then(function (data) {
        res.send({
            data: data,
            thresh: sensThresh
        });
    })
});

express.get('/station/thresh', function (req, res) {
    res.send(sensThresh);
});

/* HELPERS */
function randomDate() {
    var start = function () {
      var d = new Date();
      d.setDate(d.getDate() - 5);
      return d;
    }();
    var end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function randomLat() {
    return _.random(41.102496, 41.132758);
}
function randomLon() {
    return _.random(20.767044, 20.831245);
}
function randomHumidity() {
    return _.random.apply(this, sensThresh.humidity);
}
function randomCH4() {
    return _.random.apply(this, sensThresh.CH4);
}
function randomSO2() {
    return _.random.apply(this, sensThresh.SO2);
}
function randomNO2() {
    return _.random.apply(this, sensThresh.NO2);
}
function randomTemp() {
    return _.random.apply(this, sensThresh.temp);
}
function generateAnalysisQuery(params) {
    var query = {};
    if (!params) return query;

    if (params.lat1 && params.lat2) {
        query['analysis.lat'] = {$gt: params.lat1, $lt: params.lat2};
    }
    if (params.lon1 && params.lon2) {
        query['analysis.lon'] = {$gt: params.lon1, $lt: params.lon2};
    }
    if (params.date) {
        var date = new Date(decodeURIComponent(params.date));
        query['analysis.timestamp'] = {$gt: date, $lt: (new Date()).setDate(date.getDate() + 1)};
    }
    return query;
}
