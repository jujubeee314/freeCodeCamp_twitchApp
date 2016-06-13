'use strict';

angular.module('myApp.twitchController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'twitchController'
  });
}])

.factory('twitchFactory', ['$http', function($http) {
	var twitchFactory = {};

	var urlBase = "https://api.twitch.tv/kraken";
	var cb = "?callback=JSON_CALLBACK";

	twitchFactory.getChannel = function(name) {
		return $http.jsonp(urlBase + "/channels/" + name + cb)
			.then(function(resp) {
				var channel = {
					channelName: resp.data.display_name,
					live: "",
					status: resp.data.status,
					logo: resp.data.logo,
					channelUrl: resp.data.url
				};
				twitchFactory.getStatus(name)
					.then(function(resp) {
						//console.log(resp);
						channel.live = resp;
					});
				return channel;
			});
	};

	twitchFactory.getStatus = function(name) {
		return $http.jsonp(urlBase + "/streams/" + name + cb)
			.then(function(resp) {
				var status  = resp.data.stream;
				return (status === null || undefined) ? "Offline" : "Live";
			});
	};

	return twitchFactory;

}])

.controller('twitchController', ['$scope', 'twitchFactory', function($scope, twitchFactory) {

	var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "lifecoach1981"];

	$scope.statusFilter = "";

	$scope.showOnly = function(status) {
		$scope.statusFilter = status;
	};

	$scope.streams = [];

	var twitchInit = function() {

		angular.forEach(channels, function(channel, key) {
			twitchFactory.getChannel(channel)
				.then(function(resp) {
					$scope.streams.push(resp);
				});
		});

		
	};

	twitchInit();

}]);