'use strict';
angular.module('hnlyticsApp')
.service('getSubsService', ['$firebase', '$q', '$localStorage', '$timeout', '$rootScope', function($firebase, $q, $localStorage, $timeout, $rootScope){ 

	var submissions = [];
	var stories = [];
	var comments = [];
	var getSubs = function(user, cb){


		if($localStorage.user && $localStorage.user.id === $rootScope.user){
			submissions = $localStorage.user.submissions
			stories = $localStorage.user.stories
			comments = $localStorage.user.comments
			console.log("it was in local storage")
			cb(submissions, stories, comments)
			return
		} else if ($localStorage.user) {
			$localStorage.$reset()
		} else{
			var ref = new Firebase('https://hacker-news.firebaseio.com/v0/');
			var items = ref.child('item');
			var userRef = ref.child('user').child($rootScope.user);

			var q = $q.defer()
			userRef.child('submitted').once('value', function(submitted){
				var max;
				// limit query to 1000 items
				if(submitted.val().length > 1000){
					max=1000
				} else if ( submitted.val().length <1000){
				// 
					max = submitted.val().length
				}
				var userSubmitted = submitted.val().slice(0, max)
				for (var i = 0; i < userSubmitted.length; i++) {
					(function(i){
						items.child(userSubmitted[i]).once('value', function(sub){
							if(i === userSubmitted.length-1){
								var userData = {
									id: user,
									submissions:submissions,
									stories:stories,
									comments:comments
								}
								// $localStorage.user = {}
								// $localStorage.user = userData
								q.resolve({submissions: submissions, stories: stories, comments: comments});
								cb(submissions, stories, comments);
							}
							if(sub.child('type').val() === null){
								return;
							}
							if(sub.child('type').val() === "story"){
								submissions.push(sub.val());
								stories.push(sub.val());
							}
							if(sub.child('type').val() === "comment"){
								submissions.push(sub.val());
								comments.push(sub.val());
							} else{
								return;
							};
						});
					})(i);
				};
			});
			return q.promise;
		}

	}

	return {
		subs: function(user){
			var deferred = $q.defer(); 
			getSubs(user,function(subs, stories, comments){
				var data = [subs, stories, comments]
				$timeout(function(){
					$rootScope.$apply(function(){
		        		deferred.resolve(data);
		       		});
				})
	       	});
	       	return deferred.promise;
		}
	}
}]);