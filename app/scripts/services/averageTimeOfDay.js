'use strict';
angular.module('hnlyticsApp')
.service('averageTimeOfDayService', ['$rootScope', '$timeout', '$http', '$q', '$stateParams', function($rootScope, $timeout, $http, $q, $stateParams){
	// POST FREQUENCY BY TIME
	var getAverageTimes = function(username, callback){
		console.log($stateParams)
		$http.get('/api/'+username+'/hourly-averages')
		.success(function(data){
			console.log('got the data');
			console.log(data);
			callback(data);
		});
	};
	return {
		timesOfTheDay: function(username){
			var deferred = $q.defer(); 
			getAverageTimes(username, function(data){
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