var rasplexServices = angular.module('rasplexRemote.services', []);

rasplexServices.factory("ipAddress", function() {

	self = this;

	self.saveIpAddress = function(ipObject) {
		window.localStorage["ipAddress"] = angular.toJson(ipObject);
	};

	self.getIpAddress = function() {
		var ipAddresses = window.localStorage["ipAddress"];
		if (ipAddresses) {
			return angular.fromJson(ipAddresses);
		}
		else {
			return [];
		}
	}

	return self;
});

rasplexServices.factory("httpRequests", function($http, $q, navigation) {

	self = this;

	var x2js = new X2JS();

	self.sendClientCommand = function(clientURL, command) {
		var moveURL = clientURL + navigation.commands[command];
        $http.get(moveURL, { timeout: 1000 } )
            .error(function(data, status, headers, config) {
                alert("ERROR: could not reach server, either your rasplex is down or the request timed out");
            });
	};

	self.getMovieList = function(serverURL) {
		var defer = $q.defer();
		var movieList = [];
		var URL = serverURL + "/library/sections/";

		$http.get(URL, { timeout: 5000 })
			.success(function(result){
				sectionsObject = x2js.xml_str2json(result);
				for (var i = 0; i < sectionsObject.MediaContainer.Directory.length; i++) {
					if (sectionsObject.MediaContainer.Directory[i]._type == "movie") {
						movieLibraryURL = URL + sectionsObject.MediaContainer.Directory[i]._key + "/all";
						$http.get(movieLibraryURL, { timeout: 5000 })
							.success(function(result)  {
								movieList.push.apply(movieList, x2js.xml_str2json(result).MediaContainer.Video);
								defer.resolve(movieList);
							})
							.error(function(error, status) {
								movieList.push.apply(movieList, [])
								defer.reject(movieList);
							});
					}
				}
			})
			.error(function(error, status) {
				defer.reject(movieList);
			});
		
		return defer.promise;
	}

	return self;
});

rasplexServices.factory("navigation", function() {
	self = this;

	self.commands = {
		home: "/player/navigation/home",
		music: "/player/navigation/music",
		up: "/player/navigation/moveUp",
		down: "/player/navigation/moveDown",
		left: "/player/navigation/moveLeft",
		right: "/player/navigation/moveRight",
		select: "/player/navigation/select",
		back: "/player/navigation/back",
		play: "/player/playback/play",
		pause: "/player/playback/pause",
		stop: "/player/playback/stop",
		skipNext: "/player/playback/skipNext",
		skipPrevious: "/player/playback/skipPrevious",
		stepForward: "/player/playback/stepForward",
		stepBack: "/player/playback/stepBack"
	};

	return self;
});