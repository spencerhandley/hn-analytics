'use strict';
angular.module('hnlyticsApp')
.service('UserStatsService', ['$firebase', '$timeout', '$http', 'getSubsService', '$q', '$rootScope', '$localStorage', function($firebase, $timeout, $http, getSubsService, $q, $rootScope, $localStorage){
	var getUserData = function(user, cb){
		var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
		var items = ref.child('item');
		var userRef = ref.child('user').child(user);
		var userSync = $firebase(userRef);
		var userObj = userSync.$asObject();
		getSubsService.subs(user).then(function(data){
			userObj.$loaded().then(function() {
				var stories = data[1];
				var comments = data[2];
				var submissions = data[0];

				var lastPost = stories[0];
				var topPost = {}
				var topPostScore = 0

				var created = new Date(userObj.created*1000);
				var div = document.createElement("div");
				div.innerHTML = userObj.about;
				var text = div.textContent || div.innerText ;
				var about =  _.unescape(text);


				for (var i = 0; i < stories.length; i++) {
					if(stories[i].score > topPostScore){
						topPost = stories[i];
						topPostScore = stories[i].score;
					}
				};

				// AVERAGE POINTS PER POST
				var average = Math.round((function(){
					var totalPts = 0;
					for (var i = 0; i < submissions.length; i++) {
						if(submissions[i].score){
							totalPts += submissions[i].score;
						} else if (submissions[i].kids){
							totalPts += submissions[i].kids.length;
						}
					}
					return totalPts/submissions.length;
				})());
				cb({topPost: topPost,
					lastPost: lastPost,
					average: average,
					stories:stories,
					comments: comments,
					submissions: submissions,
					karma: userObj.karma,
					about: about,
					submitted: userObj.submitted,
					createdAt: created.getMonth().toString()+ '/' + created.getFullYear().toString(),

				});
			});
		});
	}
	return {

		results: function(user){
			var deferred = $q.defer(); 
			getUserData(user, function(data){
				$timeout(function() {
					$rootScope.$apply(function(){
		        		deferred.resolve(data);
		       		});
				});
			});
			return deferred.promise;
		}
	};
}]);