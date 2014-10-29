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
    'ui.bootstrap',
    'ui.router'
    

  ])
  .constant('_', window._)
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/top-stories/list");

    $stateProvider
      .state('selectFork', {
        url: "/select-fork",
        templateUrl: "views/partials/selectView.html",
      })
      .state('topStories', {
        url: "/top-stories",
        templateUrl: "views/partials/topStoriesView.html",
        controller: "TrendingCtrl"
      })
      .state('topStories.list', {
        url: "/list",
        templateUrl: "views/topList.html",
        controller: "TopListCtrl",
        resolve: {
          'topStories': ['topStoriesService', function(topStoriesService){
            return topStoriesService.getTopStories()
          }]
        }
      })
      .state('topStories.story', {
        url: "/:storyId",
        templateUrl: "views/story.html",
        controller: "PostStatsCtrl",
        resolve: {
          activityData: ['chartsService',  '$stateParams', function(chartsService, $stateParams){
            console.log("YOOO")
            return chartsService.postActivity($stateParams.storyId)
          }]
        }
      })
      .state('userFork', {
        url: "/user",
        templateUrl: "views/partials/userDataView.html",
        controller: "MainCtrl" 
      })
      .state('userFork.bytime', {
        url: "/:userId/bytime",
        templateUrl: "views/main.html",
        controller: "TimeOfDayCtrl",
        resolve: {
          'timeOfDayChart': [ 'chartsService', '$stateParams',function(chartsService, $stateParams){
            return chartsService.timeOfDay($stateParams.userId)
          }]
        }
      })
      .state('userFork.toppost', {
        url: "/:userId/toppost",
        templateUrl: "views/toppost.html",
        controller: "TopPostCtrl",
        resolve: {
          activityData: ['chartsService',  '$stateParams', function(chartsService, $stateParams){
            return chartsService.topPostActivity($stateParams.userId)
          }]
        }
      })
      .state('userFork.lastpost', {
        url: "/:userId/lastpost",
        templateUrl: "views/latest.html",
        controller: "LatestCtrl",
        resolve: {
          activityData: ['chartsService', '$stateParams', function(chartsService, $stateParams){
            return chartsService.lastPostActivity($stateParams.userId)
          }]
        }
      })
      


    
  }]);
