'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('TimeOfDayCtrl', ['$scope', 'timeOfDayChart', '$routeParams', '$rootScope', 'subsByPeriodService', 'chartsService', 'subsByPeriod', function ($scope, timeOfDayChart, $routeParams, $rootScope, subsByPeriodService, chartsService, subsByPeriod) {
    $rootScope.user = $routeParams.userId
    $scope.$emit("route:changed", $routeParams.userId)
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
