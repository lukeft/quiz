var itemInput = angular.module('itemInput', []);


itemInput.directive('itemInput', function(){
  return {
    restrict:'E',
    templateUrl:'./modules/item-input/item-input.html',
    scope: {
      item:'=',
      questionId:'@',
      onUpdate:'&'
    },
    controllerAs: 'ctrl',

    controller:function($scope){

      $scope.changed = false;

      $scope.saveChanges = function($event) {

        if($scope.changed === false) {
          // No changes
        }else{
          // Save changes
          $scope.onUpdate();
        }
      };

      $scope.onChange = function(){
        $scope.changed = true;
      }

    }


  }
});