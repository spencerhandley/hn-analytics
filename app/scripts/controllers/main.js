'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('MainCtrl', ['$scope', '$location', '$route', '$routeParams','$rootScope', 'UserStatsService', function ($scope, $location, $route, $routeParams, $rootScope, UserStatsService) {
	$scope.$on("route:changed", function(data){
		console.log("DATA", data)
		$rootScope.user = data;
		getData();
		// $location.path('/'+inputUser)
		console.log("===============================", data);
	});
	$rootScope.user = 'pg'
	$scope.current = 1;
	$scope.setCurrent = function(val){
		$scope.current = val;
	};
	$scope.myChartOptions = {
       
    };
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
}]);
