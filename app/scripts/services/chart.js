'use strict';
angular.module('hnlyticsApp')
.service('chartsService', function(lastPostCommentsService, topPostCommentsService, averageTimeOfDayService){
	
	var getAveTimeChart = function(){
		var promise = averageTimeOfDayService.timesOfTheDay().then(function(timesOfTheDay){
			var averageTimeChart = {
			    labels : ["midnight", "1am", "2am", "3am", "4am", "5am", "6am","7am", "8am", "9am", "10am", "11am", "Noon", "1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"],
			    datasets : [
			        {
			            fillColor : "rgba(151,187,205,0)",
			            strokeColor : "#FF6600",
			            pointColor : "rgba(151,187,205,0)",
			            pointStrokeColor : "#e67e22",
			            data : timesOfTheDay
			        }
			    ], 
			};
			return averageTimeChart;
		});
		return promise;
	}

	var getLatestPostChart = function(){

		var promise = lastPostCommentsService.lastPostActivity().then(function(data){
			
			var frequencyArr = _.toArray(data)
			var labels = []
			var freqData = []
			for (var i = 0; i < frequencyArr.length; i++) {
				var freqDate = frequencyArr[i].day
				for (var j = 0; j < 23; j++) {
					console.log(freqDate)
			 		labels.push(freqDate + " " + j);
			 		if(frequencyArr[i][j]){
			 			freqData.push(frequencyArr[i][j])
			 		} else {
			 			freqData.push(0)
			 		}
				};
			};


			console.log(labels)
			var lastPostChart = {
			    labels : labels,
			    datasets : [
			        {
			            fillColor : "rgba(151,187,205,0)",
			            strokeColor : "#FF6600",
			            pointColor : "rgba(151,187,205,0)",
			            pointStrokeColor : "#e67e22",
			            data : freqData
			        }
			    ], 
			};
			return lastPostChart;
		});
		return promise;
	}
	var getTopPostChart = function(){

		var promise = topPostCommentsService.topPostActivity().then(function(data){
			var frequencyArr = _.toArray(data)
			var labels = []
			var freqData = []
			for (var i = 0; i < frequencyArr.length; i++) {
				var freqDate = frequencyArr[i].day
				for (var j = 0; j < 23; j++) {
					console.log(freqDate)
			 		labels.push(freqDate + " " + j);
			 		if(frequencyArr[i][j]){
			 			freqData.push(frequencyArr[i][j])
			 		} else {
			 			freqData.push(0)
			 		}
				};
			};
			

			console.log(labels)
			console.log(freqData)
			var topPostChart = {
			    labels : labels,
			    datasets : [
			        {
			            fillColor : "rgba(151,187,205,0)",
			            strokeColor : "#FF6600",
			            pointColor : "rgba(151,187,205,0)",
			            pointStrokeColor : "#e67e22",
			            data : freqData
			        }
			    ], 
			};
			return topPostChart;
		});
		return promise;
	}

	return {
		timeOfDay: getAveTimeChart,
		lastPostActivity: getLatestPostChart,
		topPostActivity: getTopPostChart
	}

});