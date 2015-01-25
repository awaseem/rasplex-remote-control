var rasplexController = angular.module('rasplexRemote.controllers', []);

var clientURL = "http://192.168.1.70:3005";
var serverURL = "http://192.168.1.50:32400";

rasplexController.controller("remoteControl", function($scope, $http, serverRequests, clientRequests) {

    $scope.navCommand = function (nav) {
        clientRequests.sendClientCommand(clientURL, nav);
    };

});

rasplexController.controller("movieList", function($scope, serverRequests) {
    
    $scope.init = function() {
        $scope.movieList = [];
        $scope.getMovieList();
    };

    $scope.getMovieList = function() { 
        serverRequests.getMovieList(serverURL)
            .then(function(movieList) {
                $scope.movieList = movieList;
            }, function() {
                $scope.movieList = [];
            });
    };

    $scope.init();

});

rasplexController.controller("movieItem", function($scope, serverRequests, $stateParams, clientRequests) {
    
    $scope.init = function() {
        $scope.getMovieItem();
        $scope.playMovie();
    };

    $scope.getMovieItem = function() {
        serverRequests.getMovieItem(serverURL, $stateParams.movieKey)
            .then(function(movieItem) {
                $scope.movieItem = movieItem;
            }, function() {
                $scope.movieItem = undefined;
            });
    };

    $scope.playMovie = function() {
        clientRequests.playMovie("192.168.1.50", "32400", "192.168.1.70", "3005", "111");
    };

    $scope.ngRepeatCheck = function(directoryObject) {
        if (Array.isArray(directoryObject)) {
            return directoryObject;
        }
        else{
            return new Array(directoryObject);
        }
    };

    $scope.init();
});