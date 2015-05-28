(function () {
    'use strict';

    config.$inject = ['$routeProvider', '$locationProvider'];


    angular.module('appVision', [
        //'oauth',
        'afOAuth2',
        
        // Angular modules 
        'ngRoute',
        'ngStorage',
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
            controller: 'FeaturesAddController',
            requireToken: true
        })
        .when('/features/detail/:id', {
            templateUrl: '/Views/detail.html',
            controller: 'FeaturesDetailController'
        });
        //.otherwise({
        //    redirectTo: '/'
        //});

        //$locationProvider.html5Mode(true);
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
})();