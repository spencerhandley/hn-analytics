'use strict';
angular.module('hnlyticsApp')
.service('topPostCommentsService', function($firebase, $q, $localStorage, $timeout, $rootScope, $http, getSubsService){
	var getTopPostComments = function(callback){
		var promise = getSubsService.subs($rootScope.user).then(function(data){
			var stories = data[1];
			var topPost = {}
			var topPostScore = 0

			for (var i = 0; i < stories.length; i++) {
				if(stories[i].score > topPostScore){
					topPost = stories[i];
					topPostScore = stories[i].score;
				}
			};
			var byDay = {}
			var topPostCommentDates = function(cb){
				var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
				var items = ref.child('item');
				var results = []
				var j = 0
				var recCount = 0
				var resCount = 0
				// $localStorage.topPost = {}
				function recurse(kids){
					var recCount = 0

					for(var i = 0; i < kids.length ; i++){
						if(kids[j]){
							(function(j){
								recCount++
								items.child(kids[j]).once('value', function(comment){
									$timeout(function(){
										results.push(comment.val());
										recCount--

										if(j === kids.length-1 && recCount === 0){
											console.log("end")
											cb(results)
											return
										}
										if(comment.child('kids').val() && results.length<300){
											
											// recurse(comment.child('kids').val());
										}
										return;
									})
								});
							})(j);
						}
						j++
					}

				};
				recurse(topPost.kids);
			}
			var compileFrequencyObj = function(){
				// TODO: if timeline is longer than one week, use daily increments

				topPostCommentDates(function(results){
					console.log("heyyy")
					for (var i = 0; i < results.length; i++) {
						if(results[i].time){
							var date = new Date(results[i].time*1000);
							var day = date.getDate();
							var hours = date.getHours();
							console.log(day, hours)
							if(byDay[day]){
								if(byDay[day][hours]){
									byDay[day][hours]++;
								} else {
									byDay[day][hours] = 1;
									console.log(byDay[day])
								}
							} else {
								byDay[day] = {day:day};
								byDay[day][hours] = 1;
							}
						}
					};
					callback(byDay);
					return;
				});
			};
			compileFrequencyObj();
		});
		// return callback(promise)
	} 
	return {
		topPostActivity: function(){
			var deferred = $q.defer(); 
			getTopPostComments(function(data){
				$timeout(function(){
					console.log(data)
					$rootScope.$apply(function(){
		        		deferred.resolve(data);
		       		});
				});
			});
	       	return deferred.promise;
		}
	}
});