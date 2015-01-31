/**
 * @fileoverview controllers for the angular app that handle loading movie lists,
 * saving ip addresses or loading information about a moive item.
 * @author waseema393@gmail.com (Ali Waseem)
 */
var rasplexController = angular.module("rasplexRemote.controllers", []);

/** 
 * Controller for the rasplex remote, takes in movement commands and executes
 * them via HTTP request in the clientRequests factory.
 */
rasplexController.controller("remoteControl", function($scope, $http, clientRequests, ipAddress) {

    /** 
     * navCommand takes in a remote command and executes 
     * the request on the client side
     * @param {string} nav remote command to execute
     */
    $scope.navCommand = function (nav) {
        clientRequests.sendClientCommand(ipAddress.getClientURL(), nav);
    };

});

/**
 * Controller for showing the movie list, displays all movies in every section
 * on the plex server
 */
rasplexController.controller("movieList", function($scope, serverRequests, ipAddress) {
    
    /**
     * init function that is called as soon as the controller is loaded.
     */
    $scope.init = function() {
        $scope.getMovieList();
    };

    /**
     * getMovieList function to fetch all movies on the server side. After fetch
     * load all the movies in a scope variable that the template can access.
     * If no movies are found or an error occured in the request, alert the user 
     * and send an emtpy list to the template
     */
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

/** 
 * Controller for showing a description of each movie item that is selected
 */
rasplexController.controller("movieItem", function($scope, serverRequests, $stateParams, clientRequests, ipAddress) {
    
    /**
     * init function that is called as soon as the controller is loaded.
     */
    $scope.init = function() {
        $scope.getMovieItem();
    };

    /**
     * getMovieItem function will get information on each movie item and
     * initialize a scope variable for the template
     */
    $scope.getMovieItem = function() {
        serverRequests.getMovieItem(ipAddress.getServerURL(), $stateParams.movieKey)
            .then(function(movieItem) {
                $scope.movieItem = movieItem;
            }, function() {
                $scope.movieItem = undefined;
            });
    };

    /**
     * ngRepeatCheck will ensure the directive is iterating over an array.
     * Sometimes a movie item will have an array of different attributes, and
     * sometimes it won"t, this will handle both cases and allow ng-repeat to function 
     * properly
     * @param: {object} directoryObject takes an object
     * @return: {array} returns an array to allow ng-repeat to function properly
     */ 
    $scope.ngRepeatCheck = function(directoryObject) {
        if (Array.isArray(directoryObject)) {
            return directoryObject;
        }
        else{
            return new Array(directoryObject);
        }
    };

    /**
     * playMovie function will play any movie item the user wishs to watch.
     */
    $scope.playMovie = function() {
        clientRequests.playMovie(ipAddress.getServerIP(), ipAddress.getServerPort(), ipAddress.getClientIP(), ipAddress.getClientPort(), $stateParams.movieKey)
    }

    $scope.init();
});

/** 
 * Controller for saving ip addresses for client and server side in the settings menu.
 */
rasplexController.controller("settings", function($scope, $rootScope, ipAddress) {
    
    /**
     * save function will save all ip and ports in local storage that
     * are inputted into the form.
     * @params {string} serverIP, serverPort, clientIP, and clientPort information about
     * server and client side
     */
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