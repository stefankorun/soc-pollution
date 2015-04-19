angular.module('sp.modules.components.maps.services',[])
  .factory('mapsService', function ($q, $http) {
    var factory = {};

    factory.getAnalysis = function (data) {
      var deferred = $q.defer();
      $http.get('http://192.168.0.100:3000/station/analysis', {params: data})
        .success(function (result) {
          deferred.resolve(result);
        })
        .error(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    };

    factory.getThreshold = function () {
      var deferred = $q.defer();
      $http.get('http://192.168.0.100:3000/station/thresh')
        .success(function (result) {
          deferred.resolve(result);
        })
        .error(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    };

    return factory;
  });