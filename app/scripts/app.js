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
    'ngStorage'

  ])
  .constant('_', window._)
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
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
      .when('/latest', {
        templateUrl: 'views/latest.html',
        controller: 'LatestCtrl as vm',
        resolve: {
          activityData: ['chartsService', function(chartsService){
            return chartsService.lastPostActivity()
          }]
        }
      })
       .when('/toppost', {
        templateUrl: 'views/toppost.html',
        controller: 'TopPostCtrl',
        resolve: {
          activityData: ['chartsService', function(chartsService){
            return chartsService.topPostActivity()
          }]
        }
      })
      .when('/global', {
        templateUrl: 'views/global.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
