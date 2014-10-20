'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('TopPostCtrl', ['$scope', '$firebase', '$timeout', '$sce', 'activityData', function ($scope, $firebase, $timeout, $sce, activityData) {
  	$scope.topPostChart = activityData.chart;
  	$scope.chartInfo = activityData.chartInfo;
  	
  }]);
