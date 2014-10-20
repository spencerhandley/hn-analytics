'use strict';
angular.module('hnlyticsApp')
.service('UserStatsService', ['$firebase', '$timeout', '$http', '$q', '$rootScope', '$localStorage', function($firebase, $timeout, $http, $q, $rootScope, $localStorage){
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
				var created = new Date(userObj.createdAt*1000);
				cb({stories:stories,
					comments: comments,
					karma: karma,
					about: about,
					submitted: userObj.submitted,
					createdAt: created.getMonth().toString()+ '/' + created.getFullYear().toString()		
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