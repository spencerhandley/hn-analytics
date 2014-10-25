'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('LatestCtrl', ['$scope', '$stateParams', 'chartsService', '$rootScope', 'activityData', function ($scope, $stateParams, chartsService, $rootScope, activityData) {
  	$rootScope.user = $stateParams.userId
    $scope.lastPostChart = activityData.chart;
    $scope.chartInfo = activityData.chartInfo;
    $scope.sentiment = activityData.sentiment;
    $scope.chartInfo.created_at = moment(activityData.chartInfo.created_at).format('M/D/YYYY');

  	$scope.$on('New User Data', function(event, data){
  		chartsService.latestPostActivity().then(function(data){
  			$scope.lastPostChart = data.chart;
  		})
  		console.log('==================DATA', data);
  	});
  }]);
