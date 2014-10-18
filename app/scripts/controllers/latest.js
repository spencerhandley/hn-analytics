'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('LatestCtrl', function ($scope, chartsService, activityData) {
  	$scope.lastPostChart = activityData
  	$scope.$on('New User Data', function(event, data){
  		subsByPeriodService.getSubsByPeriod().then(function(data){
  			$scope.subsByPeriod = data
  		})
		chartsService.latestPostActivity().then(function(data){
			$scope.lastPostChart = data
		})
  		console.log('==================DATA', data)
  	})
  });
