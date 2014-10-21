'use strict';

/**
 * @ngdoc overview
 * @name hnlyticsApp
 * @description
 * # hnlyticsApp
 *
 * Main module of the application.
 */
angular
  .module('hnlyticsApp', [
    'firebase',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angles',
    'ui.bootstrap'

  ])
  .constant('_', window._)
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/:userId', {
        templateUrl: 'views/main.html',
        controller: 'TimeOfDayCtrl',
        resolve: {
          'timeOfDayChart': [ 'chartsService', function(chartsService){
            return chartsService.timeOfDay()
          }],
          'subsByPeriod': ['subsByPeriodService', function(subsByPeriodService){
            return subsByPeriodService.getSubsByPeriod()
          }]

        }
      })
      .when('/:userId/latest', {
        templateUrl: 'views/latest.html',
        controller: 'LatestCtrl',
        resolve: {
          activityData: ['chartsService', function(chartsService){
            return chartsService.lastPostActivity()
          }]
        }
      })
       .when('/:userId/toppost', {
        templateUrl: 'views/toppost.html',
        controller: 'TopPostCtrl',
        resolve: {
          activityData: ['chartsService', function(chartsService){
            return chartsService.topPostActivity()
          }]
        }
      })
      .when('/:userId/wordmap', {
        templateUrl: 'views/global.html',
        controller: 'WorldMapCtrl'
      })
      .otherwise({
        redirectTo: '/pg'
      });
  }]);
