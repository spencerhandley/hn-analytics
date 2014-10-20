'use strict';
angular.module('hnlyticsApp')
.service('averageTimeOfDayService', ['$firebase', '$timeout', '$http', '$q', '$rootScope', function($firebase, $timeout, $http, $q, $rootScope){
	// POST FREQUENCY BY TIME
	var getAverageTimes = function(callback){
		$http.get('/api/'+$rootScope.user+'/hourly-averages')
		.success(function(data){
			console.log('got the data');
			console.log(data);
			callback(data);
		});
	};
	return {
		timesOfTheDay: function(){
			var deferred = $q.defer(); 
			getAverageTimes(function(data){
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