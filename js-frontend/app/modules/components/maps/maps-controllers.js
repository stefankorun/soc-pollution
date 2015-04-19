angular.module('sp.modules.components.maps.controllers', [])
  .controller('mapsController', function ($scope, uiGmapGoogleMapApi, mapsService, $filter) {

    mapsService.getThreshold().then(function(data){
      $scope.threshold = data;
      console.log(lastMapData);
      if(lastMapData) debounceStations(lastMapData);
    });

    $scope.$watch('sensorType', function(){
      if(lastMapData) debounceStations(lastMapData);
    });
    var lastMapData = null;
    $scope.bounds = {};
    $scope.map = {
      center: {latitude: 51.219053, longitude: 4.404418 },
      zoom: 14,
      events: {
        bounds_changed: function (maps, event, arguments) {
          $scope.bounds = maps.getBounds();
          getData();
        }
      }
    };
    $scope.daysBefore = 0;
    $scope.doneInit = false;
    $scope.stations = [];
    $scope.options = {scrollwheel: true};

    Object.defineProperty($scope, 'center', {
      get: function () {
        return $scope.c;
      },
      set: function (val) {
        $scope.map.center = val;
        $scope.c = val;
      }
    });

    function getData(){
      var date = new Date();
      date = (new Date()).setDate(date.getDate() + $scope.daysBefore);
      date = $filter('date')(date, 'yyyy-MM-dd');

      var data = {
        lat1: $scope.bounds.Ea.k,
        lat2: $scope.bounds.Ea.j,
        long1: $scope.bounds.va.k ,
        long2: $scope.bounds.va.j,
        date: date
      };
      lastMapData = data;
      debounceStations(data);
    }

    function setStations(data){
      mapsService.getAnalysis(data)
        .then(function (result) {
          if(!$scope.threshold) return;
          var newList = [];
          setChartData(result);
          console.log($scope.threshold);
          $scope.element.find('span.circleLabel').remove();
          for(var i = 0; i < result.length; i++){
            var item = {
              id: result[i]._id,
              radius: result[i].qos*10,
              center: {
                latitude: result[i].lat,
                longitude: result[i].lon
              },
              stroke: {
                color: 'rgb(63,81,181)',
                weight: 2,
                opacity: 0.2
              },
              fill: {
                color: stationColor({
                  params: $scope.threshold[$scope.sensorType || 'temp'],
                  data: result[i].sensors[$scope.sensorType || 'temp']
                }),
                opacity: 0.5
              },
              //clickable: true,
              events:{
                click: function (station, event, args) {

//                  var labelH = parseInt(($scope.bounds.getNorthEast().lat() - station.center.lat()) * ($scope.height/($scope.bounds.getNorthEast().lat() - $scope.bounds.getSouthWest().lat())));
//                  var labelW = parseInt((station.center.lng() -$scope.bounds.getSouthWest().lng()) * ($scope.width/($scope.bounds.getNorthEast().lng() - $scope.bounds.getSouthWest().lng())));
//
//                  var circleLabel = $('<span>');
//                  circleLabel.css('position', 'absolute');
//                  circleLabel.css('top', labelH - 10);
//                  circleLabel.css('left', labelW - 5);
//                  circleLabel.text('2');
//                  $scope.element.append(circleLabel);
                }
              }
            };

            var labelH = parseInt(($scope.bounds.getNorthEast().lat() - item.center.latitude) * ($scope.height/($scope.bounds.getNorthEast().lat() - $scope.bounds.getSouthWest().lat())));
            var labelW = parseInt((item.center.longitude -$scope.bounds.getSouthWest().lng()) * ($scope.width/($scope.bounds.getNorthEast().lng() - $scope.bounds.getSouthWest().lng())));

            var circleLabel = $('<span class="circleLabel">');
            circleLabel.css('position', 'absolute');
            circleLabel.css('top', labelH - 10);
            circleLabel.css('left', labelW - 5);
            circleLabel.css('color', '#fff');
            circleLabel.text(Math.floor(result[i].sensors[$scope.sensorType || 'temp'], 2));
            $scope.element.append(circleLabel);

            newList.push(item);
          }
          $scope.stations = newList;
        }, function (error) {
          console.log(error);
        });
    }

    function stationColor(params1){
      var r=11, g=22, b = 0;
      var params = {
        min: params1.params[0],
        max: params1.params[1],
        current: params1.data
      };
      var range = params.max - params.min;

      var ratio = range / 256;
      var color = {
        g: 256 - Math.round((params.current - params.min) / ratio),
        r: Math.round((params.current - params.min) / ratio)
      };

      return 'rgb('+ color.r + ', ' + color.g +', 0)';
    }

    var debounceStations = _.debounce(setStations, 500);
    uiGmapGoogleMapApi.then(function(maps) {
      $scope.maps = maps;
      $scope.doneInit = true;
      $scope.getMyLocation();
    });

    $scope.getMyLocation = function () {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function (position) {
          $scope.center = {latitude: position.coords.latitude, longitude: position.coords.longitude};
          $scope.$apply();
        }, function (error) {
           console.log(error);
        });
      }
    };

    $scope.$watch('daysBefore', function (newVal, oldVal) {
      if($scope.doneInit)
        getData();
    });

    function setChartData(data){
      var chartData = {
        title: {
          text: "POLLUTION GRAPH"
        },
        animationEnabled: true,
        axisY: {
          titleFontFamily: "arial",
          titleFontSize: 12,
          includeZero: false
        },
        toolTip: {
          shared: true
        },
        data: []

      };

      var mapDataChart = {};
      var pointsOnChart = data.length/10;
      _.each(data, function(d, index){
        _.each(d.sensors, function(val, key){
          if(index % pointsOnChart != 0) return;
          if(!mapDataChart[key]) mapDataChart[key] = [];
          mapDataChart[key].push({label: $filter('date')(d.timestamp, '"dd-MM HH-mm"') , y: val})
        })
      });

      _.each(mapDataChart, function(val, key){
        chartData.data.push(
          {
            type: "spline",
            name: key,
            showInLegend: true,
            dataPoints: val
          }
        )
      });

      $scope.currentChartData = chartData;
    }
  });
