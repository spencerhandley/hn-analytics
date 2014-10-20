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
  'ngStorage'
]).constant('_', window._).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/:userId', {
      templateUrl: 'views/main.html',
      controller: 'TimeOfDayCtrl',
      resolve: {
        'timeOfDayChart': [
          'chartsService',
          function (chartsService) {
            return chartsService.timeOfDay();
          }
        ],
        'subsByPeriod': [
          'subsByPeriodService',
          function (subsByPeriodService) {
            return subsByPeriodService.getSubsByPeriod();
          }
        ]
      }
    }).when('/:userId/latest', {
      templateUrl: 'views/latest.html',
      controller: 'LatestCtrl',
      resolve: {
        activityData: [
          'chartsService',
          function (chartsService) {
            return chartsService.lastPostActivity();
          }
        ]
      }
    }).when('/:userId/toppost', {
      templateUrl: 'views/toppost.html',
      controller: 'TopPostCtrl',
      resolve: {
        activityData: [
          'chartsService',
          function (chartsService) {
            return chartsService.topPostActivity();
          }
        ]
      }
    }).when('/:userId/wordmap', {
      templateUrl: 'views/global.html',
      controller: 'WorldMapCtrl'
    }).otherwise({ redirectTo: '/pg' });
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
  '$route',
  '$routeParams',
  '$rootScope',
  'UserStatsService',
  function ($scope, $location, $route, $routeParams, $rootScope, UserStatsService) {
    $scope.$on('route:changed', function (data) {
      console.log('DATA', data);
      $rootScope.user = data;
      getData();
      // $location.path('/'+inputUser)
      console.log('===============================', data);
    });
    $rootScope.user = 'pg';
    $scope.current = 1;
    $scope.setCurrent = function (val) {
      $scope.current = val;
    };
    $scope.myChartOptions = {};
    function getData() {
      UserStatsService.results($rootScope.user).then(function (data) {
        console.log(data);
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
      $rootScope.user = inputUser;
      getData();
      $location.path('/' + inputUser);
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
  'chartsService',
  'activityData',
  function ($scope, chartsService, activityData) {
    $scope.lastPostChart = activityData.chart;
    $scope.chartInfo = activityData.chartInfo;
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
  '$firebase',
  '$timeout',
  '$sce',
  'activityData',
  function ($scope, $firebase, $timeout, $sce, activityData) {
    $scope.topPostChart = activityData.chart;
    $scope.chartInfo = activityData.chartInfo;
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
  'timeOfDayChart',
  '$routeParams',
  '$rootScope',
  'subsByPeriodService',
  'chartsService',
  'subsByPeriod',
  function ($scope, timeOfDayChart, $routeParams, $rootScope, subsByPeriodService, chartsService, subsByPeriod) {
    $rootScope.user = $routeParams.userId;
    $scope.$emit('route:changed', $routeParams.userId);
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
'use strict';
angular.module('hnlyticsApp').service('UserStatsService', [
  '$firebase',
  '$timeout',
  '$http',
  '$q',
  '$rootScope',
  '$localStorage',
  function ($firebase, $timeout, $http, $q, $rootScope, $localStorage) {
    var getUserData = function (user, cb) {
      var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
      var userRef = ref.child('user').child(user);
      var userSync = $firebase(userRef);
      var userObj = userSync.$asObject();
      userObj.$loaded(function () {
        $http.get('/api/' + $rootScope.user + '/user-info').success(function (data) {
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
      results: function (user) {
        var deferred = $q.defer();
        getUserData(user, function (data) {
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
  '$firebase',
  '$timeout',
  '$http',
  '$q',
  '$rootScope',
  function ($firebase, $timeout, $http, $q, $rootScope) {
    // POST FREQUENCY BY TIME
    var getAverageTimes = function (callback) {
      $http.get('/api/' + $rootScope.user + '/hourly-averages').success(function (data) {
        console.log('got the data');
        console.log(data);
        callback(data);
      });
    };
    return {
      timesOfTheDay: function () {
        var deferred = $q.defer();
        getAverageTimes(function (data) {
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
  'topPostCommentsService',
  'averageTimeOfDayService',
  function (lastPostCommentsService, topPostCommentsService, averageTimeOfDayService) {
    var getAveTimeChart = function () {
      var promise = averageTimeOfDayService.timesOfTheDay().then(function (timesOfTheDay) {
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
    var getLatestPostChart = function () {
      var promise = lastPostCommentsService.lastPostActivity().then(function (data) {
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
              chartInfo: data.postObj
            };
          return returnData;
        });
      return promise;
    };
    var getTopPostChart = function () {
      var promise = topPostCommentsService.topPostActivity().then(function (data) {
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
              chartInfo: data.postObj
            };
          return returnData;
        });
      return promise;
    };
    return {
      timeOfDay: getAveTimeChart,
      lastPostActivity: getLatestPostChart,
      topPostActivity: getTopPostChart
    };
  }
]);
'use strict';
angular.module('hnlyticsApp').service('lastPostCommentsService', [
  '$firebase',
  '$q',
  '$localStorage',
  '$timeout',
  '$rootScope',
  '$http',
  function ($firebase, $q, $localStorage, $timeout, $rootScope, $http) {
    var getLastPostComments = function (callback) {
      $http.get('/api/' + $rootScope.user + '/last-post').success(function (data) {
        console.log('got the data');
        console.log(data);
        callback(data);
      });
    };
    return {
      lastPostActivity: function () {
        var deferred = $q.defer();
        getLastPostComments(function (data) {
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
  '$localStorage',
  '$timeout',
  '$rootScope',
  '$http',
  function ($firebase, $q, $localStorage, $timeout, $rootScope, $http) {
    var getTopPostComments = function (callback) {
      $http.get('/api/' + $rootScope.user + '/top-post').success(function (data) {
        console.log('got the data');
        console.log(data);
        callback(data);
      });
    };
    return {
      topPostActivity: function () {
        var deferred = $q.defer();
        getTopPostComments(function (data) {
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