var rasplexServices = angular.module('rasplexRemote.services', []);

rasplexServices.factory("ipAddress", function() {

	var self = {};

	self.setServerIP = function(serverIP) {
		console.log(serverIP);
		window.localStorage["serverIP"] = angular.toJson(serverIP);
	};

	self.getServerIP = function() {
		var serverIP = window.localStorage["serverIP"];
		if (serverIP) {
			console.log("hello");
			return angular.fromJson(serverIP);
		}
		else {
			console.log("world");
			return "0.0.0.0";
		}
	};

	self.setServerPort = function(serverPort) {
		window.localStorage["serverPort"] = angular.toJson(serverPort);
	};

	self.getServerPort = function() {
		var serverPort = window.localStorage["serverPort"];
		if (serverPort) {
			return angular.fromJson(serverPort);
		}
		else {
			return "";
		}
	};

	self.setClientIP = function(clientIP) {
		window.localStorage["clientIP"] = angular.toJson(clientIP);
	};

	self.getClientIP = function() {
		var clientIP = window.localStorage["clientIP"];
		if (clientIP) {
			return angular.fromJson(clientIP);
		}
		else {
			return "";
		}
	};

	self.setClientPort = function(clientPort) {
		window.localStorage["clientPort"] = angular.toJson(clientPort);
	};

	self.getClientPort = function() {
		var clientPort = window.localStorage["clientPort"];
		if (clientPort) {
			return angular.fromJson(clientPort);
		}
		else {
			return "";
		}
	};

	self.getClientURL = function() {
		return "http://" + self.getClientIP() + ":" + self.getClientPort();

	};

	self.getServerURL = function() {
		return "http://" + self.getServerIP() + ":" + self.getServerPort();
	};


	return self;
});

rasplexServices.factory("serverRequests", function($http, $q) {

	self = {};

	var x2js = new X2JS();

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
							.error(function(error) {
								defer.reject(error);
							});
					}
				}
			})
			.error(function(error, status) {
				defer.reject(error);
			});
		
		return defer.promise;
	};

	self.getMovieItem = function(serverURL, movieKey) {
		var defer = $q.defer();
		movieObject = undefined;
		URL = serverURL + "/library/metadata/" + movieKey;
		$http.get(URL, { timeout: 5000 })
			.success(function(result) {
				movieObject = x2js.xml_str2json(result);
				defer.resolve(movieObject.MediaContainer.Video);
			})
			.error(function(error){
				defer.reject(error);
			});
		return defer.promise;
	};

	return self;
});

rasplexServices.factory("clientRequests", function($http, $q) {

	var self = {};

	var x2js = new X2JS();

	var playURL = function(clientIP, clientPort, clientID, serverIP, serverPort, serverID, mediaKey) {
		var URL = "http://" + clientIP + ":" + clientPort + "/player/playback/playMedia?key=%2Flibrary%2Fmetadata%2F" + mediaKey + "&offset=0&X-Plex-Client-Identifier=" + clientID + "&machineIdentifier=" + serverID + "&address=" + serverIP + "&port=" + serverPort + "&protocol=http&path=http%3A%2F%2F" + serverIP + "%3A" + serverPort + "%2Flibrary%2Fmetadata%2F" + mediaKey;
		return URL
	}

	var commands = {
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

	self.sendClientCommand = function(clientURL, command) {
		var moveURL = clientURL + commands[command];
        $http.get(moveURL, { timeout: 1000 } )
            .error(function(data, status, headers, config) {
                alert("ERROR: could not reach server, either your rasplex is down or the request timed out");
            });
	};

	self.playMovie = function(serverIP, serverPort, clientIP, clientPort, mediaKey) {
		var serverURL = "http://" + serverIP + ":" +serverPort;
		var serverObject = $http.get(serverURL);
		var clientURL = "http://" + serverIP + ":" +serverPort + "/clients";
		var clientObject = $http.get(clientURL);
		$q.all([serverObject, clientObject]).then(function(results) {
			var serverID = x2js.xml_str2json(results[0].data).MediaContainer._machineIdentifier;
			var clientID = x2js.xml_str2json(results[1].data).MediaContainer.Server._machineIdentifier;
			$http.get(playURL(clientIP, clientPort, clientID, serverIP, serverPort, serverID, mediaKey));
		});
	}

	return self;

});