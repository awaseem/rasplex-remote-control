var rasplexController = angular.module('rasplexRemote.controllers', []);

rasplexController.controller("remoteControl", function($scope, $http, navigation) {

    var baseURL = "http://192.168.1.70:3005";

    $scope.goUp = function () {
        var upURL = baseURL + navigation.commands.up;
        $http.get(upURL)
            .success(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            })
            .error(function(data, status, headers, config) {
                console.log(error);
            });
    };

});
