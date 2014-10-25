'use strict';
angular.module('hnlyticsApp')
.service('topPostCommentsService', [ '$firebase', '$q', '$timeout', '$rootScope', '$http', function($firebase, $q,  $timeout, $rootScope, $http){
	var getTopPostComments = function(username, callback){
		$http.get('/api/'+username+'/top-post')
		.success(function(data){
			console.log('got the data');
			console.log(data);
			callback(data);
		});
	};
	return {
		topPostActivity: function(username){
			var deferred = $q.defer(); 
			getTopPostComments(username, function(data){
				$timeout(function(){
					console.log(data);
					$rootScope.$apply(function(){
		        		deferred.resolve(data);
		       		});
				});
			});
	       	return deferred.promise;
		}
	};
}]);