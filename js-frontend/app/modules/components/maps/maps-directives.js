angular.module('sp.modules.components.maps.directives',[])
  .directive('spMaps', function($window){
    function link(scope, element, attrs){
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
            scope.chart.render();
          }
        };
        scope.chart = new CanvasJS.Chart("chartContainer", newVal);

      });
      scope.$watch('chart', function (newVal){
        if(!newVal) return;
          setTimeout(function(){
            newVal.render();
          }, 200);

      });

      scope.$watch('isChart', function (newVal){
        if(!newVal) return;
          setTimeout(function(){
            scope.chart.render();
          }, 200);

      })
    }

    return {
      scope: {
        measureData: '=?',
        center: '=?',
        isChart: '=?'
      },
      restrict: 'EA',
      link: link,
      controller: 'mapsController',
      templateUrl: 'app/modules/components/maps/maps.html'
    }

  });
