angular.module('hnlyticsApp')
  .controller('TrendingCtrl', ['$scope', '$location', function ($scope, $location) {
      $scope.userEntered= function(){
        console.log("heyyyy user inputted")
        $location.path('/user/' + $scope.inputUser + "/bytime")
      }
  }]);
