var itemsList = angular.module('itemList', []);


itemsList.directive('itemList', function(){
  return {
    restrict:'E',
    templateUrl:'./modules/item-list/item-list.html',
    scope: {
      items:'=',
      questionId:'@',
      onUpdate:'&'
    },
    controllerAs: 'ctrl',

    controller:function($scope){

      $scope.mouseOver = false;

      $scope.removeItem = function(value){
        var items = $scope.items;
        for(var i=items.length-1; i>=0; i--){
          if(items[i].toLowerCase() === value.toLowerCase()){
            items.splice(i,1);
            $scope.onUpdate();
            break;
          }
        }
      };

      $scope.onMouseLeave = function(){
        $scope.mouseOver = false;
        $scope.onSubmit('');
      };

      $scope.onSubmit = function(value){

        if($scope.newItem && $scope.newItem !== ''){

          if($scope.items === undefined || $scope.items === null){
            $scope.items = [$scope.newItem];
          }else{
            $scope.items.push($scope.newItem);
          }

          if( $scope.questionId ) {
            $scope.onUpdate();
          }

          $scope.newItem = '';
        }

      };
    }
  };
});