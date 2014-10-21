'use strict';
angular.module('hnlyticsApp')
.service('topStoriesService', ['$rootScope', '$timeout', '$http', '$q', '$stateParams', function($rootScope, $timeout, $http, $q, $stateParams){
	// POST FREQUENCY BY TIME
	var getTopStories = function(callback){
		console.log($stateParams)
		$http.get('/api/top-stories')
		.success(function(data){
			console.log('got the data');
			callback(data);
		});
	};
	return {
		getTopStories: function(){
			var deferred = $q.defer(); 
			getTopStories(function(data){
				console.log("hey")
				$timeout(function(){
					$rootScope.$apply(function(){
		        		deferred.resolve(data);
		       		});
				});
			});
	       	return deferred.promise;
		}
	};
}]);