/*! hello I am an app - v - 2015-11-18
* Copyright (c) 2015 Abix; Licensed  */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html'
        }
      }
    })


  .state('app.todo', {
      url: '/todo/:todo_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/todo.html',
          controller: 'TodoBizCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/app/search');
});

angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $rootScope) {


    $rootScope.pushNotification = {
        checked: true
    };
    $rootScope.pushNotification2 = {
        checked: true
    };
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})


.controller('SettingsCtrl', function () {
    //$rootScope.pushNotification = {checked : true};


})


.controller('TodoBizCtrl', function ($scope, taskservices, $stateParams, $cordovaVibration, $rootScope, $cordovaLocalNotification) {

    $scope.tasks = taskservices.all($stateParams.todo_id);

    $scope.todobiz = {
        task: ""
    };

    // var cordova_vibration = $cordovaVibration;


    $scope.addTask = function () {

        taskservices.add({
            name: $scope.todobiz.task,
            status: false
        }, $stateParams.todo_id);
        $scope.todobiz.task = "";

        if ($scope.tasks.length === 0) {
            $scope.tasks = taskservices.all($stateParams.todo_id);
        }

    };


    $scope.removeTask = function (index) {

        taskservices.remove(index, $stateParams.todo_id);

    };



    $scope.changed = function (index) {


        if ($rootScope.pushNotification.checked) {


            if ($scope.tasks[index].status) {

                //alert("hi");
                try {
                    $cordovaVibration.vibrate(500);
                } catch (e) {
                    alert("vibration");
                }
            }

        }


        if ($rootScope.pushNotification2.checked) {
            var count = 0;


            for (var i = 0; i < $scope.tasks.length; i++) {



                if ($scope.tasks[i].status) {
                    count++;
                }


            }
            if (count == $scope.tasks.length) {

                try {

                    $cordovaLocalNotification.schedule({

                        text: 'Tasks completed'

                    });
                } catch (e) {
                    alert("notification");
                }
                console.log(count);

            }

        }
    };


});
angular.module('starter.services', ['ngStorage'])


  .factory('taskservices', function($localStorage) {

    var toDoLists= [];



    if ($localStorage.toDoLists) {

      toDoLists = $localStorage.toDoLists;
    }



    return {

      all: function(id) {
        for (var i = 0; i < toDoLists.length; i++) {

          var obj = toDoLists[i];
          if (obj.id == id) {

            return obj.tasks;

          }
        }
        return [];
      },

      remove: function(index, id) {

        for (var i = 0; i < toDoLists.length; i++) {

          var obj = toDoLists[i];
          if (obj.id == id) {

            obj.tasks.splice(index, 1);

            $localStorage.toDoLists = toDoLists;

          }
        }


      },

      add: function(todotask, id){

        for (var i = 0; i < toDoLists.length; i++) {

          var obj = toDoLists[i];

          if (obj.id == id) {

            obj.tasks.push(todotask);

            $localStorage.toDoLists = toDoLists;

            return;
          }
        }

          toDoLists.push({id:id, tasks:[todotask]});

          $localStorage.toDoLists = toDoLists;


      }



    };
  });

