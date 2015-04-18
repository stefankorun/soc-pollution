angular.module('sp.modules.components.maps.controllers', [])
  .controller('mapsController', function ($scope, uiGmapGoogleMapApi) {
    $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    $scope.options = {scrollwheel: false};
    uiGmapGoogleMapApi.then(function(maps) {
      console.log(maps)
    });
  });
