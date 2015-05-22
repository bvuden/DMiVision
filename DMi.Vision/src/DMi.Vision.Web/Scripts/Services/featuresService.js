//(function () {
//    'use strict';
//    var featuresService = angular.module('featuresService', ['ngResource']);

//    featuresService.factory('Features', ['$resource',
//        function ($resource) {
//            return $resource('http://localhost:1482/api/features', {}, {
//                query: { method: 'GET', params: {}, isArray: true }
//            });
//        }
//    ]);
//})();

(function () {
    'use strict';

    angular
        .module('featuresService', ['ngResource'])
        .factory('Feature', Feature);

    Feature.$inject = ['$resource'];

    function Feature($resource) {
        return $resource('http://localhost:1482/api/features/:id');
    }


})();