/**
 * @fileoverview "Main" method including the angular run method and config
 * method for url routing
 * @author waseema393@gmail.com (Ali Waseem)
 */
var rasplexRemote = angular.module("rasplexRemote", ["ionic", "rasplexRemote.controllers", "rasplexRemote.services"]);

/** 
 * Angular run method, sets up the different attributes for the mobile 
 * mobile platform.
 */
rasplexRemote.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
});

/**
 * URL router, handles all calls made from href in the templates.
 * Depending what URL is being called, the appropriate view and controller is loaded.
 * If the URL is not recognized by the router, it will route to the default.
 * All controllers are defined in controller.js. 
 */
rasplexRemote.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("app", {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
        })

        .state("app.remote", {
            url: "/remote",
            views: {
                "menuContent": {
                    templateUrl: "templates/remote.html",
                    controller: "remoteControl"
                }
            }
        })

        .state("app.movies", {
            url: "/movies",
            views: {
                "menuContent": {
                    templateUrl: "templates/movies.html",
                    controller: "movieList"
                }
            }
        })

        .state("app.settings", {
            url: "/settings",
            views: {
                "menuContent": {
                    templateUrl: "templates/settings.html",
                    controller: "settings"
                }
            }
        })

        .state("app.movie", {
            url: "/movies/:movieKey",
            views: {
                "menuContent": {
                    templateUrl: "templates/movie.html",
                    controller: "movieItem"
                }
            }
        })
    
    // if none of the above states are matched, use this as the default
    $urlRouterProvider.otherwise("/app/remote");
});
