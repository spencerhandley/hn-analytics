'use strict';
angular.module('hnlyticsApp')
.service('averageTimeOfDayService', function($firebase, $timeout, $http, getSubsService, $q, $rootScope){
	// POST FREQUENCY BY TIME
	var getAverageTimes = function(){
		var promise = getSubsService.subs($rootScope.user).then(function(data){
			var stories = data[1];
			var comments = data[2];
			var submissions = data[0];
			var timesOfTheDay = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			var averageTimes = submissions
			  .map(function(sub) {
			  	var subTime = new Date(sub.time*1000);
			    return subTime.getHours();
			  })
			  .reduce(function(last, now) {
			    var index = last[0].indexOf(now);
			    if (index === -1) {
			      last[0].push(now);
			      last[1].push(1);
			    } else {
			      last[1][index] += 1;
			    }
			    return last;
			  }, [[], []])
			  .reduce(function(last, now, index, context) {
			    var zip = [];
			    last.forEach(function(word, i) {
			      zip.push([word, context[1][i]]);
			    });
			    return zip;
			  });

			for (var i = 0; i < averageTimes.length; i++) {
			  	timesOfTheDay[averageTimes[i][0]]= averageTimes[i][1];
			};
			return timesOfTheDay
		});
		return promise
	}
	return {
		timesOfTheDay: getAverageTimes

	}
});