'use strict';
angular.module('hnlyticsApp')
.service('lastPostCommentsService', ['$firebase', '$q', '$timeout', '$rootScope', '$http', function($firebase, $q, $timeout, $rootScope, $http){
	var getLastPostComments = function(username,callback){
		$http.get('/api/'+username+'/last-post')
		.success(function(data){
			console.log('got the data');
			console.log(data);
			callback(data);
		});
	};
	return {
		lastPostActivity: function(username){
			var deferred = $q.defer(); 
			getLastPostComments(username, function(data){
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