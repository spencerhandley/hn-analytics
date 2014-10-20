'use strict';
angular.module('hnlyticsApp')
.service('topPostCommentsService', [ '$firebase', '$q', '$localStorage', '$timeout', '$rootScope', '$http', function($firebase, $q, $localStorage, $timeout, $rootScope, $http){
	var getTopPostComments = function(callback){
		$http.get('/api/'+$rootScope.user+'/top-post')
		.success(function(data){
			console.log('got the data');
			console.log(data);
			callback(data);
		});
	};
	return {
		topPostActivity: function(){
			var deferred = $q.defer(); 
			getTopPostComments(function(data){
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