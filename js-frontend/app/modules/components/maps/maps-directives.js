angular.module('sp.modules.components.maps.directives',[])
  .directive('spMaps', function($window){
    function link($scope, element){
      function setMapHeight(){
        var height = element.height();
        element.find('.angular-google-map').height(height);
        element.find('.angular-google-map-container').height(height);
      }
      setMapHeight();
      $window.onresize = function() {
        setMapHeight();
      }
    }

    return {
      scope: {
        measureData: '=?'
      },
      restrict: 'EA',
      link: link,
      controller: 'mapsController',
      templateUrl: 'app/modules/components/maps/maps.html'
    }

  });
