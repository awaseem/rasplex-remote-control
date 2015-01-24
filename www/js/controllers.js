var rasplexController = angular.module('rasplexRemote.controllers', []);

var clientURL = "http://192.168.1.70:3005";
var serverURL = "http://192.168.1.50:32400";

rasplexController.controller("remoteControl", function($scope, $http, serverRequests, clientRequests) {

    $scope.navCommand = function (nav) {
        clientRequests.sendClientCommand(clientURL, nav);
    };

});

rasplexController.controller("movieList", function($scope, serverRequests) {

    serverRequests.getMovieList(serverURL)
        .then(function(movieList){
            console.log(movieList);
            $scope.movieList = movieList;
        }, function(){
            $scope.movieList = [];
        });

    $scope.getThumbanil = function(URL) {
        return serverURL + URL;
    };
});
