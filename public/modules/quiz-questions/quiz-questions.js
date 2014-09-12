var quizQuestions = angular.module('quizQuestions', []);

quizQuestions.directive('quizQuestions', function(){
  return {
    restrict:'E',
    templateUrl:'./modules/quiz-questions/quiz-questions.html',
    scope: {
    },
    controllerAs:'quizController',
    controller: function($scope, $http){

      $scope.limitToNum = 11;
      $scope.formData = {};
      $scope.questions = {};

      // when submitting the add form, send the text to the node API
      $scope.createQuestion = function() {

        if(! $scope.formData.question || ! $scope.formData.answer || !$scope.formData.categories){
          // Invalid form
          return;
        }

        $http.post('/api/questions', $scope.formData)
          .success(function(data) {
            $scope.questions = data;
            $scope.formData = {};
            console.log($scope.questions[0].answer);
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
              $scope.questions = data;
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
          $scope.questions = data;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });

      $scope.updateQuestion = function(question) {

        $http.post('/api/questions', question)
          .success(function(data) {
            $scope.formData = {};
            $scope.questions = data;

            // Feedback to the user that the row has been updated
            for(var i=0; i<$scope.questions.length; i++) {
              if(question._id === $scope.questions[i]._id) {
                console.log($scope.questions[i].question + ' has been updated');
                $scope.questions[i].updated = true;
              }
            }
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      };
    }
  }
});