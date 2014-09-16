var quizFilters = angular.module('quizFilters', []);


quizFilters.directive('quizFilters', function(){
  return {
    restrict:'E',
    templateUrl:'./modules/quiz-filters/quiz-filters.html',
    scope: {
      filters:'=',
      questions:'=',
      filteredQuestions:'='
    },
    controllerAs:'ctrl',

    controller:function($scope){



      /* Clear the filters */
      $scope.clearFilters = function() {
        $scope.filters = {
          questionFilter:'',
          answerFilter:'',
          categoryFilter:''
        }

        $scope.filterQuestions();
      };


      /* Compound filter the questions array by question/answer/category */
      $scope.filterQuestions = function() {

        var filters = $scope.filters;
        var rows = $scope.questions;
        var filteredRows = [];

        if(filters === undefined){
          return rows;
        }

        var questionFilter =  filters.questionFilter ?   filters.questionFilter.toLowerCase() : '';
        var answerFilter   =  filters.answerFilter   ?   filters.answerFilter.toLowerCase() : '';
        var categoryFilter =  filters.categoryFilter ?   filters.categoryFilter.toLowerCase() : '';
        var done = false;

        angular.forEach(rows, function(row) {

          if(done){
            return
          }

          var pass=true;
          var failNum=0;
          var i=0;

          // Question filter
          if(row.question.toLowerCase().indexOf(questionFilter) === -1 && questionFilter != ''){
            pass=false;
          }

          // Answer filter
          if(answerFilter !== ''){
            for(i=0; i<row.answer.length; i++){
              if(row.answer[i].toLowerCase().indexOf(answerFilter) === -1){
                failNum++;
              }
            }
            if(failNum === row.answer.length){
              pass=false;
            }
          }

          // Category filter
          if(categoryFilter !== ''){
            for(i=0; i<row.categories.length; i++){
              if(row.categories[i].toLowerCase().indexOf(categoryFilter) === -1){
                failNum++;
              }
            }
            if(failNum === row.categories.length){
              pass=false;
            }
          }

          if(pass===true){
            // Item matches filters, or none are applied
            filteredRows.push(row);
          }

        });

        $scope.filteredQuestions = filteredRows;

      };

    }

  };
})

