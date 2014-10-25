'use strict';
angular.module('hnlyticsApp')
.service('PostStatsService', ['$q', '$timeout', '$rootScope', '$http', function($q, $timeout, $rootScope, $http){
	var getPostComments = function(postId,callback){
		$http.get('/api/posts/'+postId)
		.success(function(data){
			console.log('got the data');
			console.log(data);
			callback(data);
		});
	};
	return {
		PostActivity: function(postId){
			var deferred = $q.defer(); 
			getPostComments(postId, function(data){
				console.log(data);
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