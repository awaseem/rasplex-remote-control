/**
 * @fileoverview services for the angular app that interact with the controllers
 * to fill scope data and handle various HTTP requests
 * @author waseema393@gmail.com (Ali Waseem)
 */
var rasplexServices = angular.module("rasplexRemote.services", []);

/**
 * IP Address factory allows the controllers to interact with IP address
 * and port data.
 * All values are stored in local sotrage in form of JSON.
 */
rasplexServices.factory("ipAddress", function() {

	var self = {};

	/**
	 * setServerIP saves server ip address into local storage.
	 * @param {string} serverIP ip address of the server.
	 */
	self.setServerIP = function(serverIP) {
		window.localStorage["serverIP"] = angular.toJson(serverIP);
	};

	/**
	 * getServerIP returns the server ip in local storage
	 * @return: {string} serverIP if exists; else return an empty string
	 */
	self.getServerIP = function() {
		var serverIP = window.localStorage["serverIP"];
		if (serverIP) {
			return angular.fromJson(serverIP);
		}
		else {
			return "";
		}
	};

	/**
	 * setServerPort saves server port into local storage.
	 * @param {string} serverPort port of the server.
	 */
	self.setServerPort = function(serverPort) {
		window.localStorage["serverPort"] = angular.toJson(serverPort);
	};

	/**
	 * getServerPort returns the server port in local storage
	 * @return: {string} serverPort if exists; else return an empty string
	 */
	self.getServerPort = function() {
		var serverPort = window.localStorage["serverPort"];
		if (serverPort) {
			return angular.fromJson(serverPort);
		}
		else {
			return "";
		}
	};

	/**
	 * setClientIP saves client ip address into local storage.
	 * @param {string} clientIP ip address of the client.
	 */
	self.setClientIP = function(clientIP) {
		window.localStorage["clientIP"] = angular.toJson(clientIP);
	};

	/**
	 * getClientIP returns the client ip in local storage
	 * @return: {string} clientIP if exists; else return an empty string
	 */
	self.getClientIP = function() {
		var clientIP = window.localStorage["clientIP"];
		if (clientIP) {
			return angular.fromJson(clientIP);
		}
		else {
			return "";
		}
	};

	/**
	 * setClientPort saves client port into local storage.
	 * @param {string} clientPort port of the client.
	 */
	self.setClientPort = function(clientPort) {
		window.localStorage["clientPort"] = angular.toJson(clientPort);
	};

	/**
	 * getClientPort returns the client port in local storage
	 * @return: {string} client port if exists; else return an empty string
	 */
	self.getClientPort = function() {
		var clientPort = window.localStorage["clientPort"];
		if (clientPort) {
			return angular.fromJson(clientPort);
		}
		else {
			return "";
		}
	};
	
	/**
	 * getClientURL returns the full url to client requests 
	 * @return {string} clientURL full url for client requests
	 */
	self.getClientURL = function() {
		return "http://" + self.getClientIP() + ":" + self.getClientPort();

	};
	
	/**
	 * getServerURL returns the full url to server requests 
	 * @return {string} serverURL full url for server requests
	 */
	self.getServerURL = function() {
		return "http://" + self.getServerIP() + ":" + self.getServerPort();
	};

	return self;
});

/**
 * factory that handles all server requests such as getting movie lists or
 * getting specfic information about a movie item
 */
rasplexServices.factory("serverRequests", function($http, $q) {

	self = {};

	// server returns xml, x2js will convert those reponses to json for easy parsing
	var x2js = new X2JS();

	/**
	 * getMovieList function will return all movies located in 
	 * different sections. It does an HTTP request to the server 
	 * to find all movies 
	 * @param: {string} serverURL full URL to the server
	 * @return: {promise} returns a promise for all the movie lists
	 */
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

	/** 
	 * getMovieItem function will return all attributes about
	 * the movie item selected in the template
	 * @params {string} serverURL and movieKey attributes are needed to find 
	 * the movie list
	 */
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

/**
 * factory that handles all client requests such as playing a movie
 * or sending remote commands to the server
 */
rasplexServices.factory("clientRequests", function($http, $q) {

	var self = {};

	// server returns xml, x2js will convert those reponses to json for easy parsing
	var x2js = new X2JS();

	// Creates a play URL which will be sent to the client to play specific movie
	var playURL = function(clientIP, clientPort, clientID, serverIP, serverPort, serverID, mediaKey) {
		var URL = "http://" + clientIP + ":" + clientPort + "/player/playback/playMedia?key=%2Flibrary%2Fmetadata%2F" + mediaKey + "&offset=0&X-Plex-Client-Identifier=" + clientID + "&machineIdentifier=" + serverID + "&address=" + serverIP + "&port=" + serverPort + "&protocol=http&path=http%3A%2F%2F" + serverIP + "%3A" + serverPort + "%2Flibrary%2Fmetadata%2F" + mediaKey;
		return URL
	}

	// Object for all commands available for the client
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

	/**
	 * sendClientCommand allows us to send a command to the client 
	 * that launchs a action on the server. If there are any errors the 
	 * user is prompted to an alert.
	 * @params {string} clientURL and command 
	 */
	self.sendClientCommand = function(clientURL, command) {
		var moveURL = clientURL + commands[command];
        $http.get(moveURL, { timeout: 1000 } )
            .error(function(data, status, headers, config) {
                alert("ERROR: could not reach server, either your rasplex is down or the request timed out");
            });
	};

	/**
	 * playMovie function will find machine ID for both the server and client.
	 * After it obtains both it will make a call to playURL and an HTTP request to the server
	 * @params {string} serverIP, serverPort, clientIP, clientPort and mediaKey
	 */
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