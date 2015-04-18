angular.module('sp.modules.components.maps.controllers', [])
  .controller('mapsController', function ($scope, uiGmapGoogleMapApi, mapsService) {

    $scope.map = {
      center: {latitude: 51.219053, longitude: 4.404418 },
      zoom: 14,
      events: {
        bounds_changed: function (maps, event, arguments) {
          console.log('bounds_changed');
        }
      }
    };

    $scope.options = {scrollwheel: true};
    $scope.c = {
      id: 1,
      center: {
        latitude: 44,
        longitude: -108
      },
      radius: 500,
      stroke: {
        color: '#08B21F',
        weight: 2,
        opacity: 1
      },
      fill: {
        color: '#08B21F',
        opacity: 0.5
      },
      geodesic: true,
      draggable: true,
      clickable: true,
      editable: true,
      visible: true,
      control: {}
    };

    Object.defineProperty($scope, 'center', {
      get: function () {
        return $scope.c;
      },
      set: function (val) {
        $scope.map.center = val;
        $scope.c = val;
      }
    });

    mapsService.getAnalysis()
      .then(function (result) {
        console.log(result);
      }, function (error) {
        console.log(error);
      });

    uiGmapGoogleMapApi.then(function(maps) {
      $scope.getMyLocation();
    });

    $scope.getMyLocation = function () {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function (position) {
          $scope.center = {latitude: position.coords.latitude, longitude: position.coords.longitude};

          $scope.c.center.latitude = position.coords.latitude;
          $scope.c.center.longitude = position.coords.longitude;
          $scope.$apply();
        }, function (error) {
           console.log(error);
        });
      }
    };

    $scope.setLocation = function(latitude, longitude){
      $scope.map.center.latitude = latitude;
      $scope.map.center.longitude = longitude;
    }

  });
