var rasplexController = angular.module('rasplexRemote.controllers', []);

rasplexController.controller("remoteControl", function($scope, $http, navigation, httpRequests) {

    var clientURL = "http://192.168.1.70:3005";

    var serverURL = "http://192.168.1.50:32400";

    $scope.navCommand = function (nav) {
        
        httpRequests.getMovieList(serverURL)
            .then(function (result) {
                console.log(result);
            }, function(err) {
                console.log(error);
            });

        //httpRequests.sendClientCommand(clientURL, nav);
    };



});
