angular.module('sp.modules.components.maps.directives',[])
  .directive('spMaps', function($window){
    function link(scope, element, attrs){
      scope.height = parseInt(element.height());
      scope.width = parseInt(element.width())
      scope.element = element;

      function setMapHeight(){
        var height = element.height();
        var width = element.width();
        element.find('.angular-google-map').height(height);
        element.find('.angular-google-map-container').height(height);
        element.find('#chartContainer').height(height);

      }

      setMapHeight();
      $window.onresize = function() {
        setMapHeight();
      };
      scope.$watch('currentChartData', function(newVal){
        console.log(newVal);
        setMapHeight();
        if(!newVal) return;
        newVal.legend ={
          cursor:"pointer",
            itemclick:function(e){
            if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            }
            else {
              e.dataSeries.visible = true;
            }
            chart.render();
          }
        };
        var chart = new CanvasJS.Chart("chartContainer", newVal);
        setTimeout(function() {
          chart.render();
        }, 500);
      });

    }

    return {
      scope: {
        measureData: '=?',
        center: '=?',
        isChart: '=?',
        daysBefore: '=?',
        sensorType: '=?'
      },
      restrict: 'EA',
      link: link,
      controller: 'mapsController',
      templateUrl: 'app/modules/components/maps/maps.html'
    }

  });
