'use strict';
angular.module('hnlyticsApp')
.service('chartsService', ['lastPostCommentsService', 'PostStatsService', 'topPostCommentsService', 'averageTimeOfDayService', function(lastPostCommentsService, PostStatsService, topPostCommentsService, averageTimeOfDayService){
	
	var getAveTimeChart = function(username){
		console.log(username)
		var promise = averageTimeOfDayService.timesOfTheDay(username).then(function(timesOfTheDay){
			var averageTimeChart = {
			    labels : ['midnight', '1am', '2am', '3am', '4am', '5am', '6am','7am', '8am', '9am', '10am', '11am', 'Noon', '1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'],
			    datasets : [
			        {
			            fillColor : 'rgba(151,187,205,0)',
			            strokeColor : '#FF6600',
			            pointColor : 'rgba(151,187,205,0)',
			            pointStrokeColor : '#e67e22',
			            data : timesOfTheDay
			        }
			    ], 
			};
			var returnData = {
				chart: averageTimeChart,
				chartInfo: timesOfTheDay
			};
			return returnData;
		});
		return promise;
	};

	var getLatestPostChart = function(username){

		var promise = lastPostCommentsService.lastPostActivity(username).then(function(data){
			var lastPostChart = {
			    labels : data.labels,
			    datasets : [
			        {
			            fillColor : 'rgba(151,187,205,0)',
			            strokeColor : '#FF6600',
			            pointColor : 'rgba(151,187,205,0)',
			            pointStrokeColor : '#e67e22',
			            data : data.commentArr
			        }
			    ], 
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
	var PostChart = function(postId){
		console.log(postId)
		var promise = PostStatsService.PostActivity(postId).then(function(data){
			console.log(data)
			var PostChart = {
			    labels : data.labels,
			    datasets : [
			        {
			            fillColor : 'rgba(151,187,205,0)',
			            strokeColor : '#FF6600',
			            pointColor : 'rgba(151,187,205,0)',
			            pointStrokeColor : '#e67e22',
			            data : data.commentArr
			        }
			    ], 
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
	var getTopPostChart = function(username){

		var promise = topPostCommentsService.topPostActivity(username).then(function(data){
			var topPostChart = {
			    labels : data.labels,
			    datasets : [
			        {
			            fillColor : 'rgba(151,187,205,0)',
			            strokeColor : '#FF6600',
			            pointColor : 'rgba(151,187,205,0)',
			            pointStrokeColor : '#e67e22',
			            data : data.commentArr
			        }
			    ], 
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

}]);