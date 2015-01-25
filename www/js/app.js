// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var rasplexRemote = angular.module('rasplexRemote', ['ionic', 'rasplexRemote.controllers', 'rasplexRemote.services']);

rasplexRemote.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

rasplexRemote.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
  })

  .state('app.remote', {
    url: "/remote",
    views: {
      'menuContent': {
        templateUrl: "templates/remote.html",
        controller: "remoteControl"
      }
    }
  })

  .state('app.movies', {
    url: "/movies",
    views: {
      'menuContent': {
        templateUrl: "templates/movies.html",
        controller: "movieList"
      }
    }
  })

  .state('app.movie', {
    url: "/movies/:movieKey",
    views: {
      'menuContent': {
        templateUrl: "templates/movie.html",
        controller: "movieItem"
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/remote');
});
