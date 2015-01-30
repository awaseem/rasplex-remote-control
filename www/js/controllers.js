var rasplexController = angular.module('rasplexRemote.controllers', []);

var clientURL = "http://192.168.1.70:3005";
var serverURL = "http://192.168.1.50:32400";

rasplexController.controller("remoteControl", function($scope, $http, serverRequests, clientRequests, ipAddress) {

    $scope.init = function () {
    };

    $scope.navCommand = function (nav) {
        clientRequests.sendClientCommand(ipAddress.getClientURL(), nav);
    };

    $scope.init();

});

rasplexController.controller("movieList", function($scope, serverRequests, ipAddress) {
    
    $scope.init = function() {
        $scope.getMovieList();
    };

    $scope.getMovieList = function() { 
        serverRequests.getMovieList(ipAddress.getServerURL())
            .then(function(movieList) {
                $scope.movieList = movieList;
            }, function() {
                alert("ERROR: could not resolve IP address for client or server");
                $scope.movieList = [];
            });
        $scope.$broadcast("scroll.refreshComplete");
    };

    $scope.init();

});

rasplexController.controller("movieItem", function($scope, serverRequests, $stateParams, clientRequests, ipAddress) {
    
    $scope.init = function() {
        $scope.getMovieItem();
    };

    $scope.getMovieItem = function() {
        serverRequests.getMovieItem(ipAddress.getServerURL(), $stateParams.movieKey)
            .then(function(movieItem) {
                $scope.movieItem = movieItem;
            }, function() {
                $scope.movieItem = undefined;
            });
    };

    $scope.ngRepeatCheck = function(directoryObject) {
        if (Array.isArray(directoryObject)) {
            return directoryObject;
        }
        else{
            return new Array(directoryObject);
        }
    };

    $scope.playMovie = function() {
        clientRequests.playMovie(ipAddress.getServerIP(), ipAddress.getServerPort(), ipAddress.getClientIP(), ipAddress.getClientPort(), $stateParams.movieKey)
    }

    $scope.init();
});

rasplexController.controller("settings", function($scope, $rootScope, ipAddress) {

    $scope.serverIP = undefined;
    
    $scope.save = function(serverIP, serverPort, clientIP, clientPort) {
        if (serverIP == undefined || serverPort == undefined || clientIP == undefined || clientPort == undefined) {
            alert("ERROR: all fields must be filled");
            return 
        }
        ipAddress.setServerIP(serverIP);
        ipAddress.setClientIP(clientIP);
        ipAddress.setServerPort(serverPort);
        ipAddress.setClientPort(clientPort);
    };

});