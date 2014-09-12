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

    }
  }
});