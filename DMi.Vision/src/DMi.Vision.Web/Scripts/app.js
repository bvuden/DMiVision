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
        'votesService',
        'userInfoService'
        // 3rd Party Modules        

    ])
        .factory('Shared')
        .config(config);

    function config($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            //templateUrl: '/Views/list.html',
            controller: 'MainController',
            requireToken: true

        })
        .when('/features', {
            templateUrl: '/Views/list.html',
            controller: 'FeaturesListController',
            requireToken: true

        })
        .when('/features/add', {
            templateUrl: '/Views/add.html',
            controller: 'FeaturesAddController',
            requireToken: true
        })
        .when('/features/detail/:id', {
            templateUrl: '/Views/detail.html',
            controller: 'FeaturesDetailController',
            requireToken: true
        })
        .when('/features/edit/:id', {
            templateUrl: '/Views/edit.html',
            controller: 'FeaturesEditController',
            requireToken: true
        })
        .when('/features/delete/:id', {
            templateUrl: '/Views/delete.html',
            controller: 'FeaturesDeleteController',
            requireToken: true
        });
        //.otherwise({
        //    redirectTo: '/'
        //});

        //$locationProvider.html5Mode(true);
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
})();