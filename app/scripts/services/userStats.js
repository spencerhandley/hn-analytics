'use strict';
angular.module('hnlyticsApp')
.service('UserStatsService', ['$firebase', '$sce', '$timeout', '$stateParams', '$http', '$q', '$rootScope', function($firebase,$sce, $timeout, $stateParams, $http, $q, $rootScope){
	var getUserData = function( cb){
		console.log($stateParams.userId)
		var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
		var userRef = ref.child('user').child($stateParams.userId);
		var userSync = $firebase(userRef);
		var userObj = userSync.$asObject();
		userObj.$loaded(function(){
			$http.get('/api/'+$stateParams.userId+'/user-info')
			.success(function(data){
				console.log(data);
				var stories = data.stories;
				var comments = data.comments;
				var about = $sce.trustAsHtml(data.basic.about);
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

		results: function(){
			var deferred = $q.defer(); 
			getUserData(function(data){
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