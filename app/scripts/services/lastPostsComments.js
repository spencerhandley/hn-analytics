'use strict';
angular.module('hnlyticsApp')
.service('lastPostCommentsService', function($firebase, $q, $localStorage, $timeout, $rootScope, $http, getSubsService){
	var getLastPostComments = function(callback){
		var promise = getSubsService.subs($rootScope.user).then(function(data){
			var stories = data[1];
			var lastPost = stories[0]
			var byDay = {}
			var lastPostCommentDates = function(cb){
				var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
				var items = ref.child('item');
				var results = []
				var j = 0
				var recCount = 0
				var resCount = 0
				// $localStorage.lastPost = {}
				function recurse(kids){
					for(var i = 0; i < kids.length ; i++){
						if(kids[j]){
							(function(j){
								items.child(kids[j]).once('value', function(comment){
									recCount++
									$timeout(function(){
										results.push(comment.val());
										if(j === 46 && recCount === 47){
											cb(results)
											return
										}
										if(comment.child('kids').val() && results.length<300){
											
											recurse(comment.child('kids').val());
										}
										return;
									})
								});
							})(j);
						}
						j++
					}

				};
				recurse(lastPost.kids);
			}
			var compileFrequencyObj = function(){
				lastPostCommentDates(function(results){
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
		lastPostActivity: function(){
			var deferred = $q.defer(); 
			getLastPostComments(function(data){
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