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

rasplexServices.factory("navigation", function(){
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