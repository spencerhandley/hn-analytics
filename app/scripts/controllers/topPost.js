'use strict';

/**
 * @ngdoc function
 * @name hnlyticsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp')
  .controller('TopPostCtrl', ['$scope', '$firebase', '$timeout', '$sce', 'activityData', 'UserStatsService', function ($scope, $firebase, $timeout, $sce, activityData, UserStatsService) {
  	$scope.topPostChart = activityData
  	
  }]);
