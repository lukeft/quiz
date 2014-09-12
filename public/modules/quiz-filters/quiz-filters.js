var quizFilters = angular.module('quizFilters', []);


quizFilters.directive('quizFilters', function(){
  return {
    restrict:'E',
    templateUrl:'./modules/quiz-filters/quiz-filters.html',
    scope: {
      filters:'='
    },
    controllerAs:'ctrl',

    controller:function($scope){

      $scope.clearFilters = function() {
        $scope.filters = {
          questionFilter:'',
          answerFilter:'',
          categoryFilter:''
        }
      };

      $scope.clearFilters();

    }

  };
});