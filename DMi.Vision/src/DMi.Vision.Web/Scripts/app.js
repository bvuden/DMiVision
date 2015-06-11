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

        .directive('spinner', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                template: '<div id="overlay"></div>',
                scope: {
                    show: '=',
                    delay: '@'
                },
                link: function (scope, elem, attrs) {
                    var showTimer;

                    //This is where all the magic happens!
                    // Whenever the scope variable updates we simply
                    // show if it evaluates to 'true' and hide if 'false'
                    scope.$watch('show', function (newVal) {
                        newVal ? showSpinner() : hideSpinner();
                    });

                    function showSpinner() {
                        //If showing is already in progress just wait
                        if (showTimer) return;

                        //Set up a timeout based on our configured delay to show
                        // the element (our spinner)
                        showTimer = $timeout(showElement.bind(this, true), getDelay());
                    }

                    function hideSpinner() {
                        //This is important. If the timer is in progress
                        // we need to cancel it to ensure everything stays
                        // in sync.
                        if (showTimer) {
                            $timeout.cancel(showTimer);
                        }

                        showTimer = null;

                        showElement(false);
                    }

                    function showElement(show) {
                        show ? elem.css({ display: '' }) : elem.css({ display: 'none' });
                    }

                    function getDelay() {
                        var delay = parseInt(scope.delay);

                        return angular.isNumber(delay) ? delay : 200;
                    }
                }
            };
        }])
        .config(config);


    function config($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            //templateUrl: '/Views/list.html',
            controller: 'MainController',
           // requireToken: true

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