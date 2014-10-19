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
    $routeProvider.when('/', {
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
    }).when('/latest', {
      templateUrl: 'views/latest.html',
      controller: 'LatestCtrl as vm',
      resolve: {
        activityData: [
          'chartsService',
          function (chartsService) {
            return chartsService.lastPostActivity();
          }
        ]
      }
    }).when('/toppost', {
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
    }).when('/global', {
      templateUrl: 'views/global.html',
      controller: 'AboutCtrl'
    }).otherwise({ redirectTo: '/' });
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
  '$rootScope',
  'UserStatsService',
  function ($scope, $rootScope, UserStatsService) {
    $scope.$on('child:changed', function (data) {
      console.log('===============================', data);
    });
    $rootScope.user = 'pg';
    $scope.current = 1;
    $scope.setCurrent = function (val) {
      $scope.current = val;
    };
    function getData() {
      UserStatsService.results($rootScope.user).then(function (data) {
        $scope.userStats = data;
        $scope.dgntData = [
          {
            label: 'Comments',
            value: data.comments.length,
            color: '#949FB1'
          },
          {
            label: 'Stories',
            value: data.stories.length,
            color: '#F7464A'
          }
        ];
        return data;
      });
    }
    getData();
    $scope.pullUserData = function (inputUser) {
      $rootScope.user = inputUser;
      getData();
      $scope.$broadcast('New User Data', inputUser);
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
    $scope.lastPostChart = activityData;
    $scope.$on('New User Data', function (event, data) {
      subsByPeriodService.getSubsByPeriod().then(function (data) {
        $scope.subsByPeriod = data;
      });
      chartsService.latestPostActivity().then(function (data) {
        $scope.lastPostChart = data;
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
  'UserStatsService',
  function ($scope, $firebase, $timeout, $sce, activityData, UserStatsService) {
    $scope.topPostChart = activityData;
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
  'subsByPeriodService',
  'chartsService',
  'subsByPeriod',
  function ($scope, timeOfDayChart, subsByPeriodService, chartsService, subsByPeriod) {
    $scope.chart = timeOfDayChart;
    $scope.subsByPeriod = subsByPeriod;
    $scope.$on('New User Data', function (event, data) {
      subsByPeriodService.getSubsByPeriod().then(function (data) {
        $scope.subsByPeriod = data;
      });
      chartsService.timeOfDay().then(function (data) {
        $scope.chart = data;
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
  'getSubsService',
  '$q',
  '$rootScope',
  '$localStorage',
  function ($firebase, $timeout, $http, getSubsService, $q, $rootScope, $localStorage) {
    var getUserData = function (user, cb) {
      var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
      var items = ref.child('item');
      var userRef = ref.child('user').child(user);
      var userSync = $firebase(userRef);
      var userObj = userSync.$asObject();
      getSubsService.subs(user).then(function (data) {
        userObj.$loaded().then(function () {
          var stories = data[1];
          var comments = data[2];
          var submissions = data[0];
          var lastPost = stories[0];
          var topPost = {};
          var topPostScore = 0;
          var created = new Date(userObj.created * 1000);
          var div = document.createElement('div');
          div.innerHTML = userObj.about;
          var text = div.textContent || div.innerText;
          var about = _.unescape(text);
          for (var i = 0; i < stories.length; i++) {
            if (stories[i].score > topPostScore) {
              topPost = stories[i];
              topPostScore = stories[i].score;
            }
          }
          ;
          // AVERAGE POINTS PER POST
          var average = Math.round(function () {
              var totalPts = 0;
              for (var i = 0; i < submissions.length; i++) {
                if (submissions[i].score) {
                  totalPts += submissions[i].score;
                } else if (submissions[i].kids) {
                  totalPts += submissions[i].kids.length;
                }
              }
              return totalPts / submissions.length;
            }());
          cb({
            topPost: topPost,
            lastPost: lastPost,
            average: average,
            stories: stories,
            comments: comments,
            submissions: submissions,
            karma: userObj.karma,
            about: about,
            submitted: userObj.submitted,
            createdAt: created.getMonth().toString() + '/' + created.getFullYear().toString()
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
angular.module('hnlyticsApp').service('getSubsService', [
  '$firebase',
  '$q',
  '$localStorage',
  '$timeout',
  '$rootScope',
  function ($firebase, $q, $localStorage, $timeout, $rootScope) {
    var submissions = [];
    var stories = [];
    var comments = [];
    var getSubs = function (user, cb) {
      if ($localStorage.user && $localStorage.user.id === $rootScope.user) {
        submissions = $localStorage.user.submissions;
        stories = $localStorage.user.stories;
        comments = $localStorage.user.comments;
        console.log('it was in local storage');
        cb(submissions, stories, comments);
        return;
      } else if ($localStorage.user) {
        $localStorage.$reset();
      } else {
        var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
        var items = ref.child('item');
        var userRef = ref.child('user').child($rootScope.user);
        var q = $q.defer();
        userRef.child('submitted').once('value', function (submitted) {
          var max;
          // limit query to 1000 items
          if (submitted.val().length > 1000) {
            max = 1000;
          } else if (submitted.val().length < 1000) {
            // 
            max = submitted.val().length;
          }
          var userSubmitted = submitted.val().slice(0, max);
          for (var i = 0; i < userSubmitted.length; i++) {
            (function (i) {
              items.child(userSubmitted[i]).once('value', function (sub) {
                if (i === userSubmitted.length - 1) {
                  var userData = {
                      id: user,
                      submissions: submissions,
                      stories: stories,
                      comments: comments
                    };
                  // $localStorage.user = {}
                  // $localStorage.user = userData
                  q.resolve({
                    submissions: submissions,
                    stories: stories,
                    comments: comments
                  });
                  cb(submissions, stories, comments);
                }
                if (sub.child('type').val() === null) {
                  return;
                }
                if (sub.child('type').val() === 'story') {
                  submissions.push(sub.val());
                  stories.push(sub.val());
                }
                if (sub.child('type').val() === 'comment') {
                  submissions.push(sub.val());
                  comments.push(sub.val());
                } else {
                  return;
                }
                ;
              });
            }(i));
          }
          ;
        });
        return q.promise;
      }
    };
    return {
      subs: function (user) {
        var deferred = $q.defer();
        getSubs(user, function (subs, stories, comments) {
          var data = [
              subs,
              stories,
              comments
            ];
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
angular.module('hnlyticsApp').service('averageTimeOfDayService', [
  '$firebase',
  '$timeout',
  '$http',
  'getSubsService',
  '$q',
  '$rootScope',
  function ($firebase, $timeout, $http, getSubsService, $q, $rootScope) {
    // POST FREQUENCY BY TIME
    var getAverageTimes = function () {
      var promise = getSubsService.subs($rootScope.user).then(function (data) {
          var stories = data[1];
          var comments = data[2];
          var submissions = data[0];
          var timesOfTheDay = [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ];
          var averageTimes = submissions.map(function (sub) {
              var subTime = new Date(sub.time * 1000);
              return subTime.getHours();
            }).reduce(function (last, now) {
              var index = last[0].indexOf(now);
              if (index === -1) {
                last[0].push(now);
                last[1].push(1);
              } else {
                last[1][index] += 1;
              }
              return last;
            }, [
              [],
              []
            ]).reduce(function (last, now, index, context) {
              var zip = [];
              last.forEach(function (word, i) {
                zip.push([
                  word,
                  context[1][i]
                ]);
              });
              return zip;
            });
          for (var i = 0; i < averageTimes.length; i++) {
            timesOfTheDay[averageTimes[i][0]] = averageTimes[i][1];
          }
          ;
          return timesOfTheDay;
        });
      return promise;
    };
    return { timesOfTheDay: getAverageTimes };
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
          return averageTimeChart;
        });
      return promise;
    };
    var getLatestPostChart = function () {
      var promise = lastPostCommentsService.lastPostActivity().then(function (data) {
          var frequencyArr = _.toArray(data);
          var labels = [];
          var freqData = [];
          for (var i = 0; i < frequencyArr.length; i++) {
            var freqDate = frequencyArr[i].day;
            for (var j = 0; j < 23; j++) {
              console.log(freqDate);
              labels.push(freqDate + ' ' + j);
              if (frequencyArr[i][j]) {
                freqData.push(frequencyArr[i][j]);
              } else {
                freqData.push(0);
              }
            }
            ;
          }
          ;
          console.log(labels);
          var lastPostChart = {
              labels: labels,
              datasets: [{
                  fillColor: 'rgba(151,187,205,0)',
                  strokeColor: '#FF6600',
                  pointColor: 'rgba(151,187,205,0)',
                  pointStrokeColor: '#e67e22',
                  data: freqData
                }]
            };
          return lastPostChart;
        });
      return promise;
    };
    var getTopPostChart = function () {
      var promise = topPostCommentsService.topPostActivity().then(function (data) {
          var frequencyArr = _.toArray(data);
          var labels = [];
          var freqData = [];
          for (var i = 0; i < frequencyArr.length; i++) {
            var freqDate = frequencyArr[i].day;
            for (var j = 0; j < 23; j++) {
              console.log(freqDate);
              labels.push(freqDate + ' ' + j);
              if (frequencyArr[i][j]) {
                freqData.push(frequencyArr[i][j]);
              } else {
                freqData.push(0);
              }
            }
            ;
          }
          ;
          console.log(labels);
          console.log(freqData);
          var topPostChart = {
              labels: labels,
              datasets: [{
                  fillColor: 'rgba(151,187,205,0)',
                  strokeColor: '#FF6600',
                  pointColor: 'rgba(151,187,205,0)',
                  pointStrokeColor: '#e67e22',
                  data: freqData
                }]
            };
          return topPostChart;
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
  'getSubsService',
  function ($firebase, $q, $localStorage, $timeout, $rootScope, $http, getSubsService) {
    var getLastPostComments = function (callback) {
      var promise = getSubsService.subs($rootScope.user).then(function (data) {
          var stories = data[1];
          var lastPost = stories[0];
          var byDay = {};
          var lastPostCommentDates = function (cb) {
            var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
            var items = ref.child('item');
            var results = [];
            var j = 0;
            var recCount = 0;
            var resCount = 0;
            // $localStorage.lastPost = {}
            function recurse(kids) {
              for (var i = 0; i < kids.length; i++) {
                if (kids[j]) {
                  (function (j) {
                    items.child(kids[j]).once('value', function (comment) {
                      recCount++;
                      $timeout(function () {
                        results.push(comment.val());
                        if (j === 46 && recCount === 47) {
                          cb(results);
                          return;
                        }
                        if (comment.child('kids').val() && results.length < 300) {
                          recurse(comment.child('kids').val());
                        }
                        return;
                      });
                    });
                  }(j));
                }
                j++;
              }
            }
            ;
            recurse(lastPost.kids);
          };
          var compileFrequencyObj = function () {
            lastPostCommentDates(function (results) {
              for (var i = 0; i < results.length; i++) {
                if (results[i].time) {
                  var date = new Date(results[i].time * 1000);
                  var day = date.getDate();
                  var hours = date.getHours();
                  console.log(day, hours);
                  if (byDay[day]) {
                    if (byDay[day][hours]) {
                      byDay[day][hours]++;
                    } else {
                      byDay[day][hours] = 1;
                      console.log(byDay[day]);
                    }
                  } else {
                    byDay[day] = { day: day };
                    byDay[day][hours] = 1;
                  }
                }
              }
              ;
              callback(byDay);
              return;
            });
          };
          compileFrequencyObj();
        });  // return callback(promise)
    };
    return {
      lastPostActivity: function () {
        var deferred = $q.defer();
        getLastPostComments(function (data) {
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
angular.module('hnlyticsApp').service('subsByPeriodService', [
  '$firebase',
  '$timeout',
  '$http',
  'getSubsService',
  '$q',
  '$rootScope',
  function ($firebase, $timeout, $http, getSubsService, $q, $rootScope) {
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
      // this might need to be wrapped in a funciton
      var promise = getSubsService.subs($rootScope.user).then(function (data) {
          var stories = data[1];
          var comments = data[2];
          var submissions = data[0];
          var matchesYear = function (obj, year) {
            return year === obj;
          };
          var matchesMonth = function (obj, month) {
            return month === obj;
          };
          var matchesWeek = function (obj, week) {
            return week === obj;
          };
          // SUBMISSIONS BY YEAR
          thisYearsSubs = _.filter(submissions, function (obj) {
            var now = new Date();
            var year = now.getFullYear();
            var objDate = new Date(obj.time * 1000);
            var objYear = objDate.getFullYear();
            return matchesYear(objYear, year);
          });
          lastYearsSubs = _.filter(submissions, function (obj) {
            var now = new Date();
            var year = now.getFullYear() - 1;
            var objDate = new Date(obj.time * 1000);
            var objYear = objDate.getFullYear();
            return matchesYear(objYear, year);
          });
          // SUBMISSIONS BY MONTH
          thisMonthsSubs = _.filter(submissions, function (obj) {
            var now = new Date();
            var month = now.getMonth();
            var objDate = new Date(obj.time * 1000);
            var objMonths = objDate.getMonth();
            return matchesMonth(objMonths, month);
          });
          lastMonthsSubs = _.filter(submissions, function (obj) {
            var now = new Date();
            var month = now.getMonth() - 1;
            var objDate = new Date(obj.time * 1000);
            var objMonths = objDate.getMonth();
            return matchesMonth(objMonths, month);
          });
          // SUBMISSIONS BY WEEK
          thisWeeksSubs = _.filter(submissions, function (obj) {
            var now = new Date();
            var week = now.getWeek();
            var objDate = new Date(obj.time);
            var objWeek = objDate.getWeek();
            return matchesWeek(objWeek, week);
          });
          lastWeeksSubs = _.filter(submissions, function (obj) {
            var now = new Date();
            var week = now.getWeek() - 1;
            var objDate = new Date(obj.time);
            var objWeek = objDate.getWeek();
            return matchesWeek(objWeek, week);
          });
          console.log(lastMonthsTot.length);
          console.log(thisMonthsSubs.length - lastMonthsSubs.length / lastMonthsSubs.length);
          return {
            thisYearsTot: thisYearsSubs.length,
            lastYearsTot: lastYearsSubs.length,
            thisMonthsTot: thisMonthsSubs.length,
            lastMonthsTot: lastMonthsSubs.length,
            thisWeeksTot: thisWeeksSubs.length,
            lastWeeksTot: lastWeeksSubs.length,
            yearsDiff: thisYearsSubs.length - lastYearsSubs.length / lastYearsSubs.length,
            monthsDiff: thisMonthsSubs.length - lastMonthsSubs.length / lastMonthsSubs.length,
            weeksDiff: thisWeeksSubs.length - lastWeeksSubs.length / lastWeeksSubs.length
          };
        });
      return promise;
    };
    return { getSubsByPeriod: getSubsByPeriod };
  }
]);
// APPEND GET WEEK METHOD TO THE PROTOTYPE
Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
  dowOffset = typeof dowOffset == 'int' ? dowOffset : 0;
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
  'getSubsService',
  function ($firebase, $q, $localStorage, $timeout, $rootScope, $http, getSubsService) {
    var getTopPostComments = function (callback) {
      var promise = getSubsService.subs($rootScope.user).then(function (data) {
          var stories = data[1];
          var topPost = {};
          var topPostScore = 0;
          for (var i = 0; i < stories.length; i++) {
            if (stories[i].score > topPostScore) {
              topPost = stories[i];
              topPostScore = stories[i].score;
            }
          }
          ;
          var byDay = {};
          var topPostCommentDates = function (cb) {
            var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
            var items = ref.child('item');
            var results = [];
            var j = 0;
            var recCount = 0;
            var resCount = 0;
            // $localStorage.topPost = {}
            function recurse(kids) {
              var recCount = 0;
              for (var i = 0; i < kids.length; i++) {
                if (kids[j]) {
                  (function (j) {
                    recCount++;
                    items.child(kids[j]).once('value', function (comment) {
                      $timeout(function () {
                        results.push(comment.val());
                        recCount--;
                        if (j === kids.length - 1 && recCount === 0) {
                          console.log('end');
                          cb(results);
                          return;
                        }
                        if (comment.child('kids').val() && results.length < 300) {
                        }
                        return;
                      });
                    });
                  }(j));
                }
                j++;
              }
            }
            ;
            recurse(topPost.kids);
          };
          var compileFrequencyObj = function () {
            // TODO: if timeline is longer than one week, use daily increments
            topPostCommentDates(function (results) {
              console.log('heyyy');
              for (var i = 0; i < results.length; i++) {
                if (results[i].time) {
                  var date = new Date(results[i].time * 1000);
                  var day = date.getDate();
                  var hours = date.getHours();
                  console.log(day, hours);
                  if (byDay[day]) {
                    if (byDay[day][hours]) {
                      byDay[day][hours]++;
                    } else {
                      byDay[day][hours] = 1;
                      console.log(byDay[day]);
                    }
                  } else {
                    byDay[day] = { day: day };
                    byDay[day][hours] = 1;
                  }
                }
              }
              ;
              callback(byDay);
              return;
            });
          };
          compileFrequencyObj();
        });  // return callback(promise)
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