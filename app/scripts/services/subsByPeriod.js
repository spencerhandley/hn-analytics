'use strict';
angular.module('hnlyticsApp')
.service('subsByPeriodService', ['$firebase', '$timeout', '$http', 'getSubsService', '$q', '$rootScope', function($firebase, $timeout, $http, getSubsService, $q, $rootScope){
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
	var getSubsByPeriod = function(){

		// this might need to be wrapped in a funciton
		var promise = getSubsService.subs($rootScope.user).then(function(data){
			var stories = data[1];
			var comments = data[2];
			var submissions = data[0];

			var matchesYear = function(obj, year){
				return year === obj;
			};

			var matchesMonth = function(obj, month){
				return month === obj;
			};

			var matchesWeek = function(obj, week){
				return week === obj;
			};
				// SUBMISSIONS BY YEAR
			thisYearsSubs = _.filter(submissions, function(obj){
				var now = new Date();
				var year = now.getFullYear();
				var objDate = new Date(obj.time*1000);
				var objYear = objDate.getFullYear();
				return matchesYear(objYear, year);
			});
			lastYearsSubs = _.filter(submissions, function(obj){
				var now = new Date();
				var year = now.getFullYear()-1;
				var objDate = new Date(obj.time*1000);
				var objYear = objDate.getFullYear();
				return matchesYear(objYear, year);
			});

			// SUBMISSIONS BY MONTH
			thisMonthsSubs = _.filter(submissions, function(obj){
				var now = new Date();
				var month = now.getMonth();
				var objDate = new Date(obj.time*1000);
				var objMonths = objDate.getMonth();
				return matchesMonth(objMonths, month);
			});
			lastMonthsSubs = _.filter(submissions, function(obj){
				var now = new Date();
				var month = now.getMonth()-1;
				var objDate = new Date(obj.time*1000);
				var objMonths = objDate.getMonth();
				return matchesMonth(objMonths, month);
			});

			// SUBMISSIONS BY WEEK
			thisWeeksSubs = _.filter(submissions, function(obj){
				var now = new Date();
				var week = now.getWeek();
				var objDate = new Date(obj.time);
				var objWeek = objDate.getWeek();
				return matchesWeek(objWeek, week);
			});
			lastWeeksSubs = _.filter(submissions, function(obj){
				var now = new Date();
				var week = now.getWeek()-1;
				var objDate = new Date(obj.time);
				var objWeek = objDate.getWeek();
				return matchesWeek(objWeek, week);
			});
			console.log(lastMonthsTot.length)
			console.log(thisMonthsSubs.length - lastMonthsSubs.length / lastMonthsSubs.length)
			return {

				thisYearsTot: thisYearsSubs.length,
				lastYearsTot: lastYearsSubs.length,
				thisMonthsTot: thisMonthsSubs.length,
				lastMonthsTot: lastMonthsSubs.length,
				thisWeeksTot: thisWeeksSubs.length,
				lastWeeksTot: lastWeeksSubs.length,
				// Difference between periods
				yearsDiff: thisYearsSubs.length - lastYearsSubs.length / lastYearsSubs.length,
				monthsDiff: thisMonthsSubs.length - lastMonthsSubs.length / lastMonthsSubs.length,	
				weeksDiff:	thisWeeksSubs.length - lastWeeksSubs.length / lastWeeksSubs.length
			}
		});
		return promise
	}

	return {
		getSubsByPeriod: getSubsByPeriod
	}
}]);



// APPEND GET WEEK METHOD TO THE PROTOTYPE

Date.prototype.getWeek = function (dowOffset) {
	/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

	    dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
	    var newYear = new Date(this.getFullYear(),0,1);
	    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
	    day = (day >= 0 ? day : day + 7);
	    var daynum = Math.floor((this.getTime() - newYear.getTime() - 
	    (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
	    var weeknum;
	    //if the year starts before the middle of a week
	    if(day < 4) {
	        weeknum = Math.floor((daynum+day-1)/7) + 1;
	        if(weeknum > 52) {
	            nYear = new Date(this.getFullYear() + 1,0,1);
	            nday = nYear.getDay() - dowOffset;
	            nday = nday >= 0 ? nday : nday + 7;
	            /*if the next year starts before the middle of
	              the week, it is week #1 of that year*/
	            weeknum = nday < 4 ? 1 : 53;
	        }
	    }
	    else {
	        weeknum = Math.floor((daynum+day-1)/7);
	    }
	    return weeknum;
	};