'use strict';
angular.module('hnlyticsApp')
.service('UserStatsService', ['$firebase', '$timeout', '$http', '$q', '$rootScope', function($firebase, $timeout, $http, $q, $rootScope){
	var getUserData = function(user, cb){
		var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
		var userRef = ref.child('user').child(user);
		var userSync = $firebase(userRef);
		var userObj = userSync.$asObject();
		userObj.$loaded(function(){
			$http.get('/api/'+$rootScope.user+'/user-info')
			.success(function(data){
				console.log(data);
				var stories = data.stories;
				var comments = data.comments;
				var about = data.basic.about;
				var karma = data.basic.karma;
				var submitted = data.comments + data.stories
				var created = new Date(data.basic.created_at_i*1000);
				cb({stories:stories,
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