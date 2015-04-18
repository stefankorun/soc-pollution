angular.module('sp.modules.components.maps.services',[])
  .factory('mapsService', function ($q, $http) {
    var factory = {};

    factory.getAnalysis = function () {
      var deferred = $q.defer();
      $http.get('http://192.168.0.103:3000/station/analysis')
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