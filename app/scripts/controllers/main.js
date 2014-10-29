'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('MainCtrl', ['$scope', '$sce', '$location', '$stateParams', '$rootScope', 'UserStatsService', function ($scope,$sce, $location, $stateParams, $rootScope, UserStatsService) {
	$rootScope.user = $stateParams.userId
	$scope.current = 1;
	$scope.setCurrent = function(val){
		$scope.current = val;
	};
	$scope.$on('route:changed', function(event, data){
		getData()
	})
	function getData(){
		UserStatsService.results($stateParams.userId).then(function(data){
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
		$scope.current = 1;
		$location.path('/user/'+inputUser + "/bytime")
		// $scope.$broadcast('New User Data', inputUser);
	};
}])

