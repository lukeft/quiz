var quizQuestions = angular.module('quizQuestions', [])

.directive('quizQuestions', function(){
  return {
    restrict:'E',
    templateUrl:'./modules/quiz-questions/quiz-questions.html',
    scope: {
      "numQuestions":'='
    }
  }
})
.controller('quizController', ['$scope', '$http', function($scope, $http) {

    $scope.limitToNum = 11;
    $scope.showFromIndex = 0;
    $scope.formData = {};

    $scope.questions = [];
    $scope.filteredQuestions = [];
    $scope.allQuestions = [];

    $scope.numRowsShowing = 0;
    $scope.isLoading = true;

    $scope.$watch('filteredQuestions', function(){

      $scope.numRowsShowing = 10;

      if($scope.filteredQuestions.length > 0){
        console.log('questions changerddr');
        $scope.questions = $scope.filteredQuestions.slice(0,$scope.numRowsShowing);
      }else{
        $scope.questions = [];
      }
    });


    $scope.questionDataReturned = function(data){

      $scope.allQuestions = data;

      $scope.isLoading = false;

      $scope.filteredQuestions = $scope.allQuestions;
      $scope.questions = $scope.filteredQuestions.slice(0,$scope.numRowsShowing);

      $scope.formData = {};

    };


    // when submitting the add form, send the text to the node API
    $scope.createQuestion = function() {

      if(! $scope.formData.question || ! $scope.formData.answer || !$scope.formData.categories){
        // Invalid form
        return;
      }

      $http.post('/api/questions', $scope.formData)
        .success(function(data) {

          $scope.allQuestions = data;
          $scope.filteredQuestions = $scope.allQuestions;

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



    $scope.updateQuestion = function(question) {

      $scope.isLoading = true;

      $http.post('/api/questions', question)
        .success(function(data) {
          $scope.allQuestions = data;

          var updatedQuestion;

          // Find and replace the updated question within the allQuestions array
          angular.forEach($scope.allQuestions, function(value, key) {

            if(value._id === question._id){
              value.updated = 'updated';
              updatedQuestion = value;
            }
          });

          // Find and replace the updated question within the filtered questions array
          angular.forEach($scope.filteredQuestions, function(value, key) {

            if(value._id === question._id){
              $scope.filteredQuestions[key] = updatedQuestion;
            }
          });

          // Find and replace the updated question within the questions array
          angular.forEach($scope.filteredQuestions, function(value, key) {

            if(value._id === question._id){
              $scope.questions[key] = updatedQuestion;
            }
          });


          // Reset the form
          $scope.isLoading = false;
          $scope.formData = {};

        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };





    /* -- Question / Answer / Category filters -- */
    $scope.filterQuestions = function(questions, filterObj) {

      var returnArr = quizQuestions.filter(questions,filterObj);
      return returnArr;
    };



    /* -- Infinite scroll - load more questions -- */
    $scope.moreQuestions = function() {

      $scope.questions = $scope.filteredQuestions.slice(0,$scope.numRowsShowing);
      if($scope.numRowsShowing <= $scope.filteredQuestions.length){

        $scope.numRowsShowing+=50;
      }
    };



    /* -- INITIAL LOAD -- */
    $http.get('/api/questions')
      .success($scope.questionDataReturned)
      .error(function(data) {
        console.log('Error: ' + data);
      });
}])