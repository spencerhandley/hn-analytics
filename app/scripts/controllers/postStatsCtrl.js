'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('PostStatsCtrl', ['$scope', '$rootScope', '$stateParams', '$firebase', '$timeout', '$sce', 'activityData', function ($scope, $rootScope, $stateParams, $firebase, $timeout, $sce, activityData) {
    $rootScope.user = $stateParams.userId
  	$scope.topPostChart = activityData.chart;
  	$scope.chartInfo = activityData.chartInfo;
    $scope.sentiment = activityData.sentiment;
  	$scope.chartInfo.created_at = moment(activityData.chartInfo.created_at).format('M/D/YYYY');
  }]);
