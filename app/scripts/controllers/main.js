'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('MainCtrl', ['$scope', '$location', '$modal', '$route', '$routeParams','$rootScope', 'UserStatsService', function ($scope, $location, $modal, $route, $routeParams, $rootScope, UserStatsService) {
	$scope.$on("route:changed", function(event, data){
		console.log("DATA", data)
		$rootScope.user = data;
		getData();
		$location.path('/'+data)
		console.log("===============================", data);
	});
	$rootScope.user = 'pg'
	$scope.current = 1;
	$scope.setCurrent = function(val){
		$scope.current = val;
	};
	$scope.myChartOptions = {
       
    };
	$scope.open = function (size) {

	    var modalInstance = $modal.open({
	      templateUrl: '/views/forkModal.html',
	      controller: 'forkModalCtrl',
	      size: size
	    });

	    modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	    }, function () {
	    });
	};
	// put something on local storage that says it's been open and only open dialog with it's hasn't been opened before
		$scope.open();

	function getData(){
		UserStatsService.results($rootScope.user).then(function(data){
			console.log(data)
			$scope.userStats = data;
			$scope.dgntData = [ 
				{	label: 'Comments',
		            value: data.comments,
		            color:"#949FB1"
		        },
		        {	label: 'Stories',
		            value : data.stories,
		            color : "#F7464A" 
		        }
	        ];
			return data;
		});
	};
	
	getData();
	$scope.pullUserData = function(inputUser){
		$rootScope.user = inputUser;
		getData();
		$location.path('/'+inputUser)
		// $scope.$broadcast('New User Data', inputUser);
	};
}])
.controller('forkModalCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

