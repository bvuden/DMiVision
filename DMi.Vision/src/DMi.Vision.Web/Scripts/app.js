(function () {
    'use strict';

    config.$inject = ['$routeProvider', '$locationProvider'];


    angular.module('appVision', [
        'oauth',
        // Angular modules 
        'ngRoute',
        // Custom modules 
        'featuresService',
        // 3rd Party Modules        

    ]).config(config);

    function config($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            templateUrl: '/Views/list.html',
            controller: 'FeaturesListController'
        })
        .when('/features/add', {
            templateUrl: '/Views/add.html',
            controller: 'FeaturesAddController'
        })
        .when('/features/detail/:id', {
            templateUrl: '/Views/detail.html',
            controller: 'FeaturesDetailController'
        });

        $locationProvider.html5Mode(true).hashPrefix('!');;
    }
})();