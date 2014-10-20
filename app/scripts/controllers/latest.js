'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('LatestCtrl', ['$scope', 'chartsService', 'activityData', function ($scope, chartsService, activityData) {
  	$scope.lastPostChart = activityData.chart;
    $scope.chartInfo = activityData.chartInfo;
  	$scope.$on('New User Data', function(event, data){
  		chartsService.latestPostActivity().then(function(data){
  			$scope.lastPostChart = data.chart;
  		})
  		console.log('==================DATA', data);
  	});
  }]);
