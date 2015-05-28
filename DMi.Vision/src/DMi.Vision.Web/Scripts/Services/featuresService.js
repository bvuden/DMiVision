//(function () {
//    'use strict';
//    angular.module('featuresService', ['ngResource'])
//        .factory('Feature', ['$resource', 
//    function ($resource) {
//        var resource =
//          $resource('http://localhost:port/api/features/:id', {
//              port: ":1482",
//              id: '@id'
//          }, {
//              update: { method: 'PUT'},
//          });

//        return resource;
//    }
//        ])



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
