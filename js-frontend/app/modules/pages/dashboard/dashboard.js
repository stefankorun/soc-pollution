angular.module('app.modules.pages.dashboard',[])
  .controller('dashboardController', function($scope, $http, $q){
    $scope.mesurementTypes = {
      order: ['temp', 'CH4', 'NO2', 'SO2', 'humidity'],
      list: {
        temp: {
          label: 'Temperature',
          icon: 'sun-o'
        },
        CH4: {
          label: 'CH4',
          icon: 'cloud'
        },
        NO2: {
          label: 'NO2',
          icon: 'cloud'
        },
        SO2: {
          label: 'SO2',
          icon: 'cloud'
        },
        humidity: {
          label: 'Humidity',
          icon: 'tint'
        }
      }

    };
    $scope.mesurementTypes.currentMeasure = $scope.mesurementTypes.list.temperature;
    $scope.setMesurementType = function(measure, name){
      $scope.dataConfig.sensorType = name;
      $scope.dataConfig.isChart = false;
      $scope.mesurementTypes.currentMeasure = measure;
    };
    $scope.dataConfig = {};
    $scope.dataConfig.daysBefore = 0;
    $scope.dataConfig.selectedItem  = null;
    $scope.dataConfig.searchText = null;
    $scope.dataConfig.searchCities = function (searchStr) {
      var deferred = $q.defer();
      $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ searchStr + '&key=AIzaSyBQlIsUSiQgXLEbq71BCkOyRlOb8XqLQFQ')
        .success(function(data) {
          deferred.resolve(data.results);
        }).error(function(data){
          deferred.resolve([]);
        });
      return deferred.promise;
    };

    $scope.$watch('dataConfig.selectedItem', function(newVal){
      if(!newVal) return;
      $scope.dataConfig.center = {
        latitude: newVal.geometry.location.lat,
        longitude: newVal.geometry.location.lng
      };
    })
  });
