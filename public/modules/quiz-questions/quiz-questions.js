var quizQuestions = angular.module('quizQuestions', [])

.directive('quizQuestions', function(){
  return {
    restrict:'E',
    templateUrl:'./modules/quiz-questions/quiz-questions.html',
    scope: {
    }
  }
})
.controller('quizController', ['$scope', '$http', function($scope, $http) {

    $scope.limitToNum = 11;
    $scope.showFromIndex = 0;
    $scope.formData = {};
    $scope.questions = [];
    $scope.allQuestions = [];
    $scope.lastI = 0;
    $scope.isLoading = true;


    // when submitting the add form, send the text to the node API
    $scope.createQuestion = function() {

      if(! $scope.formData.question || ! $scope.formData.answer || !$scope.formData.categories){
        // Invalid form
        return;
      }

      $http.post('/api/questions', $scope.formData)
        .success(function(data) {
          $scope.allQuestions = data;

          $scope.isLoading = false;

          $scope.moreQuestions();

          $scope.formData = {};
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    // delete a question after checking it
    $scope.deleteQuestion = function(id) {
      if(id === undefined){
        console.log('Delete :: ID is undefined!');
      }else{
        $http.delete('/api/questions/' + id)
          .success(function(data) {
            $scope.allQuestions = data;
            console.log('Delete successful!');
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      }
    };

    // when landing on the page, get all questions and show them
    $http.get('/api/questions')

      .success(function(data) {
        $scope.allQuestions = data;

        $scope.isLoading = false;

        $scope.moreQuestions();

        $scope.formData = {};
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

    $scope.updateQuestion = function(question) {

      $scope.isLoading = true;

      $http.post('/api/questions', question)
        .success(function(data) {
          $scope.allQuestions = data;

          $scope.isLoading = false;

          $scope.moreQuestions();

          $scope.formData = {};

          // Feedback to the user that the row has been updated
          for(var i=0; i<$scope.allQuestions.length; i++) {
            if(question._id === $scope.allQuestions[i]._id) {
              console.log($scope.allQuestions[i].question + ' has been updated');
              $scope.allQuestions[i].updated = true;
            }
          }
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    $scope.filterQuestions = function(questions, filterObj) {

      var returnArr = quizQuestions.filter(questions,filterObj);

      return returnArr;

    }

    $scope.moreQuestions = function() {

      if($scope.lastI >= $scope.allQuestions.length-1){
        // No more questions
        console.log('No more questions')
        $scope.lastI = $scope.allQuestions.length-1;
        return;
      }


      var i = $scope.lastI;
      var j = i+7;
      while(i < j){
        if($scope.allQuestions[i]){
          $scope.questions.push($scope.allQuestions[i]);
          console.log('adding question ' + i);
        }else{
          $scope.isLoading = true;
          return;
        }
        i++;
      }
      $scope.lastI = i;

    }
}])
.filter('questionFilter', function() {
  return function( rows, filters ) {
    var filtered = [];


    if(filters === undefined){
      return rows;
    }

    var questionFilter = filters.questionFilter ? filters.questionFilter.toLowerCase() : '';
    var answerFilter = filters.answerFilter ? filters.answerFilter.toLowerCase() : '';
    var categoryFilter = filters.categoryFilter ? filters.categoryFilter.toLowerCase() : '';
    var done = false;

    angular.forEach(rows, function(row) {

      if(done){
        return
      }

      var pass=true;
      var fail=0;
      var i=0;

      // Question filter
      if(row.question.toLowerCase().indexOf(questionFilter) === -1 && questionFilter != ''){
        pass=false;
      }

      // Answer filter
      if(answerFilter !== ''){
        for(i=0; i<row.answer.length; i++){
          if(row.answer[i].toLowerCase().indexOf(answerFilter) === -1){
            fail++;
          }
        }
        if(fail === row.answer.length){
          pass=false;
        }
      }

      // Category filter
      if(categoryFilter !== ''){
        for(i=0; i<row.categories.length; i++){
          if(row.categories[i].toLowerCase().indexOf(categoryFilter) === -1){
            fail++;
          }
        }
        if(fail === row.categories.length){
          pass=false;
        }
      }

      if(pass===true){
        // Item matches filters, or none are applied
        filtered.push(row);
      }

    });
    return filtered;
  };
})
