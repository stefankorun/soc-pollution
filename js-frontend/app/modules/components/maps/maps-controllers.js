angular.module('sp.modules.components.maps.controllers', [])
  .controller('mapsController', function ($scope, uiGmapGoogleMapApi) {
    $scope.map = {center: {latitude: 41.12, longitude: 20.79 }, zoom: 14 };
    $scope.options = {scrollwheel: false};
    uiGmapGoogleMapApi.then(function(maps) {
      console.log(maps)
    });
  });
