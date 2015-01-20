var rasplexController = angular.module('rasplexRemote.controllers', []);

rasplexController.controller("remoteControl", function($scope, $http, navigation) {

    var baseURL = "http://192.168.1.70:3005";

    $scope.navCommand = function (nav) {
        var upURL = baseURL + navigation.commands[nav];
        $http.get(upURL)
            .success(function(data, status, headers, config) {
                
            })
            .error(function(data, status, headers, config) {
                alert("Something went wrong");
            });
    };

});
