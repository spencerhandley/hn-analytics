angular.module('hnlyticsApp')
.directive("leftNav", function($rootScope){
	return {
		restrict: 'EA',
		scope: {},
		controller: function($scope){
			$scope.current = 1
			$scope.setCurrent = function(val){
				$scope.current = val
			}
		},
		link: function(scope, ele, attrs){
		}

	}
})