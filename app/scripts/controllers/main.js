'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('MainCtrl', ['$scope', '$rootScope', 'UserStatsService', function ($scope, $rootScope, UserStatsService) {
	$scope.$on("child:changed", function(data){
		console.log("===============================", data);
	});
	$rootScope.user = 'pg';
	$scope.current = 1;
	$scope.setCurrent = function(val){
		$scope.current = val;
	};
	
	function getData(){
		UserStatsService.results($rootScope.user).then(function(data){
			$scope.userStats = data.basic;
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
		$scope.$broadcast('New User Data', inputUser);
	};
}]);
