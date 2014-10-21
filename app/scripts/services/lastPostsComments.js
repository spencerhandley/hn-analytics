'use strict';
angular.module('hnlyticsApp')
.service('lastPostCommentsService', ['$firebase', '$q', '$timeout', '$rootScope', '$http', function($firebase, $q, $timeout, $rootScope, $http){
	var getLastPostComments = function(callback){
		$http.get('/api/'+$rootScope.user+'/last-post')
		.success(function(data){
			console.log('got the data');
			console.log(data);
			callback(data);
		});
	};
	return {
		lastPostActivity: function(){
			var deferred = $q.defer(); 
			getLastPostComments(function(data){
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