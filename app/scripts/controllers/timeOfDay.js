'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('TimeOfDayCtrl', ['$scope', '$stateParams', 'timeOfDayChart',  '$rootScope', 'subsByPeriodService', 'chartsService',  function ($scope, $stateParams, timeOfDayChart, $rootScope, subsByPeriodService, chartsService) {
    
    $rootScope.user = $stateParams.userId
    $scope.$emit("route:changed", $stateParams.userId)
    $scope.chart = timeOfDayChart.chart;
  	// $scope.subsByPeriod = subsByPeriod;
  	$scope.$on('New User Data', function(event, data){
  		// subsByPeriodService.getSubsByPeriod().then(function(data){
  		// 	$scope.subsByPeriod = data;
  		// });
  		chartsService.timeOfDay().then(function(data){
  			$scope.chart = data.chart;
  		});
  		console.log('==================DATA', data);
  	});
  }]);
