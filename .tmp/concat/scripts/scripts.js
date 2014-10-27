'use strict';
/**
 * @ngdoc overview
 * @name hnlyticsApp
 * @description
 * # hnlyticsApp
 *
 * Main module of the application.
 */
angular.module('hnlyticsApp', [
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
]).constant('_', window._).config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/select-fork');
    $stateProvider.state('selectFork', {
      url: '/select-fork',
      templateUrl: 'views/partials/selectView.html'
    }).state('topStories', {
      url: '/top-stories',
      templateUrl: 'views/partials/topStoriesView.html',
      controller: 'TrendingCtrl'
    }).state('topStories.list', {
      url: '/list',
      templateUrl: 'views/topList.html',
      controller: 'TopListCtrl',
      resolve: {
        'topStories': [
          'topStoriesService',
          function (topStoriesService) {
            return topStoriesService.getTopStories();
          }
        ]
      }
    }).state('topStories.story', {
      url: '/:storyId',
      templateUrl: 'views/story.html',
      controller: 'PostStatsCtrl',
      resolve: {
        activityData: [
          'chartsService',
          '$stateParams',
          function (chartsService, $stateParams) {
            console.log('YOOO');
            return chartsService.postActivity($stateParams.storyId);
          }
        ]
      }
    }).state('userFork', {
      url: '/user',
      templateUrl: 'views/partials/userDataView.html',
      controller: 'MainCtrl'
    }).state('userFork.bytime', {
      url: '/:userId/bytime',
      templateUrl: 'views/main.html',
      controller: 'TimeOfDayCtrl',
      resolve: {
        'timeOfDayChart': [
          'chartsService',
          '$stateParams',
          function (chartsService, $stateParams) {
            return chartsService.timeOfDay($stateParams.userId);
          }
        ]
      }
    }).state('userFork.toppost', {
      url: '/:userId/toppost',
      templateUrl: 'views/toppost.html',
      controller: 'TopPostCtrl',
      resolve: {
        activityData: [
          'chartsService',
          '$stateParams',
          function (chartsService, $stateParams) {
            return chartsService.topPostActivity($stateParams.userId);
          }
        ]
      }
    }).state('userFork.lastpost', {
      url: '/:userId/lastpost',
      templateUrl: 'views/latest.html',
      controller: 'LatestCtrl',
      resolve: {
        activityData: [
          'chartsService',
          '$stateParams',
          function (chartsService, $stateParams) {
            return chartsService.lastPostActivity($stateParams.userId);
          }
        ]
      }
    });
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name hnlyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp').controller('MainCtrl', [
  '$scope',
  '$location',
  '$stateParams',
  '$rootScope',
  'UserStatsService',
  function ($scope, $location, $stateParams, $rootScope, UserStatsService) {
    $rootScope.user = $stateParams.userId;
    $scope.current = 1;
    $scope.setCurrent = function (val) {
      $scope.current = val;
    };
    $scope.$on('route:changed', function (event, data) {
      getData();
    });
    function getData() {
      UserStatsService.results($stateParams.userId).then(function (data) {
        $scope.userStats = data;
        $scope.dgntData = [
          {
            label: 'Comments',
            value: data.comments,
            color: '#949FB1'
          },
          {
            label: 'Stories',
            value: data.stories,
            color: '#F7464A'
          }
        ];
        return data;
      });
    }
    ;
    getData();
    $scope.pullUserData = function (inputUser) {
      $scope.current = 1;
      $location.path('/user/' + inputUser + '/bytime');
    };
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name hnlyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp').controller('LatestCtrl', [
  '$scope',
  '$stateParams',
  'chartsService',
  '$rootScope',
  'activityData',
  function ($scope, $stateParams, chartsService, $rootScope, activityData) {
    $rootScope.user = $stateParams.userId;
    $scope.lastPostChart = activityData.chart;
    $scope.chartInfo = activityData.chartInfo;
    $scope.sentiment = activityData.sentiment;
    $scope.chartInfo.created_at = moment(activityData.chartInfo.created_at).format('M/D/YYYY');
    $scope.$on('New User Data', function (event, data) {
      chartsService.latestPostActivity().then(function (data) {
        $scope.lastPostChart = data.chart;
      });
      console.log('==================DATA', data);
    });
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name hnlyticsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp').controller('TopPostCtrl', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$firebase',
  '$timeout',
  '$sce',
  'activityData',
  function ($scope, $rootScope, $stateParams, $firebase, $timeout, $sce, activityData) {
    $rootScope.user = $stateParams.userId;
    $scope.topPostChart = activityData.chart;
    $scope.chartInfo = activityData.chartInfo;
    $scope.sentiment = activityData.sentiment;
    $scope.chartInfo.created_at = moment(activityData.chartInfo.created_at).format('M/D/YYYY');
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name hnlyticsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp').controller('TimeOfDayCtrl', [
  '$scope',
  '$stateParams',
  'timeOfDayChart',
  '$rootScope',
  'subsByPeriodService',
  'chartsService',
  function ($scope, $stateParams, timeOfDayChart, $rootScope, subsByPeriodService, chartsService) {
    $rootScope.user = $stateParams.userId;
    $scope.$emit('route:changed', $stateParams.userId);
    $scope.chart = timeOfDayChart.chart;
    // $scope.subsByPeriod = subsByPeriod;
    $scope.$on('New User Data', function (event, data) {
      // subsByPeriodService.getSubsByPeriod().then(function(data){
      // 	$scope.subsByPeriod = data;
      // });
      chartsService.timeOfDay().then(function (data) {
        $scope.chart = data.chart;
      });
      console.log('==================DATA', data);
    });
  }
]);
angular.module('hnlyticsApp').controller('TopListCtrl', [
  '$scope',
  'topStories',
  function ($scope, topStories) {
    $scope.topStories = topStories.storiesArr;
    $scope.sentiment = topStories.sentiment;
    $scope.dgntData = [
      {
        label: topStories.highFrequency[0].text,
        value: topStories.highFrequency[0].frequency,
        color: '#F7464A'
      },
      {
        label: topStories.highFrequency[1].text,
        value: topStories.highFrequency[1].frequency,
        color: '#F7464A'
      },
      {
        label: topStories.highFrequency[2].text,
        value: topStories.highFrequency[2].frequency,
        color: '#F7464A'
      },
      {
        label: topStories.highFrequency[3].text,
        value: topStories.highFrequency[3].frequency,
        color: '#F7464A'
      },
      {
        label: topStories.highFrequency[4].text,
        value: topStories.highFrequency[4].frequency,
        color: '#E2EAE9'
      },
      {
        label: topStories.highFrequency[5].text,
        value: topStories.highFrequency[5].frequency,
        color: '#D4CCC5'
      },
      {
        label: topStories.highFrequency[6].text,
        value: topStories.highFrequency[6].frequency,
        color: '#D4CCC5'
      },
      {
        label: topStories.highFrequency[7].text,
        value: topStories.highFrequency[7].frequency,
        color: '#949FB1'
      },
      {
        label: topStories.highFrequency[8].text,
        value: topStories.highFrequency[8].frequency,
        color: '#949FB1'
      },
      {
        label: topStories.highFrequency[9].text,
        value: topStories.highFrequency[9].frequency,
        color: '#4D5360'
      },
      {
        label: topStories.highFrequency[10].text,
        value: topStories.highFrequency[10].frequency,
        color: '#4D5360'
      }
    ];
  }
]);
angular.module('hnlyticsApp').controller('TrendingCtrl', [
  '$scope',
  '$location',
  function ($scope, $location) {
    $scope.userEntered = function () {
      console.log('heyyyy user inputted');
      $location.path('/user/' + $scope.inputUser + '/bytime');
    };
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name hnlyticsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hnlyticsApp
 */
angular.module('hnlyticsApp').controller('PostStatsCtrl', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$firebase',
  '$timeout',
  '$sce',
  'activityData',
  function ($scope, $rootScope, $stateParams, $firebase, $timeout, $sce, activityData) {
    $rootScope.user = $stateParams.userId;
    $scope.PostChart = activityData.chart;
    $scope.chartInfo = activityData.chartInfo;
    $scope.sentiment = activityData.sentiment;
    $scope.chartInfo.created_at = moment(activityData.chartInfo.created_at).format('M/D/YYYY');
  }
]);
'use strict';
angular.module('hnlyticsApp').service('UserStatsService', [
  '$firebase',
  '$timeout',
  '$stateParams',
  '$http',
  '$q',
  '$rootScope',
  function ($firebase, $timeout, $stateParams, $http, $q, $rootScope) {
    var getUserData = function (cb) {
      console.log($stateParams.userId);
      var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
      var userRef = ref.child('user').child($stateParams.userId);
      var userSync = $firebase(userRef);
      var userObj = userSync.$asObject();
      userObj.$loaded(function () {
        $http.get('/api/' + $stateParams.userId + '/user-info').success(function (data) {
          console.log(data);
          var stories = data.stories;
          var comments = data.comments;
          var about = data.basic.about;
          var karma = data.basic.karma;
          var submitted = data.comments + data.stories;
          var created = new Date(data.basic.created_at_i * 1000);
          cb({
            stories: stories,
            comments: comments,
            karma: karma,
            about: about,
            submitted: submitted,
            createdAt: created.getMonth() + '/' + created.getFullYear()
          });
        });
      });
    };
    return {
      results: function () {
        var deferred = $q.defer();
        getUserData(function (data) {
          $timeout(function () {
            $rootScope.$apply(function () {
              deferred.resolve(data);
            });
          });
        });
        return deferred.promise;
      }
    };
  }
]);
'use strict';
'use strict';
angular.module('hnlyticsApp').service('averageTimeOfDayService', [
  '$rootScope',
  '$timeout',
  '$http',
  '$q',
  '$stateParams',
  function ($rootScope, $timeout, $http, $q, $stateParams) {
    // POST FREQUENCY BY TIME
    var getAverageTimes = function (username, callback) {
      console.log($stateParams);
      $http.get('/api/' + username + '/hourly-averages').success(function (data) {
        console.log('got the data');
        console.log(data);
        callback(data);
      });
    };
    return {
      timesOfTheDay: function (username) {
        var deferred = $q.defer();
        getAverageTimes(username, function (data) {
          $timeout(function () {
            $rootScope.$apply(function () {
              deferred.resolve(data);
            });
          });
        });
        return deferred.promise;
      }
    };
  }
]);
angular.module('hnlyticsApp').directive('leftNav', [
  '$rootScope',
  function ($rootScope) {
    return {
      restrict: 'EA',
      scope: {},
      controller: [
        '$scope',
        function ($scope) {
          $scope.current = 1;
          $scope.setCurrent = function (val) {
            $scope.current = val;
          };
        }
      ],
      link: function (scope, ele, attrs) {
      }
    };
  }
]);
'use strict';
angular.module('hnlyticsApp').service('chartsService', [
  'lastPostCommentsService',
  'PostStatsService',
  'topPostCommentsService',
  'averageTimeOfDayService',
  function (lastPostCommentsService, PostStatsService, topPostCommentsService, averageTimeOfDayService) {
    var getAveTimeChart = function (username) {
      console.log(username);
      var promise = averageTimeOfDayService.timesOfTheDay(username).then(function (timesOfTheDay) {
          var averageTimeChart = {
              labels: [
                'midnight',
                '1am',
                '2am',
                '3am',
                '4am',
                '5am',
                '6am',
                '7am',
                '8am',
                '9am',
                '10am',
                '11am',
                'Noon',
                '1pm',
                '2pm',
                '3pm',
                '4pm',
                '5pm',
                '6pm',
                '7pm',
                '8pm',
                '9pm',
                '10pm',
                '11pm'
              ],
              datasets: [{
                  fillColor: 'rgba(151,187,205,0)',
                  strokeColor: '#FF6600',
                  pointColor: 'rgba(151,187,205,0)',
                  pointStrokeColor: '#e67e22',
                  data: timesOfTheDay
                }]
            };
          var returnData = {
              chart: averageTimeChart,
              chartInfo: timesOfTheDay
            };
          return returnData;
        });
      return promise;
    };
    var getLatestPostChart = function (username) {
      var promise = lastPostCommentsService.lastPostActivity(username).then(function (data) {
          var lastPostChart = {
              labels: data.labels,
              datasets: [{
                  fillColor: 'rgba(151,187,205,0)',
                  strokeColor: '#FF6600',
                  pointColor: 'rgba(151,187,205,0)',
                  pointStrokeColor: '#e67e22',
                  data: data.commentArr
                }]
            };
          var returnData = {
              chart: lastPostChart,
              chartInfo: data.postObj,
              sentiment: data.sentiment
            };
          return returnData;
        });
      return promise;
    };
    var PostChart = function (postId) {
      console.log(postId);
      var promise = PostStatsService.PostActivity(postId).then(function (data) {
          console.log(data);
          var PostChart = {
              labels: data.labels,
              datasets: [{
                  fillColor: 'rgba(151,187,205,0)',
                  strokeColor: '#FF6600',
                  pointColor: 'rgba(151,187,205,0)',
                  pointStrokeColor: '#e67e22',
                  data: data.commentArr
                }]
            };
          var returnData = {
              chart: PostChart,
              chartInfo: data.postObj[0],
              sentiment: data.sentiment
            };
          return returnData;
        });
      return promise;
    };
    var getTopPostChart = function (username) {
      var promise = topPostCommentsService.topPostActivity(username).then(function (data) {
          var topPostChart = {
              labels: data.labels,
              datasets: [{
                  fillColor: 'rgba(151,187,205,0)',
                  strokeColor: '#FF6600',
                  pointColor: 'rgba(151,187,205,0)',
                  pointStrokeColor: '#e67e22',
                  data: data.commentArr
                }]
            };
          var returnData = {
              chart: topPostChart,
              chartInfo: data.postObj,
              sentiment: data.sentiment
            };
          return returnData;
        });
      return promise;
    };
    return {
      timeOfDay: getAveTimeChart,
      lastPostActivity: getLatestPostChart,
      topPostActivity: getTopPostChart,
      postActivity: PostChart
    };
  }
]);
'use strict';
angular.module('hnlyticsApp').service('lastPostCommentsService', [
  '$firebase',
  '$q',
  '$timeout',
  '$rootScope',
  '$http',
  function ($firebase, $q, $timeout, $rootScope, $http) {
    var getLastPostComments = function (username, callback) {
      $http.get('/api/' + username + '/last-post').success(function (data) {
        console.log('got the data');
        console.log(data);
        callback(data);
      });
    };
    return {
      lastPostActivity: function (username) {
        var deferred = $q.defer();
        getLastPostComments(username, function (data) {
          console.log(data);
          $timeout(function () {
            $rootScope.$apply(function () {
              deferred.resolve(data);
            });
          });
        });
        return deferred.promise;
      }
    };
  }
]);
'use strict';
angular.module('hnlyticsApp').service('subsByPeriodService', [
  '$firebase',
  '$timeout',
  '$http',
  '$q',
  '$rootScope',
  function ($firebase, $timeout, $http, $q, $rootScope) {
    var average;
    var thisYearsSubs = [];
    var lastYearsSubs = [];
    var thisMonthsSubs = [];
    var lastMonthsSubs = [];
    var thisWeeksSubs = [];
    var lastWeeksSubs = [];
    var thisYearsTot = [];
    var lastYearsTot = [];
    var thisMonthsTot = [];
    var lastMonthsTot = [];
    var thisWeeksTot = [];
    var lastWeeksTot = [];
    var yearsDiff = [];
    var monthsDiff = [];
    var weeksDiff = [];
    var averageTimes;
    var timesOfTheDay;
    var getSubsByPeriod = function () {
    };
    return { getSubsByPeriod: getSubsByPeriod };
  }
]);
// APPEND GET WEEK METHOD TO THE PROTOTYPE
Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
  dowOffset = typeof dowOffset === 'int' ? dowOffset : 0;
  //default dowOffset to zero
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset;
  //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  var daynum = Math.floor((this.getTime() - newYear.getTime() - (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
	              the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};
'use strict';
angular.module('hnlyticsApp').service('topPostCommentsService', [
  '$firebase',
  '$q',
  '$timeout',
  '$rootScope',
  '$http',
  function ($firebase, $q, $timeout, $rootScope, $http) {
    var getTopPostComments = function (username, callback) {
      $http.get('/api/' + username + '/top-post').success(function (data) {
        console.log('got the data');
        console.log(data);
        callback(data);
      });
    };
    return {
      topPostActivity: function (username) {
        var deferred = $q.defer();
        getTopPostComments(username, function (data) {
          $timeout(function () {
            console.log(data);
            $rootScope.$apply(function () {
              deferred.resolve(data);
            });
          });
        });
        return deferred.promise;
      }
    };
  }
]);
'use strict';
angular.module('hnlyticsApp').service('topStoriesService', [
  '$rootScope',
  '$timeout',
  '$http',
  '$q',
  '$stateParams',
  function ($rootScope, $timeout, $http, $q, $stateParams) {
    // POST FREQUENCY BY TIME
    var getTopStories = function (callback) {
      console.log($stateParams);
      $http.get('/api/top-stories').success(function (data) {
        console.log('got the data');
        callback(data);
      });
    };
    return {
      getTopStories: function () {
        var deferred = $q.defer();
        getTopStories(function (data) {
          console.log('hey');
          $timeout(function () {
            $rootScope.$apply(function () {
              deferred.resolve(data);
            });
          });
        });
        return deferred.promise;
      }
    };
  }
]);
'use strict';
angular.module('hnlyticsApp').service('PostStatsService', [
  '$q',
  '$timeout',
  '$rootScope',
  '$http',
  function ($q, $timeout, $rootScope, $http) {
    var getPostComments = function (postId, callback) {
      console.log(postId);
      $http.get('/api/posts/' + postId).success(function (data) {
        console.log('got the data');
        console.log(data);
        callback(data);
      });
    };
    return {
      PostActivity: function (postId) {
        var deferred = $q.defer();
        getPostComments(postId, function (data) {
          console.log(data);
          $timeout(function () {
            $rootScope.$apply(function () {
              deferred.resolve(data);
            });
          });
        });
        return deferred.promise;
      }
    };
  }
]);